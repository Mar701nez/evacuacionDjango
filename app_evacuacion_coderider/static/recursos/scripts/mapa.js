let map;
let controlRuta = null; // 🚗 Esta variable manejará toda la ruta inteligente por las calles

// Coordenadas SENA Centro de Comercio y Servicios (Popayán) 📍
const latSENA = 2.4419;
const lngSENA = -76.6063;

document.addEventListener('DOMContentLoaded', () => {
    const mapDiv = document.getElementById('mapa-interactivo');
    if (!mapDiv) return;

    // Inicializar Mapa 🗺️
    map = L.map('mapa-interactivo').setView([latSENA, lngSENA], 15);

    // Servidor de OpenStreetMap 🌐
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map); // Asegúrate de usar el nombre exacto de tu variable de mapa (ej. mapa o map)

    // 🎯 Trazar ruta por las calles al hacer clic en el mapa
    map.on('click', function(e) {
        const userLat = e.latlng.lat;
        const userLng = e.latlng.lng;
        colocarRutaPersonalizada(userLat, userLng, "Ubicación Seleccionada");
    });

    // Forzar redimensionado del mapa para evitar errores gráficos 📐
    setTimeout(() => { map.invalidateSize(); }, 500);
});

// Función principal para trazar la ruta inteligente 🛣️
function colocarRutaPersonalizada(lat, lng, nombre) {
    // Borramos la ruta anterior si existe para no amontonarlas 🧹
    if (controlRuta) {
        map.removeControl(controlRuta);
    }

    // Creamos la nueva ruta con Leaflet Routing Machine 🚗
    controlRuta = L.Routing.control({
        waypoints: [
            L.latLng(lat, lng), // Punto A: Donde haces clic
            L.latLng(latSENA, lngSENA) // Punto B: SENA
        ],
        routeWhileDragging: true, // 🖱️ Permite mover los pines arrastrándolos
        language: 'es', // 🇪🇸 Textos en español
        showAlternatives: true, // 🔀 Muestra varias opciones de ruta
        fitSelectedRoutes: true, // 📏 Ajusta la cámara para ver toda la ruta
        lineOptions: {
            styles: [{color: '#2563eb', weight: 6, opacity: 0.9}] // Tu azul de diseño
        }
    }).addTo(map);

    // Actualizar el texto en tu pantalla 📝
    const input = document.getElementById('origen-input');
    if (input) input.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

// Búsqueda por palabra clave en Popayán 🔍
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
                alert("No se encontró la ubicación en Popayán. 😅");
            }
        });
}

// Conexión con tus botones laterales de "Opciones de Ruta" 🔘
function seleccionarRuta(index) {
    const alternativas = [
        { lat: 2.4480, lng: -76.6020, nombre: "Ruta 1 (Por Cra. 9)" },
        { lat: 2.4380, lng: -76.6120, nombre: "Ruta 2 (Por Cra. 6)" },
        { lat: 2.4510, lng: -76.5980, nombre: "Ruta 3 (Por Variante Norte)" }
    ];
    
    const punto = alternativas[index] || alternativas[0];
    colocarRutaPersonalizada(punto.lat, punto.lng, punto.nombre);
}