from django.urls import path
from .views import main

urlpatterns = [
    path('', main)
]


# python .\manage.py makemigrations
# python .\manage.py migrate
#  Whenever we make a change to the model, or database, run this.

# OR run it when we first boot up the app


# Running server
# python .\manage.py runserver