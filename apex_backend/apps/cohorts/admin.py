from django.contrib import admin
from .models import (
	Cohort,
	Assessment,
	Question,
	AssessmentAttempt,
	CohortEnrollment,
	PSPRegistration,
	PSPVerification,
	CohortCoachAssignment,
	CohortWalletEntry,
	WhatsAppInviteRequest,
)
from .allocation import allocate_cohort_rewards

@admin.action(description='Allocate coach payouts and cohort wallets')
def allocate_rewards(modeladmin, request, queryset):
	for cohort in queryset:
		try:
			result = allocate_cohort_rewards(cohort.id)
			modeladmin.message_user(
				request,
				f"{cohort.title}: allocated {result['coaches']} coaches; admin remainder KES {result['admin_remainder']}",
			)
		except ValueError as exc:
			modeladmin.message_user(request, f'{cohort.title}: {exc}', level='ERROR')


@admin.register(Cohort)
class CohortAdmin(admin.ModelAdmin):
	list_display = ('title', 'payment_tier', 'status', 'participant_count', 'assessment_unlock_threshold')
	list_filter = ('payment_tier', 'status', 'assessment_unlock_threshold')
	search_fields = ('title', 'profession')
	actions = (allocate_rewards,)

	def participant_count(self, obj):
		return obj.enrollments.count()


@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
	list_display = ('title', 'cohort', 'difficulty', 'time_limit_minutes', 'is_active')
	list_filter = ('is_active', 'difficulty', 'cohort')
	search_fields = ('title', 'cohort__title')
admin.site.register(Question)
admin.site.register(AssessmentAttempt)
admin.site.register(CohortEnrollment)


class PSPVerificationInline(admin.TabularInline):
	model = PSPVerification
	extra = 0
	fields = ('amount_received', 'payment_reference', 'notes', 'verified_by', 'verified_at')
	readonly_fields = ('verified_by', 'verified_at')


@admin.register(PSPRegistration)
class PSPRegistrationAdmin(admin.ModelAdmin):
	list_display = (
		'full_name',
		'phone_number',
		'psp_tier',
		'cohort',
		'amount_expected',
		'status',
		'payment_till',
		'created_at',
	)
	list_filter = ('status', 'psp_tier', 'cohort')
	search_fields = ('full_name', 'phone_number', 'user__email', 'user__username')
	readonly_fields = ('id', 'created_at', 'payment_till')
	inlines = (PSPVerificationInline,)

	def payment_till(self, obj):
		return PSPRegistration.PAYMENT_TILL_NUMBER

	payment_till.short_description = 'Payment Till'

	def save_formset(self, request, form, formset, change):
		instances = formset.save(commit=False)
		for instance in instances:
			instance.verified_by = request.user
			instance.save()
			sync_psp_registration(instance.registration)
		for instance in formset.deleted_objects:
			instance.delete()
		formset.save_m2m()


@admin.register(PSPVerification)
class PSPVerificationAdmin(admin.ModelAdmin):
	list_display = (
		'registration',
		'amount_received',
		'payment_reference',
		'verified_by',
		'verified_at',
	)
	list_filter = ('verified_at',)
	search_fields = (
		'registration__full_name',
		'registration__phone_number',
		'payment_reference',
		'verified_by__email',
	)
	readonly_fields = ('id', 'verified_by', 'verified_at')

	def save_model(self, request, obj, form, change):
		obj.verified_by = request.user
		super().save_model(request, obj, form, change)
		sync_psp_registration(obj.registration)


@admin.register(CohortCoachAssignment)
class CohortCoachAssignmentAdmin(admin.ModelAdmin):
	list_display = ('cohort', 'user', 'role', 'score', 'eligibility_status', 'payout_amount', 'deployment_eligible', 'allocated_at')
	list_filter = ('role', 'cohort', 'eligibility_status', 'deployment_eligible')
	search_fields = ('cohort__title', 'user__email', 'user__username')
	readonly_fields = ('id', 'allocated_at')


@admin.register(CohortWalletEntry)
class CohortWalletEntryAdmin(admin.ModelAdmin):
	list_display = ('cohort', 'wallet', 'user', 'amount', 'description', 'created_at')
	list_filter = ('wallet', 'cohort')
	search_fields = ('cohort__title', 'user__email', 'description')
	readonly_fields = ('id', 'created_at')


@admin.register(WhatsAppInviteRequest)
class WhatsAppInviteRequestAdmin(admin.ModelAdmin):
	list_display = ('user', 'cohort', 'coach_type', 'status', 'reviewed_by', 'created_at')
	list_filter = ('status', 'coach_type', 'cohort')
	search_fields = ('user__email', 'user__username', 'cohort__title')
	readonly_fields = ('id', 'user', 'cohort', 'coach_type', 'created_at', 'reviewed_by', 'reviewed_at')
	fieldsets = (
		(None, {'fields': ('id', 'user', 'cohort', 'coach_type', 'status')}),
		('Admin review', {'fields': ('group_link', 'admin_notes', 'reviewed_by', 'reviewed_at')}),
		('Request', {'fields': ('created_at',)}),
	)


def sync_psp_registration(registration):
	verification = registration.verifications.order_by('-verified_at').first()
	if verification and abs(registration.amount_expected - verification.amount_received) < 0.01:
		registration.status = 'active' if registration.cohort_id else 'confirmed'
		registration.save(update_fields=('status',))
		if registration.cohort_id:
			CohortEnrollment.objects.get_or_create(
				user=registration.user,
				cohort=registration.cohort,
			)
	else:
		registration.status = 'failed' if verification else 'pending'
		registration.save(update_fields=('status',))
