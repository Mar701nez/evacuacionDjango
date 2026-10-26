const URL_API_SISMOS = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
// 🌍 Consulta de sismos recientes desde la API del USGS
document.addEventListener('DOMContentLoaded', () => {
    const contenedorSismos = document.getElementById('lista-sismos');
    
    if (!contenedorSismos) return;

    fetch(URL_API_SISMOS)
        .then(response => response.json())
        .then(data => {
            const sismos = data.features.slice(0, 5); // Tomamos los 5 sismos más recientes 🌋
            contenedorSismos.innerHTML = '';

            sismos.forEach(sismo => {
                const mag = sismo.properties.mag;
                const lugar = sismo.properties.place;
                const hora = new Date(sismo.properties.time).toLocaleTimeString();

                const item = document.createElement('div');
                item.className = 'sismo-item';
                item.innerHTML = `
                    <p><strong>🌍 ${lugar}</strong></p>
                    <p>💥 Magnitud: <span>${mag}</span> | ⏰ Hora: ${hora}</p>
                `;
                contenedorSismos.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error al cargar sismos:', error);
            contenedorSismos.innerHTML = '<p>⚠️ No se pudieron cargar los datos de sismos.</p>';
        });
});