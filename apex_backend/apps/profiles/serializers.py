from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)

    class Meta:
        model = Profile
        fields = (
            'id', 'email', 'role', 'full_name', 'headline', 'bio',
            'profession', 'skills', 'location', 'country', 'avatar_url',
            'availability', 'years_experience', 'portfolio_url', 'linkedin_url',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'email', 'role', 'created_at', 'updated_at')


class PublicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            'id', 'full_name', 'headline', 'profession', 'skills',
            'location', 'country', 'avatar_url', 'availability',
            'years_experience', 'portfolio_url', 'linkedin_url',
        )


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('availability',)
