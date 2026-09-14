let map;
let lineaRuta = null;
let marcadorOrigen = null;

// Coordenadas SENA Centro de Comercio y Servicios (Popayán) 📍
const latSENA = 2.4419;
const lngSENA = -76.6063;

document.addEventListener('DOMContentLoaded', () => {
    const mapDiv = document.getElementById('mapa-interactivo');
    if (!mapDiv) return;

    // Inicializar Mapa
    map = L.map('mapa-interactivo').setView([latSENA, lngSENA], 16);

    // Servidor seguro de OpenStreetMap (Sin bloqueos) 🌐
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap SENA Evacuación'
    }).addTo(map);

    // Marcador Punto de Encuentro Principal SENA 🟢
    L.marker([latSENA, lngSENA]).addTo(map)
        .bindPopup('<b>📍 SENA Centro de Comercio y Servicios</b><br>Punto de Encuentro Evacuación Piso 1')
        .openPopup();

    // 🎯 Trazar ruta al hacer clic en cualquier lugar del mapa
    map.on('click', function(e) {
        const userLat = e.latlng.lat;
        const userLng = e.latlng.lng;
        colocarRutaPersonalizada(userLat, userLng, "Ubicación Seleccionada");
    });

    // Forzar redimensionado del mapa para evitar cuadros grises
    setTimeout(() => { map.invalidateSize(); }, 500);
});

// Función para trazar ruta azul interactiva
function colocarRutaPersonalizada(lat, lng, nombre) {
    if (marcadorOrigen) map.removeLayer(marcadorOrigen);
    if (lineaRuta) map.removeLayer(lineaRuta);

    // Marcador de origen
    marcadorOrigen = L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>🚩 Origen: ${nombre}</b>`)
        .openPopup();

    // Trazado de ruta curvada inteligente
    const coordsRuta = [
        [lat, lng],
        [(lat + latSENA)/2 + 0.0008, (lng + lngSENA)/2],
        [latSENA, lngSENA]
    ];

    lineaRuta = L.polyline(coordsRuta, {
        color: '#2563eb', // Azul Google Maps
        weight: 6,
        opacity: 0.9
    }).addTo(map);

    map.fitBounds(lineaRuta.getBounds(), { padding: [30, 30] });

    // Actualizar input de la interfaz
    const input = document.getElementById('origen-input');
    if (input) input.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

// Búsqueda por palabra clave en Popayán
function trazarRutaManual() {
    const query = document.getElementById('origen-input').value;
    if (!query) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Popayan')}`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                colocarRutaPersonalizada(lat, lon, query);
            } else {
                alert("No se encontró la ubicación en Popayán.");
            }
        });
}

function seleccionarRuta(index) {
    // Coordenadas simuladas para rutas alternativas
    const alternativas = [
        { lat: 2.4480, lng: -76.6020, nombre: "Ruta 1 (Por Cra. 9)" },
        { lat: 2.4380, lng: -76.6120, nombre: "Ruta 2 (Por Cra. 6)" },
        { lat: 2.4510, lng: -76.5980, nombre: "Ruta 3 (Por Variante Norte)" }
    ];
    
    const punto = alternativas[index] || alternativas[0];
    colocarRutaPersonalizada(punto.lat, punto.lng, punto.nombre);
}