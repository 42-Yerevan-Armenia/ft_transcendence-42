"""
Django command to wait for the database to be available.
"""
import time

from psycopg2 import OperationalError as Psycopg2OpError

from django.db.utils import OperationalError
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """Django command to wait for the database."""

    def handle(self, *args, **options):
        """Entrypoint for command."""
        self.stdout.write('Waiting for database...')
        max_retries = 30
        retries = 0
        while retries < max_retries:
            try:
                self.check(databases=['default'])
                self.stdout.write(self.style.SUCCESS('Database available!'))
                return
            except (Psycopg2OpError, OperationalError):
                self.stdout.write('Database unavailable, waiting 1 second...')
                time.sleep(1)
                retries += 1

        self.stdout.write(self.style.ERROR('Database did not become available within the specified time.'))
        sys.exit(1)

