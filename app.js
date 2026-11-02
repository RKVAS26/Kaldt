import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
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

const soldierIcon = L.divIcon({
  html: '<div style="font-size:30px;">🪖</div>',
  className: '',
  iconSize: [30,30],
  iconAnchor: [15,15]
});

let activeName = null;

/* LAST INN ALLE EKSISTERENDE TIPS */

async function loadGuesses() {

  const snapshot =
    await getDocs(
      collection(db, "guesses")
    );

snapshot.forEach(doc => {

  const g = doc.data();

  console.log(g);

  if (
    g.lat === undefined ||
    g.lng === undefined
  ) {
    console.log("Ugyldig dokument:", g);
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
      {
        icon: soldierIcon
      }
    )
    .addTo(map)
    .bindPopup(g.name);

  });

}

loadGuesses();

/* NYTT TIPS */

document
  .getElementById("guessBtn")
  .addEventListener("click", () => {

    const name =
      document
      .getElementById("name")
      .value
      .trim();

    if (!name) {

      alert(
        "Skriv inn navn først."
      );

      return;
    }

    activeName = name;

    alert(
      "Klikk på kartet der du tror Henrik skal tjenestegjøre."
    );

  });

map.on("click", async (e) => {

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
