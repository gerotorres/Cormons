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
    const clearSearchBtn = document.getElementById('clear-search');
    const cameraBtn = document.getElementById('camera-btn');
    
    // Variables para el escáner (ahora usando Html5QrCode)
    let html5QrScanner = null;
    
    // Estado de la aplicación 
    let busquedaPorDescripcion = false;
    
    if (!tabCodigo.classList.contains('active')) {
        tabCodigo.classList.add('active');
        tabDescripcion.classList.remove('active');
    }
    
    searchQuery.placeholder = "Ingrese código del producto...";
    
    // Alterna entre pestañas de búsqueda
    tabDescripcion.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(tab => {
            tab.classList.remove('active');
            tab.classList.remove('sliding-in');
        });
        
        tabDescripcion.classList.add('active');
        tabDescripcion.classList.add('sliding-in');
        
        busquedaPorDescripcion = true;
        searchQuery.placeholder = "Ingrese descripción del producto...";
        
        // Limpiar el campo de búsqueda al cambiar de pestaña
        searchQuery.value = '';
        // Enfocar el campo de búsqueda
        searchQuery.focus();
    });
    
    tabCodigo.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(tab => {
            tab.classList.remove('active');
            tab.classList.remove('sliding-in');
        });
        
        tabCodigo.classList.add('active');
        tabCodigo.classList.add('sliding-in');
        
        busquedaPorDescripcion = false;
        searchQuery.placeholder = "Ingrese código del producto...";
        
        // Limpiar el campo de búsqueda al cambiar de pestaña
        searchQuery.value = '';
        // Enfocar el campo de búsqueda
        searchQuery.focus();
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
    
    // Funcionalidad del botón de código de barras
    cameraBtn.addEventListener('click', function() {
        // Verificar si el navegador soporta getUserMedia (acceso a la cámara)
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            mostrarMensaje("Su navegador no soporta acceso a la cámara. Por favor actualice su navegador o ingrese el código manualmente.");
            return;
        }
        
        // Obtener referencia al modal
        const scannerModalEl = document.getElementById('scannerModal');
        
        // Verificar si bootstrap está disponible
        if (typeof bootstrap !== 'undefined') {
            // Usar la API de Bootstrap
            const scannerModal = new bootstrap.Modal(scannerModalEl);
            scannerModal.show();
            
            // Iniciar el escáner una vez que el modal esté visible
            scannerModalEl.addEventListener('shown.bs.modal', function() {
                iniciarHtml5QrScanner();
            });
            
            // Detener el escáner cuando se cierre el modal
            scannerModalEl.addEventListener('hidden.bs.modal', function() {
                detenerEscaner();
            });
        } else {
            // Fallback para cuando Bootstrap JS no está disponible
            scannerModalEl.style.display = 'block';
            scannerModalEl.classList.add('show');
            document.body.classList.add('modal-open');
            
            // Crear un backdrop manualmente
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
            
            // Iniciar el escáner inmediatamente
            setTimeout(iniciarHtml5QrScanner, 500);
            
            // Manejar el cierre del modal
            const closeButtons = scannerModalEl.querySelectorAll('[data-bs-dismiss="modal"]');
            closeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    cerrarModalManualmente(scannerModalEl, backdrop);
                });
            });
        }
    });
    
    // Función para cerrar el modal manualmente si Bootstrap JS no está disponible
    function cerrarModalManualmente(modal, backdrop) {
        detenerEscaner();
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        if (backdrop && backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
        }
    }
    
    // Nueva función para iniciar el escáner usando Html5-QRCode
    function iniciarHtml5QrScanner() {
        const scanningStatus = document.getElementById('scanning-status');
        scanningStatus.textContent = "Iniciando cámara...";
        scanningStatus.className = "fw-medium text-primary";
        
        // El contenedor del escáner
        const readerDiv = document.getElementById('reader');
        
        // Configuración optimizada para smartphones
        const config = {
            fps: 10,                       // Menor frames para mejor procesamiento
            qrbox: { width: 250, height: 150 }, // Área de escaneo para códigos de barras
            rememberLastUsedCamera: true,  // Recordar última cámara
            aspectRatio: 1.0,              // Relación de aspecto cuadrada (mejor para códigos de barras)
            showTorchButtonIfSupported: true, // Mostrar botón de linterna si está disponible
            formatsToSupport: [            // Formatos de códigos de barras a soportar
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
                Html5QrcodeSupportedFormats.CODABAR
            ]
        };
        
        // Crear instancia del escáner
        html5QrScanner = new Html5Qrcode("reader");
        
        // Función para manejar un escaneo exitoso
        const onScanSuccess = (decodedText, decodedResult) => {
            // Validación básica del código
            if (!decodedText || decodedText.length < 4) {
                console.log("Código inválido detectado:", decodedText);
                return; // Ignorar códigos muy cortos
            }
            
            console.log(`Código detectado: ${decodedText} (formato: ${decodedResult.result.format ? decodedResult.result.format.formatName : 'desconocido'})`);
            
            // Reproducir un sonido de éxito (opcional)
            try {
                const beepSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...');
                beepSound.play().catch(e => console.log("No se pudo reproducir el sonido", e));
            } catch (e) {
                console.log("Error al reproducir sonido:", e);
            }
            
            // Mostrar el código detectado
            scanningStatus.textContent = `Código detectado: ${decodedText}`;
            scanningStatus.className = "fw-medium text-success";
            
            // Detener el escáner
            detenerEscaner();
            
            // Cerrar el modal después de un breve retraso
            setTimeout(function() {
                if (typeof bootstrap !== 'undefined') {
                    const scannerModal = bootstrap.Modal.getInstance(document.getElementById('scannerModal'));
                    if (scannerModal) {
                        scannerModal.hide();
                    }
                } else {
                    const modal = document.getElementById('scannerModal');
                    const backdrop = document.querySelector('.modal-backdrop');
                    cerrarModalManualmente(modal, backdrop);
                }
                
                // Llenar el campo de búsqueda con el código escaneado
                searchQuery.value = decodedText;
                
                // Asegurarse de que estamos en modo búsqueda por código
                if (busquedaPorDescripcion) {
                    tabCodigo.click();
                }
                
                // Ejecutar la búsqueda automáticamente
                buscarProductos(decodedText, 'codigo');
                
            }, 1000);
        };
        
        // Función para manejar errores
        const onScanFailure = (error) => {
            // Solo para errores reales, no para escaneos fallidos normales
            if (error !== "No QR code found.") {
                console.warn(`Error al escanear: ${error}`);
            }
        };
        
        // Iniciar la cámara en modo escaner
        html5QrScanner.start(
            { facingMode: "environment" }, // Preferir cámara trasera
            config,
            onScanSuccess,
            onScanFailure
        ).then(() => {
            scanningStatus.textContent = "Centre el código de barras en el recuadro";
            scanningStatus.className = "fw-medium text-primary scanning-active";
        }).catch((err) => {
            scanningStatus.textContent = `Error: ${err}. Intente nuevamente o ingrese el código manualmente.`;
            scanningStatus.className = "fw-medium text-danger";
            console.error("Error al iniciar la cámara:", err);
        });
    }
    
    // Función para detener el escáner
    function detenerEscaner() {
        if (html5QrScanner && html5QrScanner.isScanning) {
            try {
                html5QrScanner.stop().catch(err => {
                    console.error("Error al detener el escáner:", err);
                });
            } catch (err) {
                console.error("Error al intentar detener el escáner:", err);
            }
        }
    }
    
    // Función para buscar productos
    function buscarProductos(query, tipo) {
        console.log('Buscando productos:', query, 'tipo:', tipo); 
        
        // Guardar la consulta actual
        ultimaBusqueda.query = query;
        ultimaBusqueda.tipo = tipo;
        
        mostrarCargando();
        
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
                    console.error('Error en la búsqueda:', error); 
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
        
        clone.querySelector('.product-name').textContent = producto.descripcion;
        clone.querySelector('.product-code').textContent = producto.codigo;
        
        // Formatear el stock con clases (bajho, medio, alto)
        const stockElement = clone.querySelector('.product-stock');
        stockElement.textContent = producto.stock;
        
        stockElement.classList.remove('stock-available', 'stock-low', 'stock-unavailable');
        
        if (producto.stock <= 0) {
            stockElement.classList.add('stock-unavailable');
            stockElement.textContent = producto.stock + ' (No disponible)';
        } else if (producto.stock < 10) {
            stockElement.classList.add('stock-low');
            stockElement.textContent = producto.stock + ' (Stock bajo)';
        } else {
            stockElement.classList.add('stock-available');
            stockElement.textContent = producto.stock + ' (Disponible)';
        }
        
        resultsContainer.classList.add('mb-5');
        
        // Agregar funcionalidad al botón de volver
        const backButton = clone.querySelector('#back-to-list');
        backButton.addEventListener('click', function() {
            resultsContainer.classList.remove('mb-5');
            
            // Si tenemos resultados previos, los mostramos
            if (ultimaBusqueda.resultados.length > 0) {
                limpiarResultados();
                mostrarListaProductos(ultimaBusqueda.resultados);
            } else {
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

        clone.querySelector('.card-body').textContent = mensaje;
        resultsContainer.appendChild(clone);
    }
    
    function mostrarCargando() {
        limpiarResultados();
        const clone = loadingTemplate.content.cloneNode(true);
        resultsContainer.appendChild(clone);
    }
    
    function limpiarResultados() {
        resultsContainer.innerHTML = '';
    }
    
    mostrarMensaje("Ingrese un código para ver resultados");
    
    // Enfoque en el input de búsqueda al cargar la página
    searchQuery.focus();
});