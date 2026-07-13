//ACTIVIDAD 02: ADJUNTAR Y MOSTRAR LOS ESTABLECIMIENTOS DE COLEGIO, FARMACIA Y HOSPITAL DE JUNIN
var mapa = L.map('mapa').setView([-12.0667, -75.2049], 13);

//Capa base OSM
var capaOSM = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapa);

function onEachFeaturePopup(feature, layer) {
    var popupContent = feature.properties && feature.properties.name ?
        "<b>Establecimiento:</b> " + feature.properties.name :
        "Sin nombre especificado";
    layer.bindPopup(popupContent);
}

var capaColegios = L.geoJSON(null, { onEachFeature: onEachFeaturePopup });
var capaFarmacia = L.geoJSON(null, { onEachFeature: onEachFeaturePopup });
var capaHospital = L.geoJSON(null, { onEachFeature: onEachFeaturePopup });

fetch('COLEGIOS.geojson')
    .then(response => response.json())
    .then(data => capaColegios.addData(data))
    .catch(error => console.error("Error en Colegios:", error));

fetch('FARMACIA.geojson')
    .then(response => response.json())
    .then(data => capaFarmacia.addData(data))
    .catch(error => console.error("Error en Farmacia:", error));

fetch('HOSPITAL.geojson')
    .then(response => response.json())
    .then(data => capaHospital.addData(data))
    .catch(error => console.error("Error en Hospital:", error));

var mapasBase = {
    "Mapa Base (OSM)": capaOSM
};

// Agrupar las capas superpuestas
var capasSuperpuestas = {
    "Colegios (GeoJSON)": capaColegios,
    "Farmacias (GeoJSON)": capaFarmacia,
    "Hospitales (GeoJSON)": capaHospital
};

L.control.layers(mapasBase, capasSuperpuestas).addTo(mapa);