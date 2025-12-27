from django.contrib import admin
from .models import MaintenanceLog,MaintenanceRequest
# Register your models here.

admin.site.register(MaintenanceLog)
admin.site.register(MaintenanceRequest)