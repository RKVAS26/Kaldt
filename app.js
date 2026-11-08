import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc
}

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

const soldierIcon = L.divIcon({
  html: '<div style="font-size:30px;">🪖</div>',
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

let activeName = null;
let answerMode = false;

async function loadGuesses() {

  const snapshot =
    await getDocs(
      collection(db, "guesses")
    );

  snapshot.forEach(doc => {

    const g = doc.data();

    if (
      g.lat === undefined ||
      g.lng === undefined
    ) {
      return;
    }

    L.marker(
      [g.lat, g.lng],
      {
        icon: soldierIcon
      }
    )
    .addTo(map)
    .bindPopup(g.name);

  });

}

loadGuesses();

document
  .getElementById("guessBtn")
  .addEventListener("click", () => {

    const name =
      document
      .getElementById("name")
      .value
      .trim();

    if (!name) {

      alert("Skriv inn navn først.");

      return;
    }

    activeName = name;

    alert(
      "Klikk på kartet der du tror Henrik skal tjenestegjøre."
    );

  });

map.on("click", async (e) => {
  if (answerMode) {

    await setDoc(
      doc(db, "settings", "answer"),
      {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      }
    );

    L.marker(
      [e.latlng.lat, e.latlng.lng]
    )
    .addTo(map)
    .bindPopup("⭐ Fasit");

    alert("Fasit lagret.");

    answerMode = false;

    return;
  }
  if (!activeName) {
    return;
  }

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

    L.marker(
      [e.latlng.lat, e.latlng.lng],
      {
        icon: soldierIcon
      }
    )
    .addTo(map)
    .bindPopup(activeName);

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
document
  .getElementById("adminBtn")
  .addEventListener("click", () => {

    const pass = prompt("Admin-passord");

    if (pass !== "Henrik2026") {

      alert("Feil passord");

      return;
    }

    document.getElementById("answerBtn").style.display =
      "inline-block";

    document.getElementById("winnerBtn").style.display =
      "inline-block";

    alert("Adminmodus aktivert");

  });

document
  .getElementById("adminBtn")
  .addEventListener("click", () => {

    const pass = prompt("Admin-passord");

    if (pass !== "Henrik2026") {

      alert("Feil passord");

      return;
    }

    document.getElementById("answerBtn").style.display =
      "inline-block";

    document.getElementById("winnerBtn").style.display =
      "inline-block";

    alert("Adminmodus aktivert");

  });

document
  .getElementById("answerBtn")
  .addEventListener("click", () => {

    answerMode = true;

    alert(
      "Klikk på kartet der Henrik faktisk tjenestegjorde."
    );

  });
