from django.shortcuts import render
from django.http import JsonResponse
from .models import Department

import json


# Create your views here.

def list_department_view(request):

    """
    Docstring for list_equipment_view
    
    :param request: Description
    :return: Description of return value
    Returns a list of all equipment objects.

    """

    if not request.method=='GET':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    data=[]
    equipments=Department.objects.all()
    for equipment in equipments:
        data.append({
            'id':equipment.id,
            'name':equipment.name,
            'created_at':equipment.created_at,
            'description':equipment.description,
            'updated_at':equipment.updated_at,
            # 'department':equipment.department.id,
            # 'assigned_to':equipment.assigned_to.id if equipment.assigned_to else None,
            # 'maintenance_team':equipment.maintenance_team.id if equipment.maintenance_team else None,
            # 'location':equipment.location,
            # 'purchase_date':equipment.purchase_date,
            # 'warranty_expiry':equipment.warranty_expiry,
            # 'is_scrapped':equipment.is_scrapped
        })
    return JsonResponse(data,safe=False)




def department_detail_view(request,pk):
    
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
        equipment=Department.objects.get(id=pk)
        data={
            'id':equipment.id,
            'name':equipment.name,
            'created_at':equipment.created_at,
            'description':equipment.description,
            'updated_at':equipment.updated_at,
        }
        return JsonResponse(data,status=200)
    except Department.DoesNotExist:
        return JsonResponse({'error':'Equipment not found'},status=404)

