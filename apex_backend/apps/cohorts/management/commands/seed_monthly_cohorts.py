from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random

from apps.cohorts.models import Cohort, Assessment, Question
from apps.profiles.models import Profile

LOCAL_VIDEO_BASE = '/static/videos/video_'

# profession -> question templates that are contextual to the video/story
QUESTION_TEMPLATES_BY_PROFESSION = {
    'software_engineer': [
        'After watching the video, what was the root cause of the failure described?',
        'Which sequence of steps from the video would best reproduce the issue?',
        'What is the correct time complexity of the algorithm illustrated in the demo?',
        'Which option describes the primary tradeoff discussed in the video?',
        'Which mitigation from the video best prevents the observed failure?'
    ],
    'data_scientist': [
        'Which preprocessing step shown in the video most impacts model performance?',
        'What metric did the presenter use to compare models in the video?',
        'Which assumption from the video would most likely cause biased results?',
        'Which visualization technique from the video best highlights outliers?',
        'What is the recommended sampling rate discussed in the video?'
    ],
    'product_manager': [
        'What was the primary user problem highlighted in the case study?',
        'Which success metric was emphasized by the presenter?',
        'Which stakeholder concern in the video should be addressed first?',
        'Which experimental design from the video would prove the hypothesis?',
        'What was the recommended rollout strategy shown in the video?'
    ],
    'devops': [
        'Which runbook step in the video solves the incident fastest?',
        'Which metric should be monitored according to the presenter?',
        'Which rollback strategy did the speaker recommend?',
        'What configuration change caused the outage demonstrated?',
        'Which recovery action is considered safest in the video?'
    ],
    'designer': [
        'Which design principle did the video emphasize for accessibility?',
        'What color contrast issue was identified in the case study?',
        'Which prototyping step produced the best usability feedback?',
        'Which pattern improved the conversion rate in the example?',
        'Which layout choice is preferred for mobile in the video?'
    ],
}

FALLBACK_TEMPLATES = [
    'Based on the video, which statement is correct?',
    'Which option best summarizes the video main point?',
    'Which action from the video is the recommended next step?',
    'Which detail from the video supports the main claim?',
    'What was the demonstrated best practice in the video?'
]


class Command(BaseCommand):
    help = 'Seed 180 cohorts (one assessment each) and 900 questions (5 per assessment) as placeholders for the month.'

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=180, help='Number of assessments/cohorts to create (default 180)')
        parser.add_argument('--start-days-offset', type=int, default=0, help='Offset in days from today to start cohorts')

    def handle(self, *args, **options):
        count = options['count']
        start_offset = options['start_days_offset']

        now = timezone.now()

        # choose professions from existing profiles, fallback to sample set
        professions_qs = Profile.objects.values_list('profession', flat=True).distinct()[:20]
        professions = list(professions_qs) if professions_qs else ['software_engineer', 'data_scientist', 'product_manager', 'designer', 'devops']

        created = 0
        for i in range(count):
            prof = random.choice(professions)
            title = f"Monthly Cohort #{i+1} — {prof}"
            start = now + timedelta(days=start_offset + (i % 30))
            end = start + timedelta(days=7)  # cohort active for a week

            cohort = Cohort.objects.create(
                title=title,
                profession=prof,
                payment_tier='100kes',
                description=f'Auto-generated {prof} learning session with a guided video lesson and assessment.',
                start_date=start,
                end_date=end,
                max_participants=100,
            )

            # The local video generator materializes video_{i + 1}.mp4 from the bundled lesson clip.
            assessment = Assessment.objects.create(
                cohort=cohort,
                title=f'Assessment for {title}',
                instructions='Watch the short video then answer the 5 questions.',
                video_url=f"{LOCAL_VIDEO_BASE}{i + 1}.mp4",
                time_limit_minutes=7,
                difficulty='medium',
                passing_score=60.0,
                is_active=True,
            )

            # select templates for profession
            templates = QUESTION_TEMPLATES_BY_PROFESSION.get(prof, FALLBACK_TEMPLATES)

            # create 5 questions per assessment (related to video content)
            for qn in range(5):
                template = random.choice(templates)
                # produce options that look realistic (A-D) and mark first as correct
                options = [
                    {'id': 'a', 'text': 'Answer A'},
                    {'id': 'b', 'text': 'Answer B'},
                    {'id': 'c', 'text': 'Answer C'},
                    {'id': 'd', 'text': 'Answer D'},
                ]
                text = template
                correct = options[0]['text']
                Question.objects.create(
                    assessment=assessment,
                    question_type='mcq',
                    text=text,
                    options=[opt['text'] for opt in options],
                    correct_answer=correct,
                    points=1,
                    order=qn,
                )

            created += 1

        self.stdout.write(self.style.SUCCESS(f'Created {created} cohorts/assessments with 5 questions each.'))
