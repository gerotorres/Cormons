# Protocolo de Comunicación - Sistema de Gestión e Interfaz API

## 1. Introducción

### 1.1 Propósito
Este documento define las reglas y especificaciones para la comunicación entre el sistema de gestión externo y la API de interfaz desarrollada con Django. Establece los formatos de datos, métodos de solicitud, respuestas y manejo de errores para garantizar una comunicación efectiva entre ambos sistemas.

### 1.2 Alcance
Este protocolo abarca todas las interacciones relacionadas con la gestión de inventario, productos, ventas, clientes, proveedores y categorías entre el sistema de gestión y la API.

### 1.3 Definiciones y Acrónimos
- **API**: Application Programming Interface
- **JSON**: JavaScript Object Notation
- **REST**: Representational State Transfer
- **HTTP**: Hypertext Transfer Protocol
- **JWT**: JSON Web Token

## 2. Especificaciones Generales

### 2.1 Formato de Comunicación
- Todas las solicitudes y respuestas utilizarán el formato JSON.
- Los caracteres se codificarán en UTF-8.
- Los timestamps se representarán en formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ).
- Los valores decimales utilizarán punto como separador decimal.

### 2.2 Autenticación
- Todas las solicitudes requieren autenticación mediante tokens JWT.
- El token debe incluirse en el encabezado HTTP de la siguiente manera:
  ```
  Authorization: Bearer {token}
  ```
- Los tokens tienen una validez de 24 horas y deben renovarse mediante el endpoint de autenticación.

### 2.3 Versionado
- La versión actual del API es v1.
- Todas las rutas incluirán el prefijo `/api/v1/`.
- Las versiones futuras utilizarán un nuevo prefijo (ejemplo: `/api/v2/`).

## 3. Operaciones del API

### 3.1 Autenticación

#### Obtener Token
- **Método**: POST
- **URL**: `/api/v1/auth/token/`
- **Cuerpo de la Solicitud**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Respuesta Exitosa** (200 OK):
  ```json
  {
    "token": "string",
    "expires_at": "datetime"
  }
  ```
- **Respuesta Error** (401 Unauthorized):
  ```json
  {
    "error": "Credenciales inválidas"
  }
  ```

### 3.2 Productos

#### Listar Productos
- **Método**: GET
- **URL**: `/api/v1/productos/`
- **Parámetros de Consulta**:
  - `categoria_id` (opcional): ID de categoría para filtrar
  - `marca_id` (opcional): ID de marca para filtrar
  - `q` (opcional): Término de búsqueda
  - `page` (opcional): Número de página
  - `limit` (opcional): Límite de resultados por página (default: 20)
- **Respuesta Exitosa** (200 OK):
  ```json
  {
    "results": [
      {
        "id": "integer",
        "nombre": "string",
        "descripcion": "string",
        "precio_costo": "decimal",
        "precio_venta": "decimal",
        "stock": "integer",
        "stock_minimo": "integer",
        "categoria": {
          "id": "integer",
          "nombre": "string"
        },
        "subcategoria": {
          "id": "integer",
          "nombre": "string"
        },
        "codigo_barras": "string",
        "ubicacion_deposito": "string",
        "marca": {
          "id": "integer",
          "nombre": "string"
        },
        "proveedor": {
          "id": "integer",
          "nombre": "string"
        }
      }
    ],
    "count": "integer",
    "next": "string",
    "previous": "string"
  }
  ```

#### Obtener Producto
- **Método**: GET
- **URL**: `/api/v1/productos/{id}/`
- **Respuesta Exitosa** (200 OK):
  ```json
  {
    "id": "integer",
    "nombre": "string",
    "descripcion": "string",
    "precio_costo": "decimal",
    "precio_venta": "decimal",
    "stock": "integer",
    "stock_minimo": "integer",
    "categoria": {
      "id": "integer",
      "nombre": "string"
    },
    "subcategoria": {
      "id": "integer",
      "nombre": "string"
    },
    "codigo_barras": "string",
    "ubicacion_deposito": "string",
    "marca": {
      "id": "integer",
      "nombre": "string"
    },
    "proveedor": {
      "id": "integer",
      "nombre": "string"
    }
  }
  ```
