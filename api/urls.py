# api/urls.py
from django.urls import path
from .views import BusquedaProductoAPIView

urlpatterns = [
    path('buscar/', BusquedaProductoAPIView.as_view(), name='buscar_productos'),
]