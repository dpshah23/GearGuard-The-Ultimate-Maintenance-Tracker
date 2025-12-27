from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'requests', MaintenanceRequestViewSet, basename='maintenance')

urlpatterns = [
    path('', include(router.urls)),
    path('list/', list_maintenance_requests, name='equipment-list'),
    path('<int:pk>/', request_detail_view, name='equipment-detail'),
]
