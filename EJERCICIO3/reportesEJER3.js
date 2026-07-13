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

// Variables para el Ejercicio 2: Delimitación de Zonas de Riesgo
var puntosZona = [];
var marcadoresZona = [];
var poligonoZona = null;

// Elementos del DOM
var contadorPuntosZona = document.getElementById('contador-puntos-zona');
var infoCentroZona = document.getElementById('info-centro-zona');
var coordenadasCentro = document.getElementById('coordenadas-centro');
var btnReiniciarZona = document.getElementById('btnReiniciarZona');

// Evento: Registrar exactamente 3 clics en el mapa
mapa.on('click', function (e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    // Si ya tenemos 3 puntos, lanzar alerta con las coordenadas centrales y no agregar más
    if (puntosZona.length >= 3) {
        var latCentro = (puntosZona[0][0] + puntosZona[1][0] + puntosZona[2][0]) / 3;
        var lngCentro = (puntosZona[0][1] + puntosZona[1][1] + puntosZona[2][1]) / 3;
        
        alert("¡Delimitación bloqueada! El polígono ya fue creado.\nCoordenadas centrales exactas:\nLatitud: " + latCentro.toFixed(6) + "\nLongitud: " + lngCentro.toFixed(6));
        return;
    }

    // Agregar punto a la lista
    puntosZona.push([lat, lng]);

    // Dibujar un marcador temporal en el vértice (punto de clic)
    var marker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'custom-vertex-icon',
            html: `<div style="background-color: #dc3545; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        })
    }).addTo(mapa);
    
    // Popup para mostrar coordenadas individuales del vértice
    marker.bindPopup(`<b>Vértice ${puntosZona.length}</b><br>Lat: ${lat.toFixed(4)}<br>Lng: ${lng.toFixed(4)}`).openPopup();
    marcadoresZona.push(marker);

    // Actualizar el contador de puntos en el DOM
    contadorPuntosZona.innerText = puntosZona.length + " / 3";

    // Al registrarse el tercer clic
    if (puntosZona.length === 3) {
        // 1. Dibujar automáticamente un polígono cerrado (triángulo)
        poligonoZona = L.polygon(puntosZona, {
            color: '#dc3545',       // Borde rojo
            fillColor: '#ea4335',   // Relleno rojo claro
            fillOpacity: 0.4,       // Opacidad de relleno
            weight: 3               // Grosor del borde
        }).addTo(mapa);

        // 2. Encuadrar automáticamente la vista del mapa para que el polígono ocupe el centro
        mapa.fitBounds(poligonoZona.getBounds(), { padding: [50, 50] });

        // Calcular el centro exacto (centroide)
        var latCentro = (puntosZona[0][0] + puntosZona[1][0] + puntosZona[2][0]) / 3;
        var lngCentro = (puntosZona[0][1] + puntosZona[1][1] + puntosZona[2][1]) / 3;

        // Mostrar información del centro en el panel lateral
        coordenadasCentro.innerHTML = `Lat: ${latCentro.toFixed(6)}<br>Lng: ${lngCentro.toFixed(6)}`;
        infoCentroZona.style.display = 'block';
        
        // Agregar popup al centro del polígono
        poligonoZona.bindPopup(`<b>Zona de Riesgo Delimitada</b><br>Centroide:<br>Lat: ${latCentro.toFixed(6)}<br>Lng: ${lngCentro.toFixed(6)}`).openPopup(poligonoZona.getBounds().getCenter());
    }
});

// Botón para reiniciar y poder trazar otro triángulo
btnReiniciarZona.addEventListener('click', function () {
    // Remover marcadores de los vértices
    marcadoresZona.forEach(function (m) {
        mapa.removeLayer(m);
    });
    marcadoresZona = [];
    puntosZona = [];
    
    // Remover polígono
    if (poligonoZona) {
        mapa.removeLayer(poligonoZona);
        poligonoZona = null;
    }
    
    // Resetear elementos del DOM
    contadorPuntosZona.innerText = "0 / 3";
    infoCentroZona.style.display = 'none';
    mapa.flyTo(vistaInicial, nivelZoom);
});