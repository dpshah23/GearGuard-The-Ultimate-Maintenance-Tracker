from django.urls import path
from .views import signup_view, login_view, list_users_view, user_detail_view

urlpatterns = [

    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('list/', list_users_view, name='user-list'),
    path('<int:pk>/', user_detail_view, name='user-detail'),

    
]