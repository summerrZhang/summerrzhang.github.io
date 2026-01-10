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