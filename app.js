const map = L.map('map').setView([59.9139, 10.7522], 9);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }
).addTo(map);

setTimeout(() => {
    map.invalidateSize();
}, 500);

document
    .getElementById("guessBtn")
    .addEventListener("click", () => {

        document.getElementById("status").innerText =
            "Kartet fungerer! 🪖";

    });