- **Respuesta Error** (404 Not Found):
  ```json
  {
    "error": "Producto no encontrado"
  }
  ```

#### Crear Producto
- **Método**: POST
- **URL**: `/api/v1/productos/`
- **Cuerpo de la Solicitud**:
  ```json
  {
    "nombre": "string",
    "descripcion": "string",
    "precio_costo": "decimal",
    "precio_venta": "decimal",
    "stock": "integer",
    "stock_minimo": "integer",
    "categoria_id": "integer",
    "subcategoria_id": "integer",
    "codigo_barras": "string",
    "ubicacion_deposito": "string",
    "marca_id": "integer",
    "proveedor_id": "integer"
  }
  ```
- **Respuesta Exitosa** (201 Created):
  ```json
  {
    "id": "integer",
    "nombre": "string",
    "descripcion": "string",
    "precio_costo": "decimal",
    "precio_venta": "decimal",
    "stock": "integer",
    "stock_minimo": "integer",
    "categoria": {
      "id": "integer",
      "nombre": "string"
    },
    "subcategoria": {
      "id": "integer",
      "nombre": "string"
    },
    "codigo_barras": "string",
    "ubicacion_deposito": "string",
    "marca": {
      "id": "integer",
      "nombre": "string"
    },
    "proveedor": {
      "id": "integer",
      "nombre": "string"
    }
  }
  ```
- **Respuesta Error** (400 Bad Request):
  ```json
  {
    "error": "string",
    "details": {
      "campo": ["mensaje de error"]
    }
  }
  ```

#### Actualizar Producto
- **Método**: PUT
- **URL**: `/api/v1/productos/{id}/`
- **Cuerpo de la Solicitud**:
  ```json
  {
    "nombre": "string",
    "descripcion": "string",
    "precio_costo": "decimal",
    "precio_venta": "decimal",
    "stock": "integer",
    "stock_minimo": "integer",
    "categoria_id": "integer",
    "subcategoria_id": "integer",
    "codigo_barras": "string",
    "ubicacion_deposito": "string",
    "marca_id": "integer",
    "proveedor_id": "integer"
  }
  ```
- **Respuesta Exitosa** (200 OK):
  ```json
  {
    "id": "integer",
    "nombre": "string",
    "descripcion": "string",
    "precio_costo": "decimal",
    "precio_venta": "decimal",
    "stock": "integer",
    "stock_minimo": "integer",
    "categoria": {
      "id": "integer",
      "nombre": "string"
    },
    "subcategoria": {
      "id": "integer",
      "nombre": "string"
    },
    "codigo_barras": "string",
    "ubicacion_deposito": "string",
    "marca": {
      "id": "integer",
      "nombre": "string"
    },
    "proveedor": {
      "id": "integer",
      "nombre": "string"
    }
  }
  ```

#### Actualizar Parcialmente Producto
- **Método**: PATCH
- **URL**: `/api/v1/productos/{id}/`
- **Cuerpo de la Solicitud**:
  ```json
  {
    "campo1": "valor1",
    "campo2": "valor2"
  }
  ```
- **Respuesta Exitosa** (200 OK):
  ```json
  {
    "id": "integer",
    "nombre": "string",
    "descripcion": "string",
    "precio_costo": "decimal",
    "precio_venta": "decimal",
    "stock": "integer",
    "stock_minimo": "integer",
    "categoria": {
      "id": "integer",
      "nombre": "string"
    },
    "subcategoria": {
      "id": "integer",
      "nombre": "string"
    },
    "codigo_barras": "string",
    "ubicacion_deposito": "string",
    "marca": {
      "id": "integer",
      "nombre": "string"
    },
    "proveedor": {
      "id": "integer",
      "nombre": "string"
    }
  }
  ```

#### Eliminar Producto
- **Método**: DELETE
- **URL**: `/api/v1/productos/{id}/`
- **Respuesta Exitosa** (204 No Content)
- **Respuesta Error** (404 Not Found):
  ```json
  {
    "error": "Producto no encontrado"
  }
  ```

### 3.3 Ventas

