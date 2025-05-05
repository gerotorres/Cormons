# Crear un archivo api/management/commands/crear_datos_prueba.py

from django.core.management.base import BaseCommand
from api.models import Producto
import random
from decimal import Decimal

class Command(BaseCommand):
    help = 'Crea datos de prueba para el buscador de productos'

    def handle(self, *args, **kwargs):
        # Borrar datos existentes
        Producto.objects.all().delete()
        
        # Lista de productos de ejemplo
        productos = [
            {'codigo': 'A001', 'descripcion': 'Martillo profesional', 'stock': 45},
            {'codigo': 'A002', 'descripcion': 'Destornillador Phillips', 'stock': 120},
            {'codigo': '786896987', 'descripcion': 'Sierra circular 7"', 'stock': 18},
            # Añadir más productos...
        ]
        
        # Crear más productos ficticios para probar la paginación
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
            
        self.stdout.write(self.style.SUCCESS(f'Se crearon {len(productos)} productos de prueba'))