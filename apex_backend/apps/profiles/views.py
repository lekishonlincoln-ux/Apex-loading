from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
import uuid

from .models import Profile
from .serializers import ProfileSerializer, PublicProfileSerializer, AvailabilitySerializer
from utils.cloudinary_upload import upload_avatar


class MyProfileView(APIView):
    def get(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        return Response(ProfileSerializer(profile).data)

    def put(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def patch(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class PublicProfileView(APIView):
    def get(self, request, user_id):
        profile = get_object_or_404(Profile, user__id=user_id)
        return Response(PublicProfileSerializer(profile).data)


class AvatarUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('avatar')
        if not file:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        url = upload_avatar(file, str(request.user.id))
        profile, _ = Profile.objects.get_or_create(user=request.user)
        profile.avatar_url = url
        profile.save(update_fields=['avatar_url'])
        return Response({'avatar_url': url})


class AvailabilityToggleView(APIView):
    def patch(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = AvailabilitySerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


from rest_framework.permissions import AllowAny
from .serializers import MentorSerializer, MentorOrganizationSerializer
from .models import Mentor, MentorOrganization


class MentorListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Mentor.objects.select_related('user', 'organization').all().order_by('-consistency_score')
        data = MentorSerializer(qs, many=True).data
        return Response(data)


class MentorOrgListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = MentorOrganization.objects.all().order_by('name')
        result = []
        for org in qs:
            mentors = Mentor.objects.filter(organization=org).select_related('user')
            result.append({
                'id': str(org.id),
                'name': org.name,
                'description': org.description,
                'mentors': MentorSerializer(mentors, many=True).data,
            })
        return Response(result)
