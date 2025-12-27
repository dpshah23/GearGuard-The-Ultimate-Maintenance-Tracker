from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import json
from .models import GearguardUser


# Create your views here.

@csrf_exempt
def signup_view(request):
    """
    Docstring for signup_view
    
    :param request: Description of request parameter
    :return: Description of return value
    
    Requested data : username, email, password, first_name, last_name, department

    Returns the created user object or error message.

    
    """

    if not request.method=='POST':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    

    try:
        data=json.loads(request.body)
        username=data.get('username')
        email=data.get('email')
        password=data.get('password')
        first_name=data.get('first_name')
        last_name=data.get('last_name')
        # department_id=data.get('department')
        role=data.get('role')

        

        user=GearguardUser.objects.create_user(username=username,
        email=email,password=password,first_name=first_name,
        last_name=last_name,role=role,is_staff=False)

        return JsonResponse({'id':user.id,'username':user.username,
        'email':user.email,'first_name':user.first_name,
        'last_name':user.last_name,'role':user.role},status=201)     


    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
@csrf_exempt
def login_view(request):
    """
    Docstring for login_view
    
    :param request: Description of request parameter
    :return: Description of return value
    
    Requested data : username, password

    Returns the user object or error message.

    
    """

    if not request.method=='POST':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    

    try:
        data=json.loads(request.body)
        username=data.get('username')
        password=data.get('password')

        if not username or not password:
            return JsonResponse({'error':'Username and password are required'}, status=400)

        user = authenticate(username=username, password=password)
        
        if user is None:
            return JsonResponse({'error':'Invalid credentials'}, status=401)

        return JsonResponse({'id':user.id,'username':user.username,
        'email':user.email,'first_name':user.first_name,
        'last_name':user.last_name,'role':user.role},status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
@csrf_exempt
def list_users_view(request):
    """
    Lists all users in the system.
    Returns a list of users.
    """

    if not request.method=='GET':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    
    users=GearguardUser.objects.all()
    data=[]
    for user in users:
        data.append({
            'id':user.id,
            'username':user.username,
            'email':user.email, 
            'first_name':user.first_name,
            'last_name':user.last_name,
            'role':user.role
        })
    return JsonResponse(data,safe=False)


@csrf_exempt
def user_detail_view(request,pk):
    """
    Retrieves details of a specific user by ID.
    Returns the user details or error message.
    """

    if not request.method=='GET':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    
    try:
        user=GearguardUser.objects.get(id=pk)
        data={
            'id':user.id,
            'username':user.username,
            'email':user.email,
            'first_name':user.first_name,
            'last_name':user.last_name,
            'role':user.role
        }
        return JsonResponse(data,status=200)
    except GearguardUser.DoesNotExist:
        return JsonResponse({'error':'User not found'},status=404)
    

@csrf_exempt
def user_update_view(request,pk):
    """
    Updates details of a specific user by ID.
    Returns the updated user details or error message.
    """

    if not request.method=='PUT':
        return JsonResponse({'error':'Invalid HTTP method'},status=405)
    
    try:
        user=GearguardUser.objects.get(id=pk)
        data=json.loads(request.body)
        
        user.first_name=data.get('first_name',user.first_name)
        user.last_name=data.get('last_name',user.last_name)
        user.email=data.get('email',user.email)
        user.role=data.get('role',user.role)
        
        user.save()
        
        updated_data={
            'id':user.id,
            'username':user.username,
            'email':user.email,
            'first_name':user.first_name,
            'last_name':user.last_name,
            'role':user.role
        }
        return JsonResponse(updated_data,status=200)
    except GearguardUser.DoesNotExist:
        return JsonResponse({'error':'User not found'},status=404)