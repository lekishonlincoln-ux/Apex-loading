from django.db import models
import uuid
from apps.accounts.models import User


class Profile(models.Model):
    AVAILABILITY_CHOICES = [
        ('available', 'Available'),
        ('busy', 'Busy'),
        ('offline', 'Offline'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=200)
    headline = models.CharField(max_length=300, blank=True)
    bio = models.TextField(blank=True)
    profession = models.CharField(max_length=100, db_index=True)
    skills = models.JSONField(default=list)
    location = models.CharField(max_length=200, blank=True)
    country = models.CharField(max_length=100, blank=True, db_index=True)
    avatar_url = models.URLField(blank=True, null=True)
    availability = models.CharField(
        max_length=20, choices=AVAILABILITY_CHOICES, default='offline', db_index=True
    )
    years_experience = models.PositiveSmallIntegerField(default=0)
    portfolio_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'profiles'
        indexes = [
            models.Index(fields=['profession', 'availability']),
            models.Index(fields=['country']),
        ]

    def __str__(self):
        return self.full_name
