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

// --- ART WALL: DRAGGING & LOCAL STORAGE ---

let highestZ = 10;

// 1. Function to SAVE positions to Local Storage
function saveArtPositions() {
    const positions = {};
    document.querySelectorAll('.drag-item').forEach(item => {
        positions[item.id] = {
            left: item.style.left,
            top: item.style.top
        };
    });
    localStorage.setItem('artPositions', JSON.stringify(positions));
}

// 2. Function to LOAD positions from Local Storage
function loadArtPositions() {
    const savedData = localStorage.getItem('artPositions');
    if (savedData) {
        const positions = JSON.parse(savedData);
        document.querySelectorAll('.drag-item').forEach(item => {
            if (positions[item.id]) {
                item.style.left = positions[item.id].left;
                item.style.top = positions[item.id].top;
            }
        });
    }
}

function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        element.style.zIndex = ++highestZ;
        
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = element.offsetLeft;
        initialTop = element.offsetTop;

        element.style.cursor = 'grabbing';
        e.preventDefault(); 
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // Calculate movement based on current scale
        const scale = parseFloat(document.getElementById("scene").style.transform.replace('scale(', '')) || 1;
        
        const dx = (e.clientX - startX) / scale;
        const dy = (e.clientY - startY) / scale;

        element.style.left = `${initialLeft + dx}px`;
        element.style.top = `${initialTop + dy}px`;
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.style.cursor = 'grab';
            saveArtPositions(); // Save coordinates to browser memory
        }
    });
}

// INITIALIZE: Load positions and make items draggable
window.addEventListener("DOMContentLoaded", () => {
    loadArtPositions();
    document.querySelectorAll('.drag-item').forEach(item => {
        makeDraggable(item);
    });
});

const grasses = document.querySelectorAll('.grass');
const grassHint = document.getElementById('grass-hint');

const grassMessages = [
    "Wow...You just touched grass...",
    "Maybe you can also try to go outside...",
    "Is it... scary?",
    "You're doing great."
];

let messageIndex = 0;
let isCurrentlyTouching = false;

// Initialize the first message
grassHint.innerText = grassMessages[messageIndex];

window.addEventListener('mousemove', (e) => {
    let anyGrassMoved = false;

    // Get the current scale of your game (e.g., 1.5 or 0.8)
    const scale = parseFloat(elements.scene.style.transform.replace('scale(', '')) || 1;

    grasses.forEach(Grass => {
        const rect = Grass.getBoundingClientRect();
        
        // Calculate the center of the Grass's root
        const GrassRootX = rect.left + rect.width / 2;
        const GrassRootY = rect.bottom;

        // Calculate distance between mouse and Grass root
        const dx = e.clientX - GrassRootX;
        const dy = e.clientY - GrassRootY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Max interaction distance (e.g., 60 pixels)
        const maxDist = 20 * scale;

        if (distance < maxDist) {
            anyGrassMoved = true;
            
            const intensity = (maxDist - distance) / maxDist;
            const tiltAngle = (dx / scale) * intensity * 3; 

            // Apply rotation and a slight "squish" effect
            Grass.style.transform = `rotate(${tiltAngle}deg) scaleY(${1 - (intensity * 0.1)})`;
        } else {
            // Snap back to original position
            Grass.style.transform = `rotate(0deg) scaleY(1)`;
        }
    });

    // Show/Hide the "Touch Grass" text
    if (anyGrassMoved) {
        if (!isCurrentlyTouching) {
            grassHint.classList.add('show');
            isCurrentlyTouching = true;
        }
    } else {
        if (isCurrentlyTouching) {
            grassHint.classList.remove('show');
            isCurrentlyTouching = false;
            
            // Wait for the text to hide, then change it to the next message
            setTimeout(() => {
                messageIndex++;
                if (messageIndex >= grassMessages.length) {
                    messageIndex = 0; // Loop back to the start
                }
                grassHint.innerText = grassMessages[messageIndex];
            }, 300); // This matches your CSS transition time
        }
    }
});


