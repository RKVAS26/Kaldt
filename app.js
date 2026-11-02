import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJsLipDhY7A0EeGbLI8QjppDIGZqOOb3k",
  authDomain: "hv-henrik.firebaseapp.com",
  projectId: "hv-henrik",
  storageBucket: "hv-henrik.firebasestorage.app",
  messagingSenderId: "831480183631",
  appId: "1:831480183631:web:e725bfbb055c86e667a33a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const map = L.map('map').setView([59.9139, 10.7522], 9);

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; OpenStreetMap'
  }
).addTo(map);

let activeName = null;

document
  .getElementById("guessBtn")
  .addEventListener("click", () => {

    const name =
      document.getElementById("name")
      .value
      .trim();

    if (!name) {
      alert("Skriv inn navn først");
      return;
    }

    activeName = name;

    alert("Klikk på kartet for å plassere Henrik.");
  });

map.on("click", async (e) => {

  if (!activeName) {
    return;
  }

  L.marker(
    [e.latlng.lat, e.latlng.lng]
  ).addTo(map);

  try {

    await addDoc(
      collection(db, "guesses"),
      {
        name: activeName,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        created: Date.now()
      }
    );

    alert(
      activeName +
      " sitt tips er lagret."
    );

  } catch (err) {

    console.error(err);

    alert(
      "Feil ved lagring til Firestore."
    );

  }

  activeName = null;

});
