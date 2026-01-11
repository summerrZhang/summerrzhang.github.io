/* --- ELEMENTS --- */
const laptop = document.getElementById("laptop");

// Modals
const laptopModal = document.getElementById("laptop-modal");
const projectsModal = document.getElementById("projects-modal");

// Close Buttons
const closeLaptopBtn = document.getElementById("close-laptop");
const closeProjectsBtn = document.getElementById("close-projects");

// Icons inside Screen
const pdfIcon = document.getElementById("pdf-icon");
const folderIcon = document.getElementById("folder-icon");

// Elements to scale (everything with this class)
const gameLayers = document.querySelectorAll(".game-layer");


/* --- EVENT LISTENERS --- */

// 1. Click Laptop -> Open Screen Modal
laptop.onclick = () => {
  laptopModal.style.display = "flex"; // Use flex to utilize the CSS centering
};

// 2. Click Close (Laptop) -> Close Modal
closeLaptopBtn.onclick = () => {
  laptopModal.style.display = "none";
};

// 3. Click PDF -> Open Resume in new tab
pdfIcon.onclick = () => {
  // Replace this URL with your actual file path
  window.open("assets/Summer_Zhang_CV.pdf", "_blank"); 
};

// 4. Click Folder -> Open Projects Modal
folderIcon.onclick = () => {
  projectsModal.style.display = "flex";
};

// 5. Click Close (Projects) -> Close Projects Modal
closeProjectsBtn.onclick = () => {
  projectsModal.style.display = "none";
};


/* --- SCALING LOGIC --- */
function scaleScene() {
  // Base dimensions of your pixel art
  const baseWidth = 640;
  const baseHeight = 360;

  // Calculate the scale factor to fit the window
  const scale = Math.min(
    window.innerWidth / baseWidth,
    window.innerHeight / baseHeight
  );

  // Apply scale to ALL game layers (Scene, Laptop Screen, Project Window)
  // This ensures they are all exactly the same size and position relative to the center
  gameLayers.forEach(layer => {
    layer.style.transform = `scale(${scale})`;
  });
}

// Listen for resize
window.addEventListener("resize", scaleScene);

// Initial Scale
scaleScene();

// const email = "hanyuanzhang0501@gmail.com";
// const url = "https://api.allorigins.win/raw?url=https://xml.imood.org/query.cgi?email=" + encodeURIComponent(email);
// fetch(url)
//   .then(response => response.text())
//   .then(text => {
//     console.log("RAW XML from IMood:");
//     console.log(text);
//   })
//   .catch(error => {
//     console.error("Fetch error:", error);
//   });

async function loadmood() {
  const email = "hanyuanzhang0501@gmail.com";
  const url = "https://api.allorigins.win/raw?url=https://xml.imood.org/query.cgi?email=" + encodeURIComponent(email);


  const response = await fetch(url);
  const xmlText = await response.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "text/xml");


  const mood = xml.querySelector("base")?.textContent;
  const faceID = xml.querySelector("face")?.textContent;

  document.getElementById("mood-text").textContent =
    `Mood: ${mood}`;

  
  console.log(xmlText);
  const resFace = await fetch("https://api.allorigins.win/raw?url=https://xml.imood.org/faces.cgi")
  const xmlTextFace = await resFace.text();
  const parserFace = new DOMParser();
  const xmlFace = parser.parseFromString(xmlTextFace, "text/xml");

  const faceList = Array.from(xmlFace.querySelectorAll("face"));
  const faceIcon = faceList[faceID].querySelector("link")?.textContent;
  // console.log(xmlFace);
  // console.log(faceIcon);
  document.getElementById("mood-face").src = faceIcon;

}

loadmood();