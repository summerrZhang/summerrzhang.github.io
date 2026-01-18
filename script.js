/**
 * PIXEL PORTFOLIO CORE SCRIPT
 * Organized by: Scaling, Modals, API, and Interactions
 */

// --- CONFIGURATION & STATE ---
const BASE_WIDTH = 640;
const BASE_HEIGHT = 360;
const INTRO_MESSAGE = "Hi, welcome to my space :3 Feel free to click around and explore. This space is always under construction, just like me.";

// --- DOM ELEMENTS ---
const elements = {
    scene: document.getElementById("scene"),
    gameLayers: document.querySelectorAll(".game-layer"),
    // Interaction Objects
    laptop: document.getElementById("laptop"),
    me: document.getElementById("me"),
    mark: document.getElementById("mark"),
    painting: document.getElementById("painting"),
    // Modals
    modals: {
        laptop: document.getElementById("laptop-modal"),
        projects: document.getElementById("projects-modal"),
        dialog: document.getElementById("intro-dialog"),
        art: document.getElementById("art-modal")
    },
    // Desktop Icons
    pdfIcon: document.getElementById("pdf-icon"),
    folderIcon: document.getElementById("folder-icon"),
    // Content Containers
    dialogText: document.getElementById("dialog-text"),
    moodText: document.getElementById("mood-text"),
    moodFace: document.getElementById("mood-face")
};

// --- 1. SCALING SYSTEM ---
function scaleScene() {
    const scale = Math.min(
        window.innerWidth / BASE_WIDTH,
        window.innerHeight / BASE_HEIGHT
    );
    elements.gameLayers.forEach(layer => {
        layer.style.transform = `scale(${scale})`;
    });
}

window.addEventListener("resize", scaleScene);
scaleScene(); // Initial call

// --- 2. MODAL MANAGER ---
// A single function to handle all opening/closing
function toggleModal(modalKey, show = true) {
    const modal = elements.modals[modalKey];
    if (modal) {
        modal.style.display = show ? "flex" : "none";
    }
}

// --- 3. EVENT LISTENERS ---

// Laptop & OS Interactions
elements.laptop.addEventListener('click', () => toggleModal('laptop', true));
document.getElementById("close-laptop").addEventListener('click', () => toggleModal('laptop', false));

elements.folderIcon.addEventListener('click', () => toggleModal('projects', true));
document.getElementById("close-projects").addEventListener('click', () => toggleModal('projects', false));

elements.pdfIcon.addEventListener('click', () => {
    window.open("assets/Summer_Zhang_CV.pdf", "_blank");
});

// Art Gallery Interactions
if (elements.painting) {
    elements.painting.addEventListener('click', () => toggleModal('art', true));
}
const closeArt = document.getElementById("close-art");
if (closeArt) {
    closeArt.addEventListener('click', () => toggleModal('art', false));
}

// Character Introduction
const startIntroduction = () => {
    elements.mark.style.display = 'none'; // Hide ! mark
    elements.dialogText.innerText = INTRO_MESSAGE; // Instant text
    toggleModal('dialog', true);
};

elements.mark.addEventListener('click', startIntroduction);
elements.me.addEventListener('click', startIntroduction);
elements.modals.dialog.addEventListener('click', () => toggleModal('dialog', false));

// --- 4. MOOD API (iMood) ---
async function loadMood() {
    const email = "hanyuanzhang0501@gmail.com";
    const proxy = "https://api.allorigins.win/raw?url=";
    const queryUrl = `${proxy}${encodeURIComponent(`https://xml.imood.org/query.cgi?email=${email}`)}`;
    const facesUrl = `${proxy}${encodeURIComponent(`https://xml.imood.org/faces.cgi`)}`;

    try {
        // Fetch Mood
        const response = await fetch(queryUrl);
        const xmlText = await response.text();
        const xml = new DOMParser().parseFromString(xmlText, "text/xml");

        const mood = xml.querySelector("base")?.textContent || "Unknown";
        const faceID = xml.querySelector("face")?.textContent;

        elements.moodText.textContent = `Mood:\n ${mood}`;

        // Fetch Face Icon
        if (faceID) {
            const resFace = await fetch(facesUrl);
            const xmlTextFace = await resFace.text();
            const xmlFace = new DOMParser().parseFromString(xmlTextFace, "text/xml");
            const faceList = Array.from(xmlFace.querySelectorAll("face"));
            const faceIcon = faceList[faceID]?.querySelector("link")?.textContent;
            
            if (faceIcon) elements.moodFace.src = faceIcon;
        }
    } catch (err) {
        console.error("Mood error:", err);
        elements.moodText.textContent = "Mood: Resting";
    }
}

loadMood();