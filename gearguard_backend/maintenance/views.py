from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import MaintenanceRequest
from .serializers import MaintenanceRequestSerializer
import json
from django.http import JsonResponse
from equipment.views import getName 

class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = MaintenanceRequestSerializer
    queryset = MaintenanceRequest.objects.all()

    def get_queryset(self):
        user = self.request.user

        # Admin can see everything
        if user.role == 'admin':
            return MaintenanceRequest.objects.all()

        # Manager sees tasks for their team
        if user.role == 'manager':
            return MaintenanceRequest.objects.filter(
                assigned_team__members=user
            )

        # Technician sees only assigned tasks
        if user.role == 'technician':
            return MaintenanceRequest.objects.filter(
                assigned_to=user
            )

        return MaintenanceRequest.objects.none()

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        task = self.get_object()
        user = request.user

        if user.role not in ['admin', 'manager']:
            return Response({"error": "Permission denied"}, status=403)

        team_id = request.data.get("team_id")
        technician_id = request.data.get("technician_id")

        if team_id:
            task.assigned_team_id = team_id

        if technician_id:
            task.assigned_to_id = technician_id

        task.status = "in_progress"
        task.save()

        return Response({"message": "Task assigned successfully"})
    
def list_maintenance_requests(request):

    """
    Docstring for list_equipment_view
    
    :param request: Description
    :return: Description of return value
    Returns a list of all equipment objects.

    """

    if not request.method=='GET':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    data=[]
    equipments=MaintenanceRequest.objects.all()
    for equipment in equipments:
        # print(getName(equipment.equipment_id).get('name'))
        data.append({
            'id':equipment.id,
            'subject':equipment.subject,
            'description':equipment.description,
            'equipment_id': equipment.equipment_id,
            'equipment_name':getName(equipment.equipment_id).get('name'),
            'request_type':equipment.request_type,
            'status':equipment.status,
            'assigned_to_id':equipment.assigned_to.id if equipment.assigned_to else None,
            'assigned_team_id':equipment.assigned_team.id if equipment.assigned_team else None,
            'scheduled_date':equipment.scheduled_date,
            'duration_hours':equipment.duration_hours,
            'created_by_id':equipment.created_by.id if equipment.created_by else None,
            # 'created_at':equipment.created_at,
        })
    return JsonResponse(data,safe=False)

def request_detail_view(request,pk):
    
    """
    Docstring for equipment_detail_view
    
    :param request: Description
    :param equipment_id: Description
    
    
    :return: Description of return value
    Returns the details of a specific equipment object by ID.

    """

    if not request.method=='GET':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    
    try:
        equipment=MaintenanceRequest.objects.get(id=pk)
        data={
            'id':equipment.id,
            'subject':equipment.subject,
            'description':equipment.description,
            'equipment_id':equipment.equipment_id,
            'equipment_name':getName(equipment.equipment_id).get('name'),
            'request_type':equipment.request_type,
            'status':equipment.status,
            'assigned_to_id':equipment.assigned_to.id if equipment.assigned_to else None,
            'assigned_team_id':equipment.assigned_team.id if equipment.assigned_team else None,
            'scheduled_date':equipment.scheduled_date,
            'duration_hours':equipment.duration_hours,
            'created_by_id':equipment.created_by.id if equipment.created_by else None,
            # 'created_at':equipment.created_at,
        }
        return JsonResponse(data,status=200)
    except MaintenanceRequest.DoesNotExist:
        return JsonResponse({'error':'Maintenance Request not found'},status=404)