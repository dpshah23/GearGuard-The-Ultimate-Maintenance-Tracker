from django.shortcuts import render
from .models import MaintenanceTeam
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

@csrf_exempt
def get_all_teams(request):
    """
    Retrieves all maintenance teams.
    Returns a list of maintenance teams.
    """

    if not request.method=='GET':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    
    data=[]
    teams=MaintenanceTeam.objects.all()
    for team in teams:
        data.append({
            'id':team.id,
            'name':team.name,
            'description':team.description,
            'members':[member.id for member in team.members.all()],
            'created_at':team.created_at
        })
    return JsonResponse(data,safe=False)

@csrf_exempt
def get_team_details(request,team_id):
    """
    Retrieves details of a specific maintenance team by ID.
    Returns the maintenance team details or error message.
    """

    if not request.method=='GET':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    
    try:
        team=MaintenanceTeam.objects.get(id=team_id)
        data={
            'id':team.id,
            'name':team.name,
            'description':team.description,
            'members':[member.id for member in team.members.all()],
            'created_at':team.created_at
        }
        return JsonResponse(data,status=200)
    except MaintenanceTeam.DoesNotExist:
        return JsonResponse({'error':'Team not found'},status=404)


@csrf_exempt
def create_team(request):
    """
    Creates a new maintenance team.
    Returns the created maintenance team or error message.
    """

    if not request.method=='POST':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    
    data=json.loads(request.body)
    name=data.get('name')
    description=data.get('description','')
    member_ids=data.get('members',[])

    team=MaintenanceTeam.objects.create(name=name,description=description)
    team.members.set(member_ids)
    team.save()

    response_data={
        'id':team.id,
        'name':team.name,
        'description':team.description,
        'members':[member.id for member in team.members.all()],
        'created_at':team.created_at
    }

    return JsonResponse(response_data,status=201)