// Inicializar el mapa
var mapa = L.map('mapa').setView([-12.0667, -75.2049], 13);

// Agregar mapa base
L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; openStreetMap contributors'
}).addTo(mapa);

// Agregar un marcador
var marker = L.marker([-12.0435, -75.2505]).bindPopup("<b>UNCP</b><br>Facultad de Ingeniería de Sistemas").openPopup();

// Agregar un círculo
var circle = L.circle([-9.83930939259366, -75.99315976807257], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mapa);

// Agregar un polígono
var polygon = L.polygon([
    [-9.83930939259366, -75.99315976807257],
    [-9.83930939259366, -75.99315976807257],
    [-9.83930939259366, -75.99315976807257]
]).addTo(mapa);