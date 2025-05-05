# api/urls.py
from django.urls import path
from .views import BusquedaProductoAPIView
from .views import cargar_datos_prueba

urlpatterns = [
    path('buscar/', BusquedaProductoAPIView.as_view(), name='buscar_productos'),
    path('cargar-datos-prueba/', cargar_datos_prueba, name='cargar_datos_prueba'),
]