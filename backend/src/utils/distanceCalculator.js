
/**
 * 
 * @param {Number} lat1 
 * @param {Number} lon1 
 * @param {Number} lat2 
 * @param {Number} lon2 
 * @returns {Number} Distancia en kilómetros
 */
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const rad = Math.PI / 180; // Conversión de grados a radianes

    lat1 = Number(lat1)
    lon1 = Number(lon1)
    lat2 = Number(lat2)
    lon2 = Number(lon2)
    // Convertir las coordenadas a radianes
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en kilómetros
}

module.exports = calcularDistancia;