from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/profiles/', include('apps.profiles.urls')),
    path('api/v1/trust/', include('apps.trust_engine.urls')),
    path('api/v1/cohorts/', include('apps.cohorts.urls')),
    path('api/v1/rankings/', include('apps.rankings.urls')),
    path('api/v1/vendor/', include('apps.vendor.urls')),
    path('api/v1/router/', include('apps.router.urls')),
    path('api/v1/escrow/', include('apps.escrow.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
    path('api/v1/admin/', include('apps.fraud.urls')),
]
