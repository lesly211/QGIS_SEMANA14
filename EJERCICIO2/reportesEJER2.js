// Coordenadas de Huancayo según el escenario
var vistaInicial = [-12.0667, -75.2049];
var nivelZoom = 14;

// Instanciar el mapa en el div con id "mapa"
var mapa = L.map('mapa').setView(vistaInicial, nivelZoom);

// Cargar la capa base visual 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(mapa);

// Capturamos el selector del HTML (fuera del evento)
var selectorTipo = document.getElementById('tipoIncidencia');
// RETO 2: Variable global para contar y capturar el HTML
var contadorDOM = document.getElementById('contador');
var totalReportes = 0;
// RETO 3: Agrupador de marcadores y capturar el botón
var grupoMarcadores = L.featureGroup().addTo(mapa);
var btnEncuadrar = document.getElementById('btnEncuadrar');

// NUEVA CAPTURA: Contenedores para el listado de reportes
var listaDOM = document.getElementById('listaReportes');
var listaDeReportes = [];

// Función para actualizar la interfaz del listado de reportes
function actualizarListaUI() {
    listaDOM.innerHTML = '';
    if (listaDeReportes.length === 0) {
        listaDOM.innerHTML = '<li style="color: #666; font-style: italic; font-size: 13px; text-align: center; padding: 10px 0;">No hay reportes registrados.</li>';
        return;
    }

    listaDeReportes.forEach(function (reporte, index) {
        var li = document.createElement('li');
        li.style.background = '#f8f9fa';
        li.style.border = '1px solid #ddd';
        li.style.borderRadius = '4px';
        li.style.padding = '8px';
        li.style.marginBottom = '6px';
        li.style.cursor = 'pointer';
        li.style.fontSize = '12px';
        li.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        li.style.transition = 'background 0.2s';

        li.onmouseover = function () { li.style.background = '#e9ecef'; };
        li.onmouseout = function () { li.style.background = '#f8f9fa'; };

        var colorLabel = 'red';
        if (reporte.tipo === 'Fuga') colorLabel = 'blue';
        if (reporte.tipo === 'Luminaria') colorLabel = 'orange';

        li.innerHTML = `
            <strong style="color: ${colorLabel}">${index + 1}. ${reporte.tipo}</strong>
            <span style="color: #666; font-size: 10px; float: right;">${reporte.hora}</span><br>
            <span style="font-family: monospace; color: #555;">Lat: ${reporte.lat.toFixed(4)}, Lng: ${reporte.lng.toFixed(4)}</span>
        `;

        // Al hacer clic en el elemento, centramos el mapa y abrimos su popup
        li.addEventListener('click', function () {
            mapa.setView([reporte.lat, reporte.lng], 16);
            reporte.marcador.openPopup();
        });

        listaDOM.appendChild(li);
    });
}

// Evento: Registrar incidencia al hacer clic
mapa.on('click', function (e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    var hora = new Date().toLocaleTimeString();

    // RETO 1: Capturar la categoría seleccionada
    var tipoSeleccionado = selectorTipo.value;

    // RETO 1: Definir el color según la categoría
    var colorBurbuja = 'red'; // Color por defecto (Bache)
    if (tipoSeleccionado === 'Fuga') colorBurbuja = 'blue';
    if (tipoSeleccionado === 'Luminaria') colorBurbuja = 'orange';

    // RETO 1 y EJERCICIO 4: Usamos L.marker con divIcon para personalizar el color y permitir el arrastre (draggable: true)
    var iconoIncidencia = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${colorBurbuja}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });

    var marcador = L.marker([lat, lng], {
        icon: iconoIncidencia,
        draggable: true // Habilita el arrastre para reubicar la incidencia
    });

    // Objeto para representar el reporte en nuestro arreglo
    var nuevoReporte = {
        tipo: tipoSeleccionado,
        lat: lat,
        lng: lng,
        hora: hora,
        marcador: marcador
    };
    listaDeReportes.push(nuevoReporte);

    // Armamos el mensaje incluyendo el tipo de incidencia
    var msg = `<b>${tipoSeleccionado}</b><br>Lat: ${lat.toFixed(4)}<br>Lng: ${lng.toFixed(4)}<br>Hora: ${hora}`;

    // Añadimos el marcador al grupo y abrimos el popup
    marcador.addTo(grupoMarcadores).bindPopup(msg).openPopup();

    // EJERCICIO 4: Capturar el evento 'dragend' para actualizar la incidencia al arrastrar
    marcador.on('dragend', function (event) {
        var markerActualizado = event.target;
        var nuevaPos = markerActualizado.getLatLng();
        var nuevaHora = new Date().toLocaleTimeString();

        // Actualizamos los datos del objeto en el arreglo
        nuevoReporte.lat = nuevaPos.lat;
        nuevoReporte.lng = nuevaPos.lng;

        // Actualizamos el listado visual
        actualizarListaUI();

        // Actualizamos el contenido del popup con la nueva ubicación
        var nuevoMsg = `<b>${tipoSeleccionado} (Reubicado)</b><br>Lat: ${nuevaPos.lat.toFixed(4)}<br>Lng: ${nuevaPos.lng.toFixed(4)}<br>Hora cambio: ${nuevaHora}`;
        markerActualizado.setPopupContent(nuevoMsg);
        markerActualizado.openPopup();
    });

    // Actualizamos el listado en el HTML
    actualizarListaUI();

    // RETO 2: Contar y actualizar el HTML
    totalReportes++;
    contadorDOM.innerText = totalReportes;
});

// Capturamos los elementos del panel lateral que creamos en el HTML
var panelInfo = document.getElementById('info-vista');
var btnInicio = document.getElementById('btnInicio');

// Paso 4: Actualizar panel en cada movimiento/zoom
mapa.on('moveend zoomend', function () {
    var centro = mapa.getCenter();
    var zoomActual = mapa.getZoom();

    // Escribimos en el panel lateral del HTML
    panelInfo.innerText = 'Centro:\nLat: ' + centro.lat.toFixed(4) + '\nLng: ' + centro.lng.toFixed(4) + '\n\nZoom: ' + zoomActual;
});

// Paso 5: Botón "volver al inicio" usando flyTo()
btnInicio.addEventListener('click', function () {
    mapa.flyTo(vistaInicial, 14, {
        duration: 1.5 // Duración del vuelo en segundos
    });
});

// RETO 3: Función para encuadrar automáticamente la vista
btnEncuadrar.addEventListener('click', function () {
    // Validamos que haya al menos un punto dibujado
    if (grupoMarcadores.getLayers().length > 0) {
        // getBounds() calcula el rectángulo que abarca todos los puntos
        mapa.fitBounds(grupoMarcadores.getBounds(), { padding: [40, 40] });
    } else {
        alert("Primero debes registrar una incidencia en el mapa.");
    }
});