#### Listar Ventas
- **Método**: GET
- **URL**: `/api/v1/ventas/`
- **Parámetros de Consulta**:
  - `cliente_id` (opcional): ID del cliente
  - `fecha_inicio` (opcional): Fecha de inicio (formato YYYY-MM-DD)
  - `fecha_fin` (opcional): Fecha fin (formato YYYY-MM-DD)
  - `page` (opcional): Número de página
  - `limit` (opcional): Límite de resultados por página (default: 20)
- **Respuesta Exitosa** (200 OK):
  ```json
  {
    "results": [
      {
        "id": "integer",
        "cliente": {
          "id": "integer",
          "nombre": "string"
        },
        "fecha": "datetime",
        "total": "decimal",
        "formas_pago": [
          {
            "forma_pago": "string",
            "monto": "decimal"
          }
        ],
        "detalles": [
          {
            "producto": {
              "id": "integer",
              "nombre": "string"
            },
            "cantidad": "integer",
            "precio": "decimal",
            "descuento": "decimal",
            "subtotal": "decimal"
          }
        ]
      }
    ],
    "count": "integer",
    "next": "string",
    "previous": "string"
  }
  ```

#### Crear Venta
- **Método**: POST
- **URL**: `/api/v1/ventas/`
- **Cuerpo de la Solicitud**:
  ```json
  {
    "cliente_id": "integer",
    "formas_pago": [
      {
        "forma_pago_id": "integer",
        "monto": "decimal"
      }
    ],
    "detalles": [
      {
        "producto_id": "integer",
        "cantidad": "integer",
        "precio": "decimal",
        "descuento": "decimal"
      }
    ]
  }
  ```
- **Respuesta Exitosa** (201 Created):
  ```json
  {
    "id": "integer",
    "cliente": {
      "id": "integer",
      "nombre": "string"
    },
    "fecha": "datetime",
    "total": "decimal",
    "formas_pago": [
      {
        "forma_pago": "string",
        "monto": "decimal"
      }
    ],
    "detalles": [
      {
        "producto": {
          "id": "integer",
          "nombre": "string"
        },
        "cantidad": "integer",
        "precio": "decimal",
        "descuento": "decimal",
        "subtotal": "decimal"
      }
    ]
  }
  ```

### 3.4 Categorías, Marcas y Proveedores

Para categorías, marcas y proveedores se seguirá un patrón similar con endpoints:
- `/api/v1/categorias/`
- `/api/v1/subcategorias/`
- `/api/v1/marcas/`
- `/api/v1/proveedores/`

Cada uno con operaciones CRUD básicas (GET, POST, PUT, PATCH, DELETE).

## 4. Manejo de Errores

### 4.1 Estructura de Respuesta de Error
Todas las respuestas de error seguirán esta estructura:
```json
{
  "error": "string",
  "details": {
    "campo1": ["error1", "error2"],
    "campo2": ["error3"]
  },
  "code": "string"
}
```

### 4.2 Códigos de Estado HTTP
- **200 OK**: Solicitud procesada correctamente
- **201 Created**: Recurso creado correctamente
- **204 No Content**: Solicitud procesada correctamente sin contenido para devolver
- **400 Bad Request**: Error en la solicitud del cliente
- **401 Unauthorized**: Autenticación requerida
- **403 Forbidden**: No tiene permisos para esta acción
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto con el estado actual del recurso
- **422 Unprocessable Entity**: No se puede procesar la entidad
- **429 Too Many Requests**: Demasiadas solicitudes
- **500 Internal Server Error**: Error del servidor

### 4.3 Códigos de Error Personalizados
- **P001**: Error de validación de producto
- **V001**: Error en la creación de venta
- **A001**: Error de autenticación
- **S001**: Error de stock insuficiente

## 5. Consideraciones de Seguridad

### 5.1 Cifrado
- Todas las comunicaciones utilizarán HTTPS/TLS 1.2 o superior.
- No se transmitirán contraseñas en texto plano.

### 5.2 Validación de Datos
- Todos los datos de entrada serán validados:
  - Tipos de datos correctos
  - Rangos válidos
  - Longitudes aceptables
  - Sanitización contra inyección SQL/XSS

