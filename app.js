const map = L.map('map').setView([59.9139, 10.7522], 9);

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; OpenStreetMap'
  }
).addTo(map);

const soldierIcon = L.divIcon({
  html: '<div style="font-size:30px;">🪖</div>',
  className: '',
  iconSize: [30,30],
  iconAnchor: [15,15]
});

map.on("click", function(e){

  L.marker(
    [e.latlng.lat, e.latlng.lng],
    {
      icon: soldierIcon
    }
  ).addTo(map);

});

   