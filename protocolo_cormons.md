# Protocolo de Comunicación - Sistema Buscador de Productos

## 1. Introducción

### 1.1 Propósito

Este documento define las reglas y especificaciones para la comunicación entre sistemas externos y el Sistema Buscador de Productos desarrollado con Django. Establece los formatos de datos, métodos de solicitud, respuestas y manejo de errores para garantizar una comunicación efectiva entre ambos sistemas.

### 1.2 Alcance

Este protocolo abarca:
- Autenticación de usuarios en la interfaz web
- Comunicación API para búsqueda de productos por código o descripción
- Respuestas estandarizadas para diferentes tipos de consultas

### 1.3 Definiciones y Acrónimos

- API: Application Programming Interface
- JSON: JavaScript Object Notation
- REST: Representational State Transfer
- HTTP: Hypertext Transfer Protocol
- JWT: JSON Web Token (para implementaciones futuras)

## 2. Arquitectura del Sistema

### 2.1 Estructura General

El sistema está organizado en tres componentes principales:

1. **Módulo Web**: Componente central que conecta los demás módulos
2. **API**: Gestiona la comunicación con sistemas externos mediante endpoints REST
3. **Web**: Controla la interfaz de usuario, autenticación y sesiones

### 2.2 Modelo de Datos

El modelo principal del sistema es `Producto` con los siguientes campos:

- `id`: Identificador único (entero, autogenerado)
- `codigo`: Código único del producto (cadena, máx. 50 caracteres)
- `descripcion`: Descripción del producto (cadena, máx. 255 caracteres)
- `stock`: Cantidad disponible (entero)

## 3. Autenticación y Sesión Web

### 3.1 Proceso de Login

- **URL**: `/login/`
- **Método**: POST
- **Parámetros del Formulario**:
  - `username`: Nombre de usuario
  - `password`: Contraseña
  - `remember`: (opcional) Checkbox para recordar sesión
- **Respuestas**:
  - Éxito: Redirección a `/` (buscador)
  - Error: Mensaje de error "Usuario o contraseña incorrectos"

### 3.2 Cierre de Sesión

- **URL**: `/logout/`
- **Método**: GET
- **Respuesta**: Redirección a `/login/` con mensaje de éxito

### 3.3 Control de Acceso

- Todas las páginas del buscador requieren autenticación
- Redirección automática a login para usuarios no autenticados
- Opciones de "recordarme" para sesiones persistentes

## 4. API de Comunicación Externa

### 4.1 Especificaciones Generales

- **Base URL**: `/api/`
- **Formato**: Todas las respuestas son en JSON
- **Codificación**: UTF-8
- **Autenticación**: Actualmente no requiere autenticación (implementación futura)

### 4.2 Búsqueda de Productos

#### Endpoint de Búsqueda

- **URL**: `/api/buscar/`
- **Método**: GET
- **Parámetros de Consulta**:
  - `q` (requerido): Término de búsqueda
  - `tipo` (opcional): Tipo de búsqueda ('codigo' o 'descripcion', default: 'descripcion')

#### Tipos de Respuesta

1. **Producto Único** (coincidencia exacta por código)

- **Código**: 200 OK
- **Estructura**:
```json
{
  "tipo_respuesta": "producto_unico",
  "producto": {
    "id": integer,
    "codigo": "string",
    "descripcion": "string",
    "stock": integer
  }
}
```

2. **Lista de Productos** (búsqueda por descripción o código parcial)

- **Código**: 200 OK
- **Estructura**:
```json
{
  "tipo_respuesta": "lista_productos",
  "cantidad": integer,
  "productos": [
    {
      "id": integer,
      "codigo": "string",
      "descripcion": "string",
      "stock": integer
    },
    ...
  ]
}
```

3. **Demasiados Resultados**

- **Código**: 200 OK
- **Estructura**:
```json
{
  "tipo_respuesta": "demasiados_resultados",
  "mensaje": "Por favor, especifique más su búsqueda para obtener resultados más precisos."
}
```

4. **Error de Solicitud**

- **Código**: 400 Bad Request
- **Estructura**:
```json
{
  "error": "Debe proporcionar un término de búsqueda"
}
```

## 5. Manejo de Errores

### 5.1 Interfaz Web

- Mensajes de error mostrados mediante Django Messages Framework
- Sesión de mensajes con auto-cierre después de 5 segundos
- Clases de alerta según tipo de mensaje (error, success, etc.)

### 5.2 API

- **Estructura Estándar de Error**:
```json
{
  "error": "Mensaje descriptivo del error"
}
```

- **Códigos de Estado HTTP**:
  - 200 OK: Solicitud procesada correctamente
  - 400 Bad Request: Error en la solicitud (falta de parámetros)
  - 404 Not Found: Recurso o ruta no encontrada
  - 500 Internal Server Error: Error interno del servidor

## 6. Ejemplos de Uso

### 6.1 Proceso de Login

#### Solicitud
```
POST /login/
Content-Type: application/x-www-form-urlencoded

username=admin&password=secretpassword&remember=on
```

#### Resultado
- Redireccionamiento a `/` (buscador) con sesión iniciada
- En caso de error, redirección a `/login/` con mensaje de error

### 6.2 Búsqueda por Código Exacto

#### Solicitud
```
GET /api/buscar/?q=ABC123&tipo=codigo
```

#### Respuesta
```
200 OK
{
  "tipo_respuesta": "producto_unico",
  "producto": {
    "id": 1,
    "codigo": "ABC123",
    "descripcion": "Teclado Mecánico RGB",
    "stock": 15
  }
}
```

### 6.3 Búsqueda por Descripción

#### Solicitud
```
GET /api/buscar/?q=teclado&tipo=descripcion
```

#### Respuesta
```
200 OK
{
  "tipo_respuesta": "lista_productos",
  "cantidad": 2,
  "productos": [
    {
      "id": 1,
      "codigo": "ABC123",
      "descripcion": "Teclado Mecánico RGB",
      "stock": 15
    },
    {
      "id": 5,
      "codigo": "XYZ789",
      "descripcion": "Teclado Inalámbrico",
      "stock": 12
    }
  ]
}
```

