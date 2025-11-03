// Initialize map
const map = L.map('map', { zoomControl: false }).setView([20, 0], 2);

// Dark tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '',
  maxZoom: 5
}).addTo(map);

// Marker data
const nodes = [
  { type: 'storage', name: 'Singapore', coords: [1.3521, 103.8198] },
  { type: 'server', name: 'China', coords: [35.8617, 104.1954] },
  { type: 'storage', name: 'Indonesia', coords: [-6.2, 106.8167] },
  { type: 'server', name: 'Japan', coords: [35.6762, 139.6503] },
  { type: 'server', name: 'Germany', coords: [51.1657, 10.4515] },
  { type: 'storage', name: 'UK', coords: [55.3781, -3.436] },
  { type: 'server', name: 'Poland', coords: [51.9194, 19.1451] },
  { type: 'server', name: 'USA (East)', coords: [37.0902, -95.7129] },
  { type: 'storage', name: 'USA (West)', coords: [36.7783, -119.4179] },
  { type: 'server', name: 'Mexico', coords: [23.6345, -102.5528] },
  { type: 'server', name: 'Brazil', coords: [-14.235, -51.9253] },
  { type: 'storage', name: 'Chile', coords: [-35.6751, -71.543] },
  { type: 'server', name: 'Australia', coords: [-25.2744, 133.7751] },
  { type: 'storage', name: 'New Zealand', coords: [-40.9006, 174.886] }
];

// Create markers
nodes.forEach(node => {
  const color = node.type === 'server' ? '#00bfff' : '#00ff85';
  const markerIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};
      width:12px;height:12px;border-radius:50%;
      box-shadow:0 0 12px ${color},0 0 25px ${color}55;"></div>`
  });

  const marker = L.marker(node.coords, { icon: markerIcon }).addTo(map);

  // Popup will show later when geolocation is known
  marker.bindPopup(`<b>${node.name}</b><br>Calculating latency...`);

  // On click, calculate distance & latency
  marker.on('click', async () => {
    if (!navigator.geolocation) {
      marker.setPopupContent(`<b>${node.name}</b><br>Latency: N/A`);
      return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
      const user = [pos.coords.latitude, pos.coords.longitude];
      const distance = haversine(user, node.coords);
      const latency = Math.round(distance / 200); // rough estimate
      marker.setPopupContent(`<b>${node.name}</b><br>Approx. Latency: ${latency} ms`);
    });
  });
});

// Haversine distance in km
function haversine(coord1, coord2) {
  const R = 6371;
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
