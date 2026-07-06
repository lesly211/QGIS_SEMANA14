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