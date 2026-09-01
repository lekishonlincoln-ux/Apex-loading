from django.db import models
import uuid
from apps.accounts.models import User


class Cohort(models.Model):
    STATUS_CHOICES = [('open', 'Open'), ('in_progress', 'In Progress'), ('closed', 'Closed')]
    PAYMENT_TIER_CHOICES = [
        ('10kes', 'KES 10'),
        ('100kes', 'KES 100'),
        ('1000kes', 'KES 1,000'),
    ]
    ASSESSMENT_UNLOCK_CHOICES = [
        (20, '20 participants'),
        (50, '50 participants'),
        (100, '100 participants'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    profession = models.CharField(max_length=100, db_index=True)
    payment_tier = models.CharField(max_length=10, choices=PAYMENT_TIER_CHOICES, db_index=True, default='100kes')
    description = models.TextField(blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    max_participants = models.PositiveIntegerField(default=100)
    assessment_unlock_threshold = models.PositiveIntegerField(
        choices=ASSESSMENT_UNLOCK_CHOICES,
        default=20,
        help_text='Minimum verified participants required before assessments can start.',
    )
    skills_coach_payout = models.DecimalField(max_digits=10, decimal_places=2, default=500)
    consistency_coach_payout = models.DecimalField(max_digits=10, decimal_places=2, default=300)
    improvement_coach_payout = models.DecimalField(max_digits=10, decimal_places=2, default=300)
    account_based_marketing_budget = models.DecimalField(max_digits=10, decimal_places=2, default=300)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cohorts'


class Assessment(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard'), ('expert', 'Expert')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name='assessments')
    title = models.CharField(max_length=200)
    instructions = models.TextField()
    video_url = models.URLField(blank=True, help_text='Video source for this assessment.')
    time_limit_minutes = models.PositiveIntegerField(default=30)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    passing_score = models.FloatField(default=70.0)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'assessments'


class Question(models.Model):
    QUESTION_TYPE = [
        ('mcq', 'Multiple Choice'), ('scenario', 'Scenario'), ('true_false', 'True/False')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE, default='mcq')
    text = models.TextField()
    options = models.JSONField(default=list)
    correct_answer = models.CharField(max_length=10)
    points = models.PositiveSmallIntegerField(default=1)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = 'questions'
        ordering = ['order']


class CohortEnrollment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cohort_enrollments'
        unique_together = [['user', 'cohort']]


class AssessmentAttempt(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'), ('submitted', 'Submitted'), ('graded', 'Graded')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attempts')
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='attempts')
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name='attempts')
    answers = models.JSONField(default=dict)
    question_order = models.JSONField(default=list)
    video_watched_seconds = models.PositiveIntegerField(default=0)
    video_completed = models.BooleanField(default=False)
    score = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    tab_switches = models.PositiveIntegerField(default=0)
    time_anomalies = models.PositiveIntegerField(default=0)
    ip_address = models.GenericIPAddressField(null=True)
    user_agent = models.TextField(blank=True)
    is_flagged = models.BooleanField(default=False, db_index=True)
    flag_reason = models.TextField(blank=True)

    class Meta:
        db_table = 'assessment_attempts'
        unique_together = [['user', 'assessment']]
        indexes = [models.Index(fields=['user', 'cohort'])]


class PSPRegistration(models.Model):
    PAYMENT_TILL_NUMBER = '1598106'
    PSP_TIER_AMOUNTS = {
        '10kes': 10,
        '100kes': 100,
        '1000kes': 1000,
    }
    PSP_TIER_CHOICES = [
        ('10kes', 'KES 10'),
        ('100kes', 'KES 100'),
        ('1000kes', 'KES 1,000'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('review', 'Payment Review'),
        ('failed', 'Payment Failed'),
        ('confirmed', 'Payment Confirmed'),
        ('active', 'PSP Active'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='psp_registrations')
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=32, db_index=True)
    psp_tier = models.CharField(max_length=64, choices=PSP_TIER_CHOICES)
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name='psp_registrations', null=True, blank=True)
    amount_expected = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'psp_registrations'
        unique_together = [['user', 'cohort', 'psp_tier']]


class PSPVerification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    registration = models.ForeignKey(PSPRegistration, on_delete=models.CASCADE, related_name='verifications')
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='psp_verifications')
    amount_received = models.DecimalField(max_digits=10, decimal_places=2)
    payment_reference = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True)
    verified_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'psp_verifications'


class CohortCoachAssignment(models.Model):
    ROLE_CHOICES = [
        ('skills', 'Skills Coach'),
        ('consistency', 'Consistency Coach'),
        ('improvement', 'Improvement Coach'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('mpesa', 'M-Pesa'),
        ('bank_transfer', 'Bank transfer'),
        ('paypal', 'PayPal'),
        ('other', 'Other'),
    ]
    PAYOUT_STATUS_CHOICES = [
        ('awaiting_details', 'Awaiting payment details'),
        ('details_submitted', 'Payment details submitted'),
        ('paid', 'Paid'),
    ]
    ELIGIBILITY_CHOICES = [('valid', 'Valid'), ('invalid', 'Invalid')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name='coach_assignments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='coach_assignments')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    score = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    payout_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=32, choices=PAYMENT_METHOD_CHOICES, blank=True)
    payment_recipient = models.CharField(max_length=255, blank=True)
    payment_note = models.CharField(max_length=255, blank=True)
    payout_status = models.CharField(max_length=32, choices=PAYOUT_STATUS_CHOICES, default='awaiting_details', db_index=True)
    payment_details_submitted_at = models.DateTimeField(null=True, blank=True)
    allocated_at = models.DateTimeField(auto_now_add=True)
    eligibility_status = models.CharField(max_length=12, choices=ELIGIBILITY_CHOICES, default='invalid', db_index=True)
    eligibility_reason = models.CharField(max_length=255, blank=True)
    improvement_delta = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    follow_up_completed = models.BooleanField(default=False)
    deployment_eligible = models.BooleanField(default=False)

    class Meta:
        db_table = 'cohort_coach_assignments'
        constraints = [
            models.UniqueConstraint(fields=['cohort', 'user', 'role'], name='unique_cohort_coach_role'),
        ]


class CohortWalletEntry(models.Model):
    WALLET_CHOICES = [
        ('mentor_payout', 'Mentor Payout'),
        ('account_based_marketing', 'Account-Based Marketing'),
        ('admin', 'Admin Wallet'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name='wallet_entries')
    wallet = models.CharField(max_length=32, choices=WALLET_CHOICES)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='cohort_wallet_entries')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cohort_wallet_entries'


class WhatsAppInviteRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='whatsapp_invite_requests')
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name='whatsapp_invite_requests', null=True, blank=True)
    coach_type = models.CharField(max_length=32, blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='pending', db_index=True)
    group_link = models.URLField(blank=True)
    admin_notes = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_whatsapp_invites')
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'whatsapp_invite_requests'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'cohort', 'coach_type'],
                condition=models.Q(status='pending'),
                name='one_pending_whatsapp_invite',
            ),
        ]
