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
  appId: "1:831480183631:web:e725bfbb055c86e667a33a",
  measurementId: "G-XJ4H1TSMP0"
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

document.getElementById("guessBtn")
  .addEventListener("click", () => {

    const navn =
      document.getElementById("name")
      .value
      .trim();

    if (!navn) {
      alert("Skriv inn navn");
      return;
    }

    map.once("click", async (e) => {

      await addDoc(
        collection(db, "guesses"),
        {
          name: navn,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          timestamp: Date.now()
        }
      );

      alert("Tips lagret!");

    });

    alert("Klikk på kartet for å plassere Henrik.");

  });
