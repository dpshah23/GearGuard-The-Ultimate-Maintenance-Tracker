from django.shortcuts import render

# Create your views here.

def equipment_create_view(request):

    """
    Docstring for equipment_create_view
    
    :param request: Description of request parameter
    :return: Description of return value
    
    Requested data : name,serial_number,department , Assigned_to, maintenance_team, location, purchase_date, warranty_expiry, is_scrapped

    Returns the created equipment object or error message.

    
    """
    data=request.POST

    department_id=data.get('department')
    
    pass

def list_equipment_view(request):
    pass

def equipment_detail_view(request, equipment_id):
    pass

def equipment_update_view(request, equipment_id):
    pass

def equipment_delete_view(request, equipment_id):
    pass

def getmaintancerequestforequipment_view(request, equipment_id):
    pass


    
