from django.urls import path
from .views import MyProfileView, PublicProfileView, AvatarUploadView, AvailabilityToggleView

urlpatterns = [
    path('', MyProfileView.as_view()),
    path('avatar/', AvatarUploadView.as_view()),
    path('availability/', AvailabilityToggleView.as_view()),
    path('<uuid:user_id>/', PublicProfileView.as_view()),
]
