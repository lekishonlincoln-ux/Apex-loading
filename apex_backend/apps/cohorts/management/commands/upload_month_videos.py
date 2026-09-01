from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone
import shutil
import os

from apps.cohorts.models import Assessment

MEDIA_DIR = os.path.join(os.path.dirname(settings.BASE_DIR), 'apex_backend', 'static', 'videos') if hasattr(settings, 'BASE_DIR') else os.path.join(os.getcwd(), 'apex_backend', 'static', 'videos')
PLACEHOLDER = os.path.join(MEDIA_DIR, 'placeholder.mp4')

class Command(BaseCommand):
    help = 'Create month video files by copying a placeholder and updating Assessment.video_url for assessments lacking a video.'

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=180, help='Number of videos to ensure exist; defaults to 180')

    def handle(self, *args, **options):
        count = options['count']
        os.makedirs(MEDIA_DIR, exist_ok=True)
        if not os.path.exists(PLACEHOLDER):
            self.stdout.write(self.style.ERROR(f'Placeholder not found at {PLACEHOLDER}'))
            return

        assessments = Assessment.objects.filter(video_url__isnull=True)[:count]
        created = 0
        i = 1
        for assessment in assessments:
            dest = os.path.join(MEDIA_DIR, f'video_{i}.mp4')
            # find a free index
            while os.path.exists(dest):
                i += 1
                dest = os.path.join(MEDIA_DIR, f'video_{i}.mp4')
            shutil.copyfile(PLACEHOLDER, dest)
            # set a static path so frontend can access via /static/videos/video_X.mp4
            assessment.video_url = f'/static/videos/video_{i}.mp4'
            assessment.save(update_fields=['video_url'])
            created += 1
            i += 1

        self.stdout.write(self.style.SUCCESS(f'Attached videos to {created} assessments.'))
