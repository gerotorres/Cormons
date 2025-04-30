from django.db import migrations
from django.contrib.auth.models import User

def create_superuser(apps, schema_editor):
    # Crea un superusuario si no existe
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@ejemplo.com', 'contraseña123')

def reverse_func(apps, schema_editor):
    # No hacemos nada al revertir
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('auth', '__latest__'),  # Ajusta esto según el nombre de tu última migración
    ]
    
    operations = [
        migrations.RunPython(create_superuser, reverse_func),
    ]