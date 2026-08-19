from django.contrib import admin
from .models import Cohort, Assessment, Question, AssessmentAttempt, CohortEnrollment

admin.site.register(Cohort)
admin.site.register(Assessment)
admin.site.register(Question)
admin.site.register(AssessmentAttempt)
admin.site.register(CohortEnrollment)
