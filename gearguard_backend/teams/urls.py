from django.urls import path
from .views import  *  

urlpatterns = [
    path('list/', get_all_teams, name='get_all_teams'),
    path('find/<int:team_id>/', get_team_details, name='get_team_by_id'),
    path('create/', create_team, name='create_team'),

]