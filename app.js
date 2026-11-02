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
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

let activeName = null;

document
  .getElementById("guessBtn")
  .addEventListener("click", () => {

   