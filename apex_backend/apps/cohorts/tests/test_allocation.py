from decimal import Decimal
from django.test import SimpleTestCase

from apps.cohorts.allocation import get_reward_plan


class RewardPlanTests(SimpleTestCase):
    def test_twenty_participant_plan(self):
        plan = get_reward_plan(20)
        self.assertEqual((plan['skills'], plan['consistency'], plan['improvement']), (1, 1, 1))
        self.assertEqual(plan['marketing'], Decimal('300'))

    def test_fifty_participant_plan(self):
        plan = get_reward_plan(50)
        self.assertEqual((plan['skills'], plan['consistency'], plan['improvement']), (3, 2, 1))
        self.assertEqual(plan['marketing'], Decimal('500'))

    def test_one_hundred_participant_plan_doubles_fifty(self):
        plan = get_reward_plan(100)
        self.assertEqual((plan['skills'], plan['consistency'], plan['improvement']), (6, 4, 2))
        self.assertEqual(plan['marketing'], Decimal('1000'))

    def test_under_twenty_is_not_eligible(self):
        with self.assertRaises(ValueError):
            get_reward_plan(19)