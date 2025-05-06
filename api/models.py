from django.db import models

class Producto(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=255)
    stock = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.codigo} - {self.descripcion}"
