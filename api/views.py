from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Producto
from .serializers import ProductoSerializer

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.management import call_command
import io
import sys

class BusquedaProductoAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        tipo_busqueda = request.query_params.get('tipo', 'descripcion')  # 'codigo' o 'descripcion'
        
        if not query:
            return Response({"error": "Debe proporcionar un término de búsqueda"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Búsqueda por código (coincidencia exacta)
        if tipo_busqueda == 'codigo':
            try:
                producto = Producto.objects.get(codigo=query)
                serializer = ProductoSerializer(producto)
                return Response({
                    "tipo_respuesta": "producto_unico",
                    "producto": serializer.data
                })
            except Producto.DoesNotExist:
                # Si no hay coincidencia exacta, buscar parcial
                productos = Producto.objects.filter(codigo__icontains=query)
        else:
            # Búsqueda por descripción
            productos = Producto.objects.filter(descripcion__icontains=query)
        
        # Verificar cantidad de resultados
        if productos.count() > 100:  # Límite arbitrario, ajustar según necesidades
            return Response({
                "tipo_respuesta": "demasiados_resultados",
                "mensaje": "Por favor, especifique más su búsqueda para obtener resultados más precisos."
            })
        
        # Devolver lista de productos
        serializer = ProductoSerializer(productos, many=True)
        return Response({
            "tipo_respuesta": "lista_productos",
            "cantidad": productos.count(),
            "productos": serializer.data
        })

@csrf_exempt
def cargar_datos_prueba(request):
    try:
        # Importar lo necesario
        from api.models import Producto
        import random
        
        # Borrar datos existentes
        Producto.objects.all().delete()
        
        # Lista de productos de ejemplo
        productos = [
            {'codigo': 'A001', 'descripcion': 'Martillo profesional', 'stock': 45},
            {'codigo': 'A002', 'descripcion': 'Destornillador Phillips', 'stock': 120},
            {'codigo': '786896987', 'descripcion': 'Sierra circular 7"', 'stock': 18},
        ]
        
        # Crear más productos ficticios
        categorias = ['Herramientas', 'Electricidad', 'Plomería', 'Jardinería', 'Pintura']
        items = ['Llave', 'Cable', 'Tubo', 'Pinza', 'Tornillo', 'Pala', 'Brocha', 'Cinta']
        
        for i in range(1, 201):
            codigo = f'P{i:04d}'
            categoria = random.choice(categorias)
            item = random.choice(items)
            descripcion = f'{categoria} - {item} {i}'
            stock = random.randint(0, 200)
            
            productos.append({
                'codigo': codigo,
                'descripcion': descripcion,
                'stock': stock
            })
        
        # Crear los productos
        for producto_data in productos:
            Producto.objects.create(**producto_data)
            
        return HttpResponse(f'Se crearon {len(productos)} productos de prueba')
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        return HttpResponse(f"Error al cargar datos: {str(e)}<br><pre>{error_traceback}</pre>")