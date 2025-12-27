from django.urls import path
from .views import *

urlpatterns = [

    path('create/', equipment_create_view, name='equipment-create'),
    path('list/', list_equipment_view, name='equipment-list'),
    path('<int:pk>/', equipment_detail_view, name='equipment-detail'),
    path('<int:pk>/update/', equipment_update_view, name='equipment-update'),
    path('<int:pk>/delete/', equipment_delete_view, name='equipment-delete'),
    path('<int:pk>/maintenancerequests/', getmaintancerequestforequipment_view, name='get-maintenance-requests-for-equipment'),

]