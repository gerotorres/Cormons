from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Producto
from .serializers import ProductoSerializer


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
