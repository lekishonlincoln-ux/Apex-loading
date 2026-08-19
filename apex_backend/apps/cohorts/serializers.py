from rest_framework import serializers
from .models import Cohort, Assessment, Question, AssessmentAttempt, CohortEnrollment
from .models import PSPRegistration, PSPVerification


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'question_type', 'text', 'options', 'points', 'order')


class AssessmentSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = (
            'id', 'title', 'instructions', 'time_limit_minutes',
            'difficulty', 'passing_score', 'is_active', 'questions',
        )


class CohortSerializer(serializers.ModelSerializer):
    participant_count = serializers.SerializerMethodField()

    class Meta:
        model = Cohort
        fields = (
            'id', 'title', 'profession', 'description', 'start_date',
            'end_date', 'max_participants', 'status', 'participant_count', 'created_at',
        )

    def get_participant_count(self, obj):
        return obj.enrollments.count()


class AssessmentAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentAttempt
        fields = (
            'id', 'assessment', 'cohort', 'score', 'status',
            'started_at', 'submitted_at', 'is_flagged',
        )
        read_only_fields = fields


class HeartbeatSerializer(serializers.Serializer):
    tab_switch = serializers.BooleanField(default=False)
    time_anomaly = serializers.BooleanField(default=False)


class PSPVerificationSerializer(serializers.ModelSerializer):
    verified_by = serializers.SerializerMethodField()

    class Meta:
        model = PSPVerification
        fields = ('id', 'registration', 'verified_by', 'amount_received', 'payment_reference', 'notes', 'verified_at')

    def get_verified_by(self, obj):
        if obj.verified_by:
            return {'id': str(obj.verified_by.id), 'email': obj.verified_by.email, 'username': obj.verified_by.username}
        return None


class PSPRegistrationSerializer(serializers.ModelSerializer):
    verifications = PSPVerificationSerializer(many=True, read_only=True)
    user = serializers.SerializerMethodField()

    class Meta:
        model = PSPRegistration
        fields = (
            'id', 'user', 'full_name', 'phone_number', 'psp_tier', 'cohort', 'amount_expected', 'status', 'created_at', 'verifications'
        )

    def get_user(self, obj):
        return {'id': str(obj.user.id), 'email': obj.user.email, 'username': obj.user.username}
