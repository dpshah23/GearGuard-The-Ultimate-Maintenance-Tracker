from django.db import models

# Create your models here.
class MaintenanceTeam(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    members = models.ManyToManyField(
        'users.GearguardUser',
        related_name='teams'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
