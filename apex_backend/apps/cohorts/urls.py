from django.urls import path
from .views import (
    CohortListView, CohortDetailView, CohortEnrollView,
    CohortAssessmentsView, StartAssessmentView, SubmitAssessmentView,
    CohortLeaderboardView, HeartbeatView, DailyAvailableCohortsView,
    PSPRegistrationListView, PSPRegistrationDetailView, PSPVerifyView,
    AllocateCohortRewardsView,
    CoachPayoutView,
    MentorshipFollowUpView,
    WhatsAppInviteRequestView, WhatsAppInviteReviewView,
)

urlpatterns = [
    path('', CohortListView.as_view()),
    path('today/', DailyAvailableCohortsView.as_view()),
    path('<uuid:cohort_id>/', CohortDetailView.as_view()),
    path('<uuid:cohort_id>/enroll/', CohortEnrollView.as_view()),
    path('<uuid:cohort_id>/assessments/', CohortAssessmentsView.as_view()),
    path('<uuid:cohort_id>/leaderboard/', CohortLeaderboardView.as_view()),
    path('assessments/<uuid:assessment_id>/start/', StartAssessmentView.as_view()),
    path('assessments/<uuid:assessment_id>/submit/', SubmitAssessmentView.as_view()),
    path('attempts/<uuid:attempt_id>/heartbeat/', HeartbeatView.as_view()),
    path('psp/registrations/', PSPRegistrationListView.as_view()),
    path('psp/registrations/<uuid:reg_id>/', PSPRegistrationDetailView.as_view()),
    path('psp/registrations/<uuid:reg_id>/verify/', PSPVerifyView.as_view()),
    path('admin/<uuid:cohort_id>/allocate-rewards/', AllocateCohortRewardsView.as_view()),
    path('coach-payouts/', CoachPayoutView.as_view()),
    path('coach-payouts/<uuid:assignment_id>/', CoachPayoutView.as_view()),
    path('admin/<uuid:cohort_id>/mentorship-follow-up/', MentorshipFollowUpView.as_view()),
    path('mentorship/whatsapp-invites/', WhatsAppInviteRequestView.as_view()),
    path('admin/mentorship/whatsapp-invites/<uuid:request_id>/', WhatsAppInviteReviewView.as_view()),
]
