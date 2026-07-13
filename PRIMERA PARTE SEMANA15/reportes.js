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

// Pasos 2 y 3: Capturar el clic del usuario y agregar un marcador
mapa.on('click', function(e) {
    // 1. Extraer la latitud y longitud exacta de donde se hizo clic
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    
    // 2. Obtener la hora actual del sistema
    var hora = new Date().toLocaleTimeString();
    
    // 3. el mensaje 
    var msg = 'Incidencia: ' + lat.toFixed(4) + ', ' + lng.toFixed(4) + ' (' + hora + ')';
    
    // 4. Crear el marcador, pegarlo al mapa, añadirle el texto y abrirlo
    L.marker([lat, lng]).addTo(mapa).bindPopup(msg).openPopup();
});

// Capturamos los elementos del panel lateral que creamos en el HTML
var panelInfo = document.getElementById('info-vista');
var btnInicio = document.getElementById('btnInicio');

// Paso 4: Actualizar panel en cada movimiento/zoom
mapa.on('moveend zoomend', function() {
    var centro = mapa.getCenter();
    var zoomActual = mapa.getZoom();
    
    // Escribimos en el panel lateral del HTML
    panelInfo.innerText = 'Centro:\nLat: ' + centro.lat.toFixed(4) + '\nLng: ' + centro.lng.toFixed(4) + '\n\nZoom: ' + zoomActual;
});

// Paso 5: Botón "volver al inicio" usando flyTo()
btnInicio.addEventListener('click', function() {
    mapa.flyTo(vistaInicial, 14, {
        duration: 1.5 // Duración del vuelo en segundos
    });
});