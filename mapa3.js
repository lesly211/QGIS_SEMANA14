//ACTIVIDAD 04: Realizar un popup de las coordenadas al hacer click
var mapa = L.map('mapa').setView([-12.0667, -75.2049], 13);

//Capa base OSM
var capaOSM = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapa);


//Capa  jUNIN

var capaJunin = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
    layers: 'evaluacion_sistemas:Departamentos',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    CQL_FILTER: "DEPARTAMEN = 'JUNIN'"
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

var marcadorDinamico = null;

mapa.on('click', function(e) {
    var lat = e.latlng.lat;
    var lon = e.latlng.lng;

    if (marcadorDinamico !== null) {
        mapa.removeLayer(marcadorDinamico);
    }

    marcadorDinamico = L.marker([lat, lon])
        .bindPopup("<b>Coordenadas:</b><br>Lat: " + lat.toFixed(4) + "<br>Lon: " + lon.toFixed(4))
        .addTo(mapa)
        .openPopup();
});
var mapasBase = {
    "Mapa Base (OSM)": capaOSM
};

// Agrupar las capas superpuestas
var capasSuperpuestas = {
    "Límite Departamental (Junín)": capaJunin,
    "Colegios (GeoJSON)": capaColegios,
    "Farmacias (GeoJSON)": capaFarmacia,
    "Hospitales (GeoJSON)": capaHospital
};

L.control.layers(mapasBase, capasSuperpuestas).addTo(mapa);