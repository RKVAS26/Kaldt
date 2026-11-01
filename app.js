import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    setDoc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

const map = L.map("map").setView([59.9139, 10.7522], 9);

L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap"
    }
).addTo(map);

// Viktig: fikser forskjøvede kartfliser
setTimeout(() => {
    map.invalidateSize();
}, 500);

const soldierIcon = L.divIcon({
    className: "soldier-icon",
    html: "🪖",
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const starIcon = L.divIcon({
    className: "star-icon",
    html: "⭐",
    iconSize: [36, 36],
    iconAnchor: [18, 18]
});

let placementMode = false;
let answerMode = false;

document
    .getElementById("guessBtn")
    .addEventListener("click", () => {

        placementMode = true;

        document.getElementById("status").innerText =
            "Klikk på kartet der du tror Henrik skal tjenestegjøre.";
    });

document
    .getElementById("adminBtn")
    .addEventListener("click", () => {

        const pass = prompt("Admin-passord");

        if (pass !== "Henrik2026") {
            alert("Feil passord");
            return;
        }

        document.getElementById("answerBtn").style.