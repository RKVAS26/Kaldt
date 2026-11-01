import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
doc,
setDoc,
getDoc,
onSnapshot
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

const map =
L.map('map')
.setView([59.9139,10.7522],9);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

const soldierIcon =
L.divIcon({
className:'soldier-icon',
html:'🪖'
});

const starIcon =
L.divIcon({
className:'star-icon',
html:'⭐'
});

let mode = null;
let answerMode = false;

document
.getElementById("guessBtn")
.onclick = () => {

mode = "guess";

document.getElementById("status")
.innerText =
"Klikk der du tror Henrik skal tjenestegjøre.";
};

document
.getElementById("adminBtn")
.onclick = ()=>{

const pass =
prompt("Admin-passord");

if(pass !== "Henrik2026"){
return;
}

document
.getElementById("answerBtn")
.style.display="inline-block";

document
.getElementById("revealBtn")
.style.display="inline-block";

document
.getElementById("winnerBtn")
.style.display="inline-block";
};

document
.getElementById("answerBtn")
.onclick = ()=>{

answerMode = true;

document.getElementById("status")
.innerText =
"Klikk på kartet for fasit.";
};

map.on("click", async e=>{

if(answerMode){

await setDoc(
doc(db,"settings","answer"),
{
lat:e.latlng.lat,
lng:e.latlng.lng
}
);

L.marker(
[e.latlng.lat,e.latlng.lng],
{
icon:starIcon
}
).addTo(map);

answerMode = false;

return;
}

if(mode!=="guess"){
return;
}

const name =
document
.getElementById("name")
.value
.trim();

if(!name){
alert("Skriv navn.");
return;
}

await addDoc(
collection(db,"guesses"),
{
name:name,
lat:e.latlng.lat,
lng:e.latlng.lng
}
);

alert("Tips registrert.");

mode=null;
});

document
.getElementById("revealBtn")
.onclick = async ()=>{

await setDoc(
doc(db,"settings","reveal"),
{
show:true
}
);

loadVisibleTips();
};

async function loadVisibleTips(){

const reveal =
await getDoc(
doc(db,"settings","reveal")
);

if(
!reveal.exists() ||
reveal.data().show!==true
){
return;
}

const snapshot =
await getDocs(
collection(db,"guesses")
);

snapshot.forEach(d=>{

const g = d.data();

L.marker(
[g.lat,g.lng],
{
icon:soldierIcon
}
)
.addTo(map)
.bindPopup(g.name);

});
}

document
.getElementById("winnerBtn")
.onclick = async ()=>{

const answer =
await getDoc(
doc(db,"settings","answer")
);

if(!answer.exists()){
alert("Ingen fasit.");
return;
}

const target =
answer.data();

const snapshot =
await getDocs(
collection(db,"guesses")
);

let scores=[];

snapshot.forEach(d=>{

const g=d.data();

const dist =
map.distance(
[g.lat,g.lng],
[target.lat,target.lng]
)/1000;

scores.push({
name:g.name,
distance:dist
});

});

scores.sort(
(a,b)=>
a.distance-b.distance
);

let html =
"<table>";

html +=
"<tr><th>Plass</th><th>Navn</th><th>Avstand</th></tr>";

scores.forEach((s,i)=>{

html += `
<tr class="${i===0?'winner':''}">
<td>${i===0?'🏆':i+1}</td>
<td>${s.name}</td>
<td>${s.distance.toFixed(1)} km</td>
</tr>`;
});

html += "</table>";

document
.getElementById("results")
.innerHTML = html;
};

loadVisibleTips();