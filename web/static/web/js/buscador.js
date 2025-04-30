// web/static/web/js/buscador.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const searchForm = document.getElementById('search-form');
    const searchQuery = document.getElementById('search-query');
    const tabDescripcion = document.getElementById('tab-descripcion');
    const tabCodigo = document.getElementById('tab-codigo');
    const resultsContainer = document.getElementById('results-container');
    const singleProductTemplate = document.getElementById('single-product-template');
    const productListTemplate = document.getElementById('product-list-template');
    const loadingTemplate = document.getElementById('loading-template');
    const messageTemplate = document.getElementById('message-template');
    
    // Estado de la aplicación
    let busquedaPorDescripcion = true;
    
    // Alternar entre pestañas de búsqueda
    tabDescripcion.addEventListener('click', function() {
        if (!tabDescripcion.classList.contains('active')) {
            tabDescripcion.classList.add('active');
            tabCodigo.classList.remove('active');
            busquedaPorDescripcion = true;
            searchQuery.placeholder = "Ingrese descripción del producto...";
            // Limpiar el campo de búsqueda al cambiar de pestaña
            searchQuery.value = '';
            // Enfocar el campo de búsqueda
            searchQuery.focus();
        }
    });
    
    tabCodigo.addEventListener('click', function() {
        if (!tabCodigo.classList.contains('active')) {
            tabCodigo.classList.add('active');
            tabDescripcion.classList.remove('active');
            busquedaPorDescripcion = false;
            searchQuery.placeholder = "Ingrese código del producto...";
            // Limpiar el campo de búsqueda al cambiar de pestaña
            searchQuery.value = '';
            // Enfocar el campo de búsqueda
            searchQuery.focus();
        }
    });
    
    // Manejo del formulario de búsqueda
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchQuery.value.trim();
        
        if (!query) {
            mostrarMensaje("Por favor ingrese un término de búsqueda");
            return;
        }
        
        // Realizar la búsqueda
        buscarProductos(query, busquedaPorDescripcion ? 'descripcion' : 'codigo');
    });
    
    // Funcionalidad del botón de cámara 
    document.getElementById('camera-btn').addEventListener('click', function() {
        mostrarMensaje("Funcionalidad de escaneo de código de barras no disponible en esta versión");
    });
    
    // Función para buscar productos
    function buscarProductos(query, tipo) {
        // Guardar la consulta actual
        ultimaBusqueda.query = query;
        ultimaBusqueda.tipo = tipo;
        
        // Mostrar indicador de carga
        mostrarCargando();
        
        // Agregar un pequeño retraso para simular el tiempo de respuesta de la API real
        setTimeout(() => {
            fetch(`/api/buscar/?q=${encodeURIComponent(query)}&tipo=${tipo}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la búsqueda');
                    }
                    return response.json();
                })
                .then(data => {
                    mostrarResultados(data);
                })
                .catch(error => {
                    mostrarMensaje(`Error: ${error.message}. Por favor intente nuevamente.`);
                });
        }, 500);
    }
    
    // Función para mostrar resultados
    function mostrarResultados(data) {
        limpiarResultados();
        
        switch (data.tipo_respuesta) {
            case 'producto_unico':
                mostrarProductoUnico(data.producto);
                break;
            
            case 'lista_productos':
                if (data.cantidad === 0) {
                    mostrarMensaje("No se encontraron productos que coincidan con su búsqueda");
                } else {
                    mostrarListaProductos(data.productos);
                }
                break;
            
            case 'demasiados_resultados':
                mostrarMensaje(data.mensaje || "Su búsqueda produjo demasiados resultados. Por favor, sea más específico.");
                break;
            
            default:
                mostrarMensaje("Resultado no reconocido. Por favor intente con otra búsqueda.");
        }
    }
    
    // Variables para almacenar el estado de la búsqueda
    let ultimaBusqueda = {
        query: '',
        tipo: '',
        resultados: []
    };
    
    // Mostrar un producto único
    function mostrarProductoUnico(producto) {
        const clone = singleProductTemplate.content.cloneNode(true);
        
        // Llenar los datos
        clone.querySelector('.product-name').textContent = producto.descripcion;
        clone.querySelector('.product-code').textContent = producto.codigo;
        
        // Formatear el stock con clases según su nivel
        const stockElement = clone.querySelector('.product-stock');
        stockElement.textContent = producto.stock;
        
        if (producto.stock <= 0) {
            stockElement.classList.add('stock-unavailable');
        } else if (producto.stock < 10) {
            stockElement.classList.add('stock-low');
        } else {
            stockElement.classList.add('stock-available');
        }
        
        // Agregar funcionalidad al botón de volver
        const backButton = clone.querySelector('#back-to-list');
        backButton.addEventListener('click', function() {
            // Si tenemos resultados previos, los mostramos
            if (ultimaBusqueda.resultados.length > 0) {
                limpiarResultados();
                mostrarListaProductos(ultimaBusqueda.resultados);
            } else {
                // Si no hay lista previa, sugerimos hacer una nueva búsqueda
                mostrarMensaje("No hay resultados previos disponibles. Realice una nueva búsqueda.");
            }
        });
        
        resultsContainer.appendChild(clone);
    }
    
    // Mostrar lista de productos
    function mostrarListaProductos(productos) {
        const clone = productListTemplate.content.cloneNode(true);
        const tbody = clone.querySelector('tbody');
        
        productos.forEach(producto => {
            const tr = document.createElement('tr');
            
            // Formatear el stock con clases según su nivel
            let stockClass = '';
            if (producto.stock <= 0) {
                stockClass = 'stock-unavailable';
            } else if (producto.stock < 10) {
                stockClass = 'stock-low';
            } else {
                stockClass = 'stock-available';
            }
            
            tr.innerHTML = `
                <td>${producto.codigo}</td>
                <td>${producto.descripcion}</td>
                <td class="${stockClass}">${producto.stock}</td>
            `;
            
            // Hacer la fila clickeable para ver detalles
            tr.addEventListener('click', () => {
                limpiarResultados();
                mostrarProductoUnico(producto);
            });
            
            tbody.appendChild(tr);
        });
        
        // Guardar los productos para poder volver a ellos
        ultimaBusqueda.resultados = productos;
        
        resultsContainer.appendChild(clone);
    }
    
    // Mostrar mensaje informativo
    function mostrarMensaje(mensaje) {
        limpiarResultados();
        const clone = messageTemplate.content.cloneNode(true);
        clone.querySelector('.message').textContent = mensaje;
        resultsContainer.appendChild(clone);
    }
    
    // Mostrar indicador de carga
    function mostrarCargando() {
        limpiarResultados();
        const clone = loadingTemplate.content.cloneNode(true);
        resultsContainer.appendChild(clone);
    }
    
    // Limpiar resultados
    function limpiarResultados() {
        resultsContainer.innerHTML = '';
    }
    
    // Enfoque en el input de búsqueda al cargar la página
    searchQuery.focus();
    
    // Botón CORMONS (simulación)
    document.getElementById('cormons-btn').addEventListener('click', function() {
        mostrarMensaje("Funcionalidad CORMONS iniciada");
    });
    
    // Agregar funcionalidad para limpiar búsqueda con botón X
    document.getElementById('clear-search').addEventListener('click', function() {
        searchQuery.value = '';
        searchQuery.focus();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Toggle del menú de usuario
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuToggle && userDropdown) {
        userMenuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        // Cerrar el menú si se hace clic fuera
        document.addEventListener('click', (event) => {
            if (!userMenuToggle.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
});