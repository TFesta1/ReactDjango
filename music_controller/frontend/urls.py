from django.urls import path
from .views import index
# from api.views import main

app_name = 'frontend' #This is the name of the app, used in views in spotify

urlpatterns = [
    path('', index, name=''),
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index)
    # path('', main)
]