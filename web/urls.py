# web/urls.py
from django.urls import path
from .views import buscador_view, login_view, logout_view

urlpatterns = [
    path('', buscador_view, name='buscador'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
]