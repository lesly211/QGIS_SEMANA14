//ACTIVIDAD 01: Realizar 3 ubicaciones específicas con etiquetas
// 1. Instanciar el mapa y establecer la vista en Huancayo
var mapa = L.map('mapa').setView([-12.0667, -75.2049], 13);

// 2. Añadir la capa base (¡AQUÍ ESTÁ LA CORRECCIÓN! Asignamos a la variable capaOSM)
var capaOSM = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapa);

// 3. Añadir marcadores con popups
var marcadorUNCP = L.marker([-12.0435, -75.2505]).bindPopup('<b>UNCP</b><br>Facultad de Ingenieria');
var marcadorPlaza = L.marker([-12.0667, -75.2049]).bindPopup('<b>Plaza Constitución</b><br>Centro');
var marcadorParque = L.marker([-12.0725, -75.2098]).bindPopup('<b>Parque de la Identidad</b>');

// 4. Agregar los marcadores al mapa
marcadorUNCP.addTo(mapa);
marcadorPlaza.addTo(mapa);
marcadorParque.addTo(mapa);

// 5. Conexión a nuestro servidor local GeoServer (Servicio WMS)
var capaWMS = L.tileLayer.wms('http://localhost:8080/geoserver/semana12/wms', {
    layers: 'SEMANA12:Distrito_INEI_2017',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: "Datos del INEI servidos por GeoServer"
});

// 6. Agregar la capa WMS al mapa
capaWMS.addTo(mapa);

var mapasBase = {
    "Mapa(OSM)": capaOSM
};

var capasSuperpuestas = {
    "Universidad (UNCP)": marcadorUNCP,
    "Plaza Constitución": marcadorPlaza,
    "Parque Identidad": marcadorParque,
    "Capa Distritos (GeoServer)": capaWMS
};

L.control.layers(mapasBase, capasSuperpuestas).addTo(mapa);