const imageCache = {};

async function getCachedImage(src) {
    if (imageCache[src]) return imageCache[src];
    return new Promise((res) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            imageCache[src] = img;
            res(img);
        };
    });
}

async function processAllPaintings() {
    const pSize = parseInt(document.getElementById('pixelSize').value);
    const palSize = parseInt(document.getElementById('paletteSize').value);
    const dither = document.getElementById('dither').checked;

    const canvases = document.querySelectorAll('.pixel-painting');
    
    for (let canvas of canvases) {
        const src = canvas.getAttribute('data-src');
        const img = await getCachedImage(src);
        applyPixelLogic(canvas, img, pSize, palSize, dither);
    }
}

function applyPixelLogic(out, img, pixelSize, paletteSize, dither) {
    const small = document.getElementById('small-proc');
    const outCtx = out.getContext('2d');
    const sCtx = small.getContext('2d');

    // Set sizes
    out.width = 150; // Fixed display width
    out.height = (img.height / img.width) * 150;
    
    const sw = Math.max(1, Math.round(out.width / pixelSize));
    const sh = Math.max(1, Math.round(out.height / pixelSize));
    small.width = sw;
    small.height = sh;

    // 1. Draw to small canvas
    sCtx.imageSmoothingEnabled = true;
    sCtx.drawImage(img, 0, 0, sw, sh);

    // 2. Get data and Quantize/Dither
    let imgData = sCtx.getImageData(0, 0, sw, sh);
    
    // Logic from your demo script
    let levels = Math.max(1, Math.round(Math.pow(paletteSize, 1/3)));
    if(dither) {
        floydSteinbergDither(imgData, levels);
    } else {
        for(let i=0; i<imgData.data.length; i+=4) {
            imgData.data[i] = quantChannel(imgData.data[i], levels);
            imgData.data[i+1] = quantChannel(imgData.data[i+1], levels);
            imgData.data[i+2] = quantChannel(imgData.data[i+2], levels);
        }
    }

    sCtx.putImageData(imgData, 0, 0);

    // 3. Upscale to output
    outCtx.imageSmoothingEnabled = false;
    outCtx.clearRect(0,0, out.width, out.height);
    outCtx.drawImage(small, 0, 0, sw, sh, 0, 0, out.width, out.height);
}

// Re-using your specific math functions
function quantChannel(v, levels) {
    const step = 255/(levels-1);
    return Math.round(v/step)*step;
}

function floydSteinbergDither(imageData, levels) {
    const w = imageData.width;
    const h = imageData.height;
    const data = imageData.data;
    const step = levels <= 1 ? 255 : 255/(levels-1);
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));

    for(let y=0; y<h; y++) {
        for(let x=0; x<w; x++) {
            const i = (y*w + x)*4;
            const oldR = data[i], oldG = data[i+1], oldB = data[i+2];
            const newR = Math.round(oldR/step)*step;
            const newG = Math.round(oldG/step)*step;
            const newB = Math.round(oldB/step)*step;
            data[i] = newR; data[i+1] = newG; data[i+2] = newB;

            const errR = oldR - newR, errG = oldG - newG, errB = oldB - newB;
            
            const dist = (nx, ny, f) => {
                if(nx<0 || nx>=w || ny<0 || ny>=h) return;
                const i2 = (ny*w + nx)*4;
                data[i2] = clamp(data[i2] + errR*f);
                data[i2+1] = clamp(data[i2+1] + errG*f);
                data[i2+2] = clamp(data[i2+2] + errB*f);
            };
            dist(x+1, y, 7/16); dist(x-1, y+1, 3/16); dist(x, y+1, 5/16); dist(x+1, y+1, 1/16);
        }
    }
}

// --- EVENT LISTENERS ---
['pixelSize', 'paletteSize', 'dither'].forEach(id => {
    document.getElementById(id).addEventListener('input', processAllPaintings);
});

// Initial render
window.addEventListener('DOMContentLoaded', processAllPaintings);