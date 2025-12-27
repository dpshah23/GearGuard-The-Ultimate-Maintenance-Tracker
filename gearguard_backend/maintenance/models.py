from django.conf import settings
from django.db import models

# Create your models here.
class MaintenanceRequest(models.Model):

    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('repaired', 'Repaired'),
        ('scrap', 'Scrap'),
    ]

    TYPE_CHOICES = [
        ('corrective', 'Corrective'),
        ('preventive', 'Preventive'),
    ]

    subject = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    equipment = models.ForeignKey(
        'equipment.Equipment',
        on_delete=models.CASCADE
    )

    request_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    assigned_team = models.ForeignKey(
        'teams.MaintenanceTeam',
        on_delete=models.SET_NULL,
        null=True
    )

    scheduled_date = models.DateField(null=True, blank=True)
    duration_hours = models.FloatField(null=True, blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='created_requests',
        on_delete=models.SET_NULL,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.get_status_display()}"


class MaintenanceLog(models.Model):
    maintenance_request = models.ForeignKey(
        MaintenanceRequest,
        on_delete=models.CASCADE,
        related_name='logs'
    )
    action = models.CharField(max_length=255)
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Log for {self.maintenance_request.subject} at {self.timestamp}"
