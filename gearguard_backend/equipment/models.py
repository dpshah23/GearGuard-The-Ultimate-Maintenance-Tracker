from django.db import models

# Create your models here.

class Equipment(models.Model):
    name = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)

    department = models.ForeignKey(
        'departements.Department',
        on_delete=models.CASCADE
    )

    assigned_to = models.ForeignKey(
    'users.GearguardUser',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='assigned_equipment'
    )


    maintenance_team = models.ForeignKey(
        'teams.MaintenanceTeam',
        on_delete=models.SET_NULL,
        null=True
    )

    location = models.CharField(max_length=100)
    purchase_date = models.DateField()
    warranty_expiry = models.DateField()

    is_scrapped = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.serial_number})"

