const map = L.map('map').setView([59.9139, 10.7522], 9);

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; OpenStreetMap'
  }
).addTo(map);

map.on("click", function(e){

  alert(
    "Klikk registrert: " +
    e.latlng.lat.toFixed(4) +
    ", " +
    e.latlng.lng.toFixed(4)
  );

});
