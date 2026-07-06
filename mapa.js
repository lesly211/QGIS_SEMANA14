// Inicializar el mapa
var mapa = L.map('mapa').setView([-12.0667, -75.2049], 13);

// Agregar mapa base
L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; openStreetMap contributors'
}).addTo(mapa);

// Agregar un marcador
var marcadorUNCP = L.marker([-12.0435, -75.2505]).bindPopup('<b>UNCP</b><br>Facultad de Ingenieria de Sistemas');
var marcadorPlaza = L.marker([-12.0667, -75.2049]).bindPopup('<b>Plaza Constitución</b><br>Centro');
var marcadorParque = L.marker([-12.0725, -75.2098]).bindPopup('<b>Parque de la Identidad</b>');

// 4. Agregar los marcadores al mapa para que sean visibles
marcadorUNCP.addTo(mapa);
marcadorPlaza.addTo(mapa);
marcadorParque.addTo(mapa);
// 5. Conexión a nuestro servidor local GeoServer (Servicio WMS)
var capaWMS = L.tileLayer.wms('http://localhost:8080/geoserver/semana12/wms', {
    layers: 'semana12:Distrito_INEI_2017', // ¡Ojo! Poner el nombre exacto de la capa a usar
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: "Datos del INEI servidos por GeoServer"
});

// 6. Agregamos la capa WMS al mapa
capaWMS.addTo(mapa);
// 7. Configurar el Control de Capas (Layers Control)

// A. Agrupamos los mapas base (Solo se puede ver uno a la vez - Radio buttons)
var mapasBase = {
    "Mapa(OSM)": capaOSM
};

// B. Agrupamos las capas superpuestas (Se pueden ver varias a la vez - Checkboxes)
var capasSuperpuestas = {
    "Universidad (UNCP)": marcadorUNCP,
    "Plaza Constitución": marcadorPlaza,
    "Parque Identidad": marcadorParque,
    "Capa Distritos (GeoServer)": capaWMS
};

// C. Inyectamos el control de capas en la esquina superior derecha del mapa
L.control.layers(mapasBase, capasSuperpuestas).addTo(mapa);