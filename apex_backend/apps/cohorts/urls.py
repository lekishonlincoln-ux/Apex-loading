from django.urls import path
from .views import (
    CohortListView, CohortDetailView, CohortEnrollView,
    CohortAssessmentsView, StartAssessmentView, SubmitAssessmentView,
    CohortLeaderboardView, HeartbeatView,
    PSPRegistrationListView, PSPRegistrationDetailView, PSPVerifyView,
)

urlpatterns = [
    path('', CohortListView.as_view()),
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
]
