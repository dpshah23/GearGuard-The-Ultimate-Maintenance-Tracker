from django.urls import path
from .views import *

urlpatterns = [
    path('list/', list_department_view, name='equipment-list'),
    path('<int:pk>/', department_detail_view, name='equipment-detail'),
]