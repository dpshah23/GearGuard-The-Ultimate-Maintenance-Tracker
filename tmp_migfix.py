import os, sys, django
sys.path.insert(0, r'd:\GearGuard-The-Ultimate-Maintenance-Tracker\gearguard_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE','gearguard_backend.settings')
django.setup()
from django.db import connection
with connection.cursor() as cursor:
    cursor.execute("DELETE FROM django_migrations WHERE app='admin'")
    print(cursor.rowcount)
