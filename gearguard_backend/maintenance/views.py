from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import MaintenanceRequest
from .serializers import MaintenanceRequestSerializer


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
