// Coordenadas de la Puerta Principal de la UNCP
var origenCoordenadas = [-12.033046, -75.237332];
var nivelZoom = 15;

// Instanciar el mapa en el div con id "mapa", centrado en la UNCP
var mapa = L.map('mapa').setView(origenCoordenadas, nivelZoom);

// Cargar la capa base visual 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(mapa);

// Crear marcador estático de Origen (Puerta Principal UNCP)
var marcadorOrigen = L.marker(origenCoordenadas, {
    icon: L.divIcon({
        className: 'custom-origin-icon',
        html: `<div style="background-color: #0d6efd; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.6);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    })
}).addTo(mapa);
marcadorOrigen.bindPopup("<b>Origen: Puerta Principal UNCP</b>").openPopup();

// Variables para el destino, la línea de trayecto y control del simulador
var marcadorDestino = null;
var lineaTrayecto = null;
var enMovimiento = false;

// Elementos del DOM
var estadoSimulador = document.getElementById('estado-simulador');
var btnVolverOrigen = document.getElementById('btnVolverOrigen');

// 1 y 2. Registrar clic derecho en el mapa para ubicar al cliente
mapa.on('contextmenu', function (e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    // Limpiar destino y trayecto anteriores si existen
    if (marcadorDestino) {
        mapa.removeLayer(marcadorDestino);
    }
    if (lineaTrayecto) {
        mapa.removeLayer(lineaTrayecto);
    }

    // Colocar un marcador de destino diferente (color rojo)
    marcadorDestino = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'custom-destination-icon',
            html: `<div style="background-color: #dc3545; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.6);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        })
    }).addTo(mapa);
    marcadorDestino.bindPopup(`<b>Destino: Cliente</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`);

    // Dibujar línea de trayecto desde el origen hasta el destino
    lineaTrayecto = L.polyline([origenCoordenadas, [lat, lng]], {
        color: '#0d6efd',
        weight: 3,
        opacity: 0.8,
        dashArray: '8, 6'
    }).addTo(mapa);

    // Actualizar panel lateral indicando que está en movimiento
    enMovimiento = true;
    estadoSimulador.innerText = "Unidad en movimiento...";
    estadoSimulador.style.color = "#fd7e14"; // Naranja
    estadoSimulador.style.borderColor = "#fd7e14";
    estadoSimulador.style.background = "#fff3cd"; // Amarillo claro

    // 3. Vuelo animado suave hacia el destino
    mapa.flyTo([lat, lng], 16, {
        duration: 3.0 // Duración del vuelo animado en segundos
    });
});

// 4. Actualizar estado automáticamente cuando la cámara aterrice y se detenga completamente
mapa.on('moveend', function () {
    if (enMovimiento) {
        enMovimiento = false;

        // Mensaje de llegada
        estadoSimulador.innerText = "Unidad llegó a la ubicación";
        estadoSimulador.style.color = "#198754"; // Verde
        estadoSimulador.style.borderColor = "#198754";
        estadoSimulador.style.background = "#d1e7dd"; // Verde claro

        // Abrir automáticamente el popup de destino al finalizar el movimiento
        if (marcadorDestino) {
            marcadorDestino.openPopup();
        }
    }
});

// Botón para resetear y regresar al origen
btnVolverOrigen.addEventListener('click', function () {
    if (marcadorDestino) {
        mapa.removeLayer(marcadorDestino);
        marcadorDestino = null;
    }

    // Remover la línea de trayecto
    if (lineaTrayecto) {
        mapa.removeLayer(lineaTrayecto);
        lineaTrayecto = null;
    }

    // Restaurar panel
    estadoSimulador.innerText = "Esperando ubicación del cliente (Clic derecho en el mapa)...";
    estadoSimulador.style.color = "#0d6efd";
    estadoSimulador.style.borderColor = "#0d6efd";
    estadoSimulador.style.background = "#eef7ff";

    // Volar de regreso al origen
    mapa.flyTo(origenCoordenadas, nivelZoom, {
        duration: 2.0
    });

    // Abrir el popup de origen tras volver
    setTimeout(function () {
        marcadorOrigen.openPopup();
    }, 2000);
});