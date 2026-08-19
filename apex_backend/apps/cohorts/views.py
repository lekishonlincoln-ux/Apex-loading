from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q

from .models import Cohort, Assessment, AssessmentAttempt, CohortEnrollment
from .serializers import (
    CohortSerializer, AssessmentSerializer, AssessmentAttemptSerializer, HeartbeatSerializer
)
from .models import PSPRegistration, PSPVerification
from .serializers import PSPRegistrationSerializer, PSPVerificationSerializer
from .anti_cheat import flag_attempt
from apps.trust_engine.engine import recalculate_trust_score


class CohortListView(APIView):
    def get(self, request):
        cohorts = Cohort.objects.filter(status='open')
        return Response(CohortSerializer(cohorts, many=True).data)


class CohortDetailView(APIView):
    def get(self, request, cohort_id):
        cohort = get_object_or_404(Cohort, id=cohort_id)
        return Response(CohortSerializer(cohort).data)


class CohortEnrollView(APIView):
    def post(self, request, cohort_id):
        cohort = get_object_or_404(Cohort, id=cohort_id, status='open')
        if cohort.enrollments.count() >= cohort.max_participants:
            return Response({'error': 'Cohort is full.'}, status=status.HTTP_400_BAD_REQUEST)
        _, created = CohortEnrollment.objects.get_or_create(user=request.user, cohort=cohort)
        if not created:
            return Response({'error': 'Already enrolled.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Enrolled successfully.'}, status=status.HTTP_201_CREATED)


class CohortAssessmentsView(APIView):
    def get(self, request, cohort_id):
        assessments = Assessment.objects.filter(cohort_id=cohort_id, is_active=True)
        return Response(AssessmentSerializer(assessments, many=True).data)


class StartAssessmentView(APIView):
    def post(self, request, assessment_id):
        assessment = get_object_or_404(Assessment, id=assessment_id, is_active=True)
        if AssessmentAttempt.objects.filter(user=request.user, assessment=assessment).exists():
            return Response({'error': 'Already attempted.'}, status=status.HTTP_400_BAD_REQUEST)
        attempt = AssessmentAttempt.objects.create(
            user=request.user,
            assessment=assessment,
            cohort=assessment.cohort,
            ip_address=_get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
        )
        return Response(AssessmentAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)


class SubmitAssessmentView(APIView):
    def post(self, request, assessment_id):
        attempt = get_object_or_404(
            AssessmentAttempt, assessment_id=assessment_id,
            user=request.user, status='in_progress',
        )
        attempt.answers = request.data.get('answers', {})
        attempt.submitted_at = timezone.now()
        attempt.status = 'submitted'
        attempt.ip_address = _get_client_ip(request)
        attempt.save()

        score = _grade(attempt)
        attempt.score = score
        attempt.status = 'graded'
        attempt.save(update_fields=['score', 'status'])

        flag_attempt(str(attempt.id))
        recalculate_trust_score(request.user, reason='Assessment completed')

        return Response({'score': score, 'message': 'Assessment graded successfully.'})


class CohortLeaderboardView(APIView):
    def get(self, request, cohort_id):
        attempts = (
            AssessmentAttempt.objects
            .filter(cohort_id=cohort_id, status='graded', is_flagged=False)
            .select_related('user__profile')
            .order_by('-score')[:50]
        )
        data = [
            {
                'rank': i + 1,
                'user_id': str(a.user_id),
                'full_name': getattr(getattr(a.user, 'profile', None), 'full_name', 'N/A'),
                'score': a.score,
            }
            for i, a in enumerate(attempts)
        ]
        return Response(data)


class HeartbeatView(APIView):
    def post(self, request, attempt_id):
        attempt = get_object_or_404(
            AssessmentAttempt, id=attempt_id, user=request.user, status='in_progress'
        )
        serializer = HeartbeatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.validated_data['tab_switch']:
            attempt.tab_switches += 1
        if serializer.validated_data['time_anomaly']:
            attempt.time_anomalies += 1
        attempt.save(update_fields=['tab_switches', 'time_anomalies'])
        return Response({'status': 'ok'})
class PSPRegistrationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = PSPRegistration.objects.all().order_by('-created_at')
        status_filter = request.query_params.get('status')
        search = request.query_params.get('q')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if search:
            qs = qs.filter(Q(full_name__icontains=search) | Q(phone_number__icontains=search))
        data = PSPRegistrationSerializer(qs, many=True).data
        return Response(data)


class PSPRegistrationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, reg_id):
        reg = get_object_or_404(PSPRegistration, id=reg_id)
        return Response(PSPRegistrationSerializer(reg).data)


class PSPVerifyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, reg_id):
        reg = get_object_or_404(PSPRegistration, id=reg_id)
        amount = request.data.get('amount_received')
        payment_ref = request.data.get('payment_reference')
        notes = request.data.get('notes', '')

        try:
            amount_val = float(amount)
        except Exception:
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        # create verification record
        ver = PSPVerification.objects.create(
            registration=reg,
            verified_by=request.user,
            amount_received=amount_val,
            payment_reference=payment_ref,
            notes=notes,
        )

        # decide status
        if abs(float(reg.amount_expected) - amount_val) < 0.01:
            reg.status = 'confirmed'
            reg.save(update_fields=['status'])
            # enroll user into cohort if present
            if reg.cohort:
                CohortEnrollment.objects.get_or_create(user=reg.user, cohort=reg.cohort)
                reg.status = 'active'
                reg.save(update_fields=['status'])
        else:
            reg.status = 'review'
            reg.save(update_fields=['status'])

        return Response(PSPVerificationSerializer(ver).data, status=status.HTTP_201_CREATED)


def _grade(attempt: AssessmentAttempt) -> float:
    questions = attempt.assessment.questions.all()
    if not questions:
        return 0.0
    total_points = sum(q.points for q in questions)
    earned = sum(
        q.points for q in questions
        if attempt.answers.get(str(q.id)) == q.correct_answer
    )
    return round((earned / total_points) * 100, 2) if total_points else 0.0


def _get_client_ip(request):
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded:
        return x_forwarded.split(',')[0]
    return request.META.get('REMOTE_ADDR')
