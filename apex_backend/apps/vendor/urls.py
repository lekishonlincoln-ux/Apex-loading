from django.urls import path
from .views import (
    VendorJobListCreateView, VendorJobDetailView,
    PublishJobView, RateProfessionalView, JobMatchesView, VendorDashboardView,
)

urlpatterns = [
    path('jobs/', VendorJobListCreateView.as_view()),
    path('jobs/<uuid:job_id>/', VendorJobDetailView.as_view()),
    path('jobs/<uuid:job_id>/publish/', PublishJobView.as_view()),
    path('jobs/<uuid:job_id>/rate/', RateProfessionalView.as_view()),
    path('jobs/<uuid:job_id>/matches/', JobMatchesView.as_view()),
    path('dashboard/', VendorDashboardView.as_view()),
]
