from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone
import shutil
import os

from apps.cohorts.models import Assessment

MEDIA_DIR = os.path.join(os.path.dirname(settings.BASE_DIR), 'apex_backend', 'static', 'videos') if hasattr(settings, 'BASE_DIR') else os.path.join(os.getcwd(), 'apex_backend', 'static', 'videos')
PLACEHOLDER = os.path.join(MEDIA_DIR, 'placeholder.mp4')

class Command(BaseCommand):
    help = 'Create local lesson videos from the bundled source clip and link them to assessments.'

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=180, help='Number of local lesson videos to create; defaults to 180')

    def handle(self, *args, **options):
        count = options['count']
        os.makedirs(MEDIA_DIR, exist_ok=True)
        if not os.path.exists(PLACEHOLDER):
            self.stdout.write(self.style.ERROR(f'Placeholder not found at {PLACEHOLDER}'))
            return

        assessments = Assessment.objects.order_by('created_at', 'id')[:count]
        created = 0
        i = 1
        for assessment in assessments:
            dest = os.path.join(MEDIA_DIR, f'video_{i}.mp4')
            shutil.copyfile(PLACEHOLDER, dest)
            # Keep every assessment on a stable local URL that works without a CDN.
            assessment.video_url = f'/static/videos/video_{i}.mp4'
            assessment.save(update_fields=['video_url'])
            created += 1
            i += 1

        self.stdout.write(self.style.SUCCESS(f'Attached videos to {created} assessments.'))
