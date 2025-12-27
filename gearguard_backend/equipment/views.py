from django.shortcuts import render
from django.http import JsonResponse
from .models import Equipment

import json


# Create your views here.

def equipment_create_view(request):

    """
    Docstring for equipment_create_view
    
    :param request: Description of request parameter
    :return: Description of return value
    
    Requested data : name,serial_number,department , Assigned_to, maintenance_team, location, purchase_date, warranty_expiry, is_scrapped

    Returns the created equipment object or error message.

    
    """

    if not request.method=='POST':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    

    try:
        data=json.loads(request.body)
        name=data.get('name')
        department_id=data.get('department')
        serial_number=data.get('serial_number')
        assigned_to_id=data.get('assigned_to')
        maintenance_team_id=data.get('maintenance_team')
        location=data.get('location')
        purchase_date=data.get('purchase_date')
        warranty_expiry=data.get('warranty_expiry')
        is_scrapped=data.get('is_scrapped',False)

        equipment=Equipment.objects.create(name=name,
        serial_number=serial_number,department_id=department_id,
        assigned_to_id=assigned_to_id,maintenance_team_id=maintenance_team_id,
        location=location,purchase_date=purchase_date,
        warranty_expiry=warranty_expiry,is_scrapped=is_scrapped)

        return JsonResponse({'id':equipment.id,'name':equipment.name,
        'serial_number':equipment.serial_number,
        'department':equipment.department.id,
        'assigned_to':equipment.assigned_to.id if equipment.assigned_to else None,
        'maintenance_team':equipment.maintenance_team.id if equipment.maintenance_team else None,
        'location':equipment.location,
        'purchase_date':equipment.purchase_date,
        'warranty_expiry':equipment.warranty_expiry,
        'is_scrapped':equipment.is_scrapped},status=201)     


    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)    
   

def list_equipment_view(request):

    """
    Docstring for list_equipment_view
    
    :param request: Description
    :return: Description of return value
    Returns a list of all equipment objects.

    """

    if not request.method=='GET':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    data=[]
    equipments=Equipment.objects.all()
    for equipment in equipments:
        data.append({
            'id':equipment.id,
            'name':equipment.name,
            'serial_number':equipment.serial_number,
            'department':equipment.department.id,
            'assigned_to':equipment.assigned_to.id if equipment.assigned_to else None,
            'maintenance_team':equipment.maintenance_team.id if equipment.maintenance_team else None,
            'location':equipment.location,
            'purchase_date':equipment.purchase_date,
            'warranty_expiry':equipment.warranty_expiry,
            'is_scrapped':equipment.is_scrapped
        })
    return JsonResponse(data,safe=False)




def equipment_detail_view(request,pk):
    
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
        equipment=Equipment.objects.get(id=pk)
        data={
            'id':equipment.id,
            'name':equipment.name,
            'serial_number':equipment.serial_number,
            'department':equipment.department.id,
            'assigned_to':equipment.assigned_to.id if equipment.assigned_to else None,
            'maintenance_team':equipment.maintenance_team.id if equipment.maintenance_team else None,
            'location':equipment.location,
            'purchase_date':equipment.purchase_date,
            'warranty_expiry':equipment.warranty_expiry,
            'is_scrapped':equipment.is_scrapped
        }
        return JsonResponse(data,status=200)
    except Equipment.DoesNotExist:
        return JsonResponse({'error':'Equipment not found'},status=404)

def equipment_update_view(request, pk):

    """
    Docstring for equipment_update_view
    
    :param request: Description
    :param equipment_id: Description
    
    :return: Description of return value
    Updates the details of a specific equipment object by ID.
    Requested data : name,serial_number,department , Assigned_to, maintenance_team, location, purchase_date, warranty_expiry, is_scrapped
    Returns the updated equipment object or error message.

    """

    if not request.method=='POST':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    
    
    data=json.loads(request.body)
    try:
        equipment=Equipment.objects.get(id=pk)

        equipment.name=data.get('name',equipment.name)
        equipment.serial_number=data.get('serial_number',equipment.serial_number)
        equipment.department_id=data.get('department',equipment.department.id)
        equipment.assigned_to_id=data.get('assigned_to',equipment.assigned_to.id if equipment.assigned_to else None)
        equipment.maintenance_team_id=data.get('maintenance_team',equipment.maintenance_team.id if equipment.maintenance_team else None)
        equipment.location=data.get('location',equipment.location)
        equipment.purchase_date=data.get('purchase_date',equipment.purchase_date)
        equipment.warranty_expiry=data.get('warranty_expiry',equipment.warranty_expiry)
        equipment.is_scrapped=data.get('is_scrapped',equipment.is_scrapped)

        equipment.save()

        return JsonResponse({'id':equipment.id,'name':equipment.name,
        'serial_number':equipment.serial_number,
        'department':equipment.department.id,
        'assigned_to':equipment.assigned_to.id if equipment.assigned_to else None,
        'maintenance_team':equipment.maintenance_team.id if equipment.maintenance_team else None,
    })
    except Equipment.DoesNotExist:
        return JsonResponse({'error':'Equipment not found'},status=404)

def equipment_delete_view(request, pk):

    """
    Docstring for equipment_delete_view
    
    :param request: Description
    :param equipment_id: Description
    
    :return: Description of return value
    Deletes a specific equipment object by ID.
    Returns success message or error message.

    """

    if not request.method=='POST':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    
    try:
        equipment=Equipment.objects.get(id=pk)
        equipment.delete()  
        return JsonResponse({'message':'Equipment deleted successfully'},status=200)
    except Equipment.DoesNotExist:
        return JsonResponse({'error':'Equipment not found'},status=404)

def getmaintancerequestforequipment_view(request, equipment_id):
    
    """
    Docstring for getmaintancerequestforequipment_view
    
    :param request: Description
    :param equipment_id: Description
    
    :return: Description of return value
    Retrieves all maintenance requests for a specific equipment object by ID.
    Returns a list of maintenance requests or error message.
    """

    if not request.method=='GET':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    

    
    try:
        equipment=Equipment.objects.get(id=equipment_id)
        maintenancerequests=equipment.maintenancerequest_set.all()
        data=[]
        for mr in maintenancerequests:
            data.append({
                'id':mr.id,
                'subject':mr.subject,
                'description':mr.description,
                'request_type':mr.request_type,
                'status':mr.status,
                'assigned_to':mr.assigned_to.id if mr.assigned_to else None,
                'assigned_team':mr.assigned_team.id if mr.assigned_team else None,
                'scheduled_date':mr.scheduled_date,
                'duration_hours':mr.duration_hours,
                'created_by':mr.created_by.id if mr.created_by else None,
                'created_at':mr.created_at,
            })
        return JsonResponse(data,safe=False,status=200)
    except Equipment.DoesNotExist:
        return JsonResponse({'error':'Equipment not found'},status=404)
    


    
