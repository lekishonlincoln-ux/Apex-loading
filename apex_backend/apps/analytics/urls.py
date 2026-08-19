from django.urls import path
from .views import PlatformAnalyticsView, ProfessionalAnalyticsView, VendorAnalyticsView

urlpatterns = [
    path('platform/', PlatformAnalyticsView.as_view()),
    path('professional/me/', ProfessionalAnalyticsView.as_view()),
    path('vendor/me/', VendorAnalyticsView.as_view()),
]