### 5.3 Control de Acceso
- Verificación de permisos para cada acción según el rol del usuario
- Registros de auditoría para operaciones críticas

## 6. Límites y Paginación

### 6.1 Rate Limiting
- Máximo 100 solicitudes por minuto por usuario
- Las respuestas incluirán headers para informar límites:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1618884730
  ```

### 6.2 Paginación
- Resultados paginados con parámetros `page` y `limit`
- Respuestas incluirán `count`, `next` y `previous` para navegación

## 7. Ejemplos Completos

### 7.1 Ejemplo de Flujo de Autenticación
```
# Solicitud
POST /api/v1/auth/token/
{
  "username": "admin",
  "password": "password123"
}

# Respuesta
200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2025-04-28T14:30:00Z"
}
```

### 7.2 Ejemplo de Creación de Producto
```
# Solicitud
POST /api/v1/productos/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "nombre": "Teclado Mecánico RGB",
  "descripcion": "Teclado mecánico con retroiluminación RGB",
  "precio_costo": 45.50,
  "precio_venta": 89.99,
  "stock": 15,
  "stock_minimo": 5,
  "categoria_id": 3,
  "subcategoria_id": 12,
  "codigo_barras": "7890123456789",
  "ubicacion_deposito": "Estantería A-4",
  "marca_id": 8,
  "proveedor_id": 4
}

# Respuesta
201 Created
{
  "id": 156,
  "nombre": "Teclado Mecánico RGB",
  "descripcion": "Teclado mecánico con retroiluminación RGB",
  "precio_costo": 45.50,
  "precio_venta": 89.99,
  "stock": 15,
  "stock_minimo": 5,
  "categoria": {
    "id": 3,
    "nombre": "Periféricos"
  },
  "subcategoria": {
    "id": 12,
    "nombre": "Teclados"
  },
  "codigo_barras": "7890123456789",
  "ubicacion_deposito": "Estantería A-4",
  "marca": {
    "id": 8,
    "nombre": "TechGear"
  },
  "proveedor": {
    "id": 4,
    "nombre": "ImportTech"
  }
}
```

### 7.3 Ejemplo de Creación de Venta
```
# Solicitud
POST /api/v1/ventas/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "cliente_id": 34,
  "formas_pago": [
    {
      "forma_pago_id": 1,
      "monto": 500.00
    },
    {
      "forma_pago_id": 2,
      "monto": 243.50
    }
  ],
  "detalles": [
    {
      "producto_id": 156,
      "cantidad": 2,
      "precio": 89.99,
      "descuento": 10.00
    },
    {
      "producto_id": 283,
      "cantidad": 1,
      "precio": 599.00,
      "descuento": 0.00
    }
  ]
}

# Respuesta
201 Created
{
  "id": 1458,
  "cliente": {
    "id": 34,
    "nombre": "Juan Pérez"
  },
  "fecha": "2025-04-28T10:22:45Z",
  "total": 743.50,
  "formas_pago": [
    {
      "forma_pago": "Efectivo",
      "monto": 500.00
    },
    {
      "forma_pago": "Tarjeta de Débito",
      "monto": 243.50
    }
  ],
  "detalles": [
    {
      "producto": {
        "id": 156,
        "nombre": "Teclado Mecánico RGB"
      },
      "cantidad": 2,
      "precio": 89.99,
      "descuento": 10.00,
      "subtotal": 161.98
    },
    {
      "producto": {
        "id": 283,
        "nombre": "Monitor 27\" 4K"
      },
      "cantidad": 1,
      "precio": 599.00,
      "descuento": 0.00,
      "subtotal": 599.00
    }
  ]
}
```

## 8. Notas de Implementación

### 8.1 Django REST Framework
- Utilizar serializadores para validación de datos
- Implementar ViewSets para operaciones CRUD estándar
- Configurar rutas con DefaultRouter

### 8.2 Permisos y Autenticación
- Implementar JWT con django-rest-framework-simplejwt
- Configurar permisos por vista

### 8.3 Optimización de Rendimiento
- Implementar caché para endpoints de solo lectura
- Utilizar select_related/prefetch_related para optimizar consultas
