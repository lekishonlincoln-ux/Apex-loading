from django.db import models
import uuid
from apps.accounts.models import User


class Cohort(models.Model):
    STATUS_CHOICES = [('open', 'Open'), ('in_progress', 'In Progress'), ('closed', 'Closed')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    profession = models.CharField(max_length=100, db_index=True)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    max_participants = models.PositiveIntegerField(default=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cohorts'


class Assessment(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard'), ('expert', 'Expert')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name='assessments')
    title = models.CharField(max_length=200)
    instructions = models.TextField()
    time_limit_minutes = models.PositiveIntegerField(default=30)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    passing_score = models.FloatField(default=70.0)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'assessments'


class Question(models.Model):
    QUESTION_TYPE = [
        ('mcq', 'Multiple Choice'), ('scenario', 'Scenario'), ('true_false', 'True/False')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE, default='mcq')
    text = models.TextField()
    options = models.JSONField(default=list)
    correct_answer = models.CharField(max_length=10)
    points = models.PositiveSmallIntegerField(default=1)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = 'questions'
        ordering = ['order']


class CohortEnrollment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cohort_enrollments'
        unique_together = [['user', 'cohort']]


class AssessmentAttempt(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'), ('submitted', 'Submitted'), ('graded', 'Graded')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attempts')
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='attempts')
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name='attempts')
    answers = models.JSONField(default=dict)
    score = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    tab_switches = models.PositiveIntegerField(default=0)
    time_anomalies = models.PositiveIntegerField(default=0)
    ip_address = models.GenericIPAddressField(null=True)
    user_agent = models.TextField(blank=True)
    is_flagged = models.BooleanField(default=False, db_index=True)
    flag_reason = models.TextField(blank=True)

    class Meta:
        db_table = 'assessment_attempts'
        unique_together = [['user', 'assessment']]
        indexes = [models.Index(fields=['user', 'cohort'])]


class PSPRegistration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('review', 'Payment Review'),
        ('confirmed', 'Payment Confirmed'),
        ('active', 'PSP Active'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='psp_registrations')
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=32, db_index=True)
    psp_tier = models.CharField(max_length=64)
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name='psp_registrations', null=True, blank=True)
    amount_expected = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'psp_registrations'
        unique_together = [['user', 'cohort', 'psp_tier']]


class PSPVerification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    registration = models.ForeignKey(PSPRegistration, on_delete=models.CASCADE, related_name='verifications')
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='psp_verifications')
    amount_received = models.DecimalField(max_digits=10, decimal_places=2)
    payment_reference = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True)
    verified_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'psp_verifications'
