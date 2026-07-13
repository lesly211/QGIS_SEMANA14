// Centrar el mapa en Huancayo
var vistaInicial = [-12.0667, -75.2049];
var nivelZoom = 14;

var mapa = L.map('mapa').setView(vistaInicial, nivelZoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(mapa);

// ===================================================
// EJERCICIO 4: Arreglo de incidencias hardcodeadas
// ===================================================
var incidencias = [
    // 2 Baches (rojo)
    { tipo: 'Bache',      lat: -12.0600, lng: -75.2080, descripcion: 'Bache en Av. Real' },
    { tipo: 'Bache',      lat: -12.0710, lng: -75.2150, descripcion: 'Bache en Jr. Cajamarca' },
    // 2 Fugas de agua (azul)
    { tipo: 'Fuga',       lat: -12.0640, lng: -75.1980, descripcion: 'Fuga en Jr. Huancas' },
    { tipo: 'Fuga',       lat: -12.0750, lng: -75.2060, descripcion: 'Fuga en Av. Ferroviaria' },
    // 2 Luminarias averiadas (naranja)
    { tipo: 'Luminaria',  lat: -12.0580, lng: -75.2200, descripcion: 'Luminaria en Av. Circunvalación' },
    { tipo: 'Luminaria',  lat: -12.0680, lng: -75.1950, descripcion: 'Luminaria en Jr. Puno' }
];

// Colores por categoría
var colores = {
    'Bache':     '#dc3545',
    'Fuga':      '#0d6efd',
    'Luminaria': '#fd7e14'
};

// Función para crear un icono coloreado según la categoría
function crearIcono(tipo) {
    return L.divIcon({
        className: '',
        html: `<div style="background-color: ${colores[tipo]}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });
}

// Grupos de capas por categoría (para poder mostrar/ocultar de forma independiente)
var capas = {
    'Bache':     L.layerGroup(),
    'Fuga':      L.layerGroup(),
    'Luminaria': L.layerGroup()
};

// 1. Renderizar todos los marcadores al cargar la página
incidencias.forEach(function (inc) {
    var marcador = L.marker([inc.lat, inc.lng], { icon: crearIcono(inc.tipo) });
    marcador.bindPopup(`<b>${inc.tipo}</b><br>${inc.descripcion}<br><small>Lat: ${inc.lat} | Lng: ${inc.lng}</small>`);
    capas[inc.tipo].addLayer(marcador);
});

// Añadir todos los grupos al mapa (todos visibles por defecto)
capas['Bache'].addTo(mapa);
capas['Fuga'].addTo(mapa);
capas['Luminaria'].addTo(mapa);

// ===================================================
// 2 y 3. Control dinámico de checkboxes
// ===================================================
var totalDOM = document.getElementById('total-visibles');

function actualizarContador() {
    var visibles = 0;
    if (document.getElementById('chk-baches').checked)     visibles += 2;
    if (document.getElementById('chk-fugas').checked)      visibles += 2;
    if (document.getElementById('chk-luminarias').checked) visibles += 2;
    totalDOM.innerText = visibles + ' / 6';
}

document.getElementById('chk-baches').addEventListener('change', function () {
    if (this.checked) {
        capas['Bache'].addTo(mapa);
    } else {
        mapa.removeLayer(capas['Bache']);
    }
    actualizarContador();
});

document.getElementById('chk-fugas').addEventListener('change', function () {
    if (this.checked) {
        capas['Fuga'].addTo(mapa);
    } else {
        mapa.removeLayer(capas['Fuga']);
    }
    actualizarContador();
});

document.getElementById('chk-luminarias').addEventListener('change', function () {
    if (this.checked) {
        capas['Luminaria'].addTo(mapa);
    } else {
        mapa.removeLayer(capas['Luminaria']);
    }
    actualizarContador();
});