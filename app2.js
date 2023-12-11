// Get the ASCII container element from the document
const container = document.getElementById("asciiContainer");
const explain = document.getElementById("explain");
const stats = document.getElementById("stats");

let intervalId;
let frameCount = 0;
let startTime = performance.now();
// Initialize a frame counter for animation
let frame = 0;
// Function to calculate FPS
function calculateFPS() {
  const currentTime = performance.now();
  const elapsedTime = currentTime - startTime;
  const fps = Math.round(frameCount / (elapsedTime / 1000));
  // console.log(`FPS: ${fps}`);
  stats.textContent = `FPS: ${fps}`;
}


const gameOfLifeExplain = `The Game of Life is a cellular automaton devised by mathematician John Conway, where each cell on a grid evolves through generations according to its number of live neighbors. It's a zero-player game, with the initial configuration determining the evolution of the game, and it can reach equilibrium when the grid configuration ceases to change.`
flicker(gameOfLifeExplain, 100);


// flicker the text content until it's completely written
function flicker(frame) {
  if(explain.textContent !== undefined){
    console.log(" explain.textContent",  explain.textContent)
    if(explain.textContent === 'undefined'){
      explain.textContent = 'T'
    }
  explain.textContent = explain.textContent + gameOfLifeExplain[frame]
}}
// Define the characters used for ASCII shading
const density = "Ñ@#W$9876543210?!abc;:+=-,._ ";

// Set the number of rows and columns for the ASCII grid
const rows = 30;
const cols = 80;

// Loop to initialize the ASCII grid with spans and line breaks
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    // Create a new span element for each ASCII character
    const span = document.createElement("span");
    // Append the span to the container
    container.appendChild(span);
  }
  // After each row, append a line break to start a new line
  container.appendChild(document.createElement("br"));
}

// Select all span elements in the container (representing each ASCII character)
const chars = container.querySelectorAll("span");


// Function to calculate which character to display based on x, y position and frame
function main(x, y, state) {
  const alive = state[y][x];
  return alive ? density[Math.floor(Math.random() * density.length)] : ' ';
}

// Initialize game state with random values based on density
let currentState = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () => Math.random() < 0.2)
);

// Function to count live neighbors for a cell
function countNeighbors(x, y, state) {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        count += state[ny][nx] ? 1 : 0;
      }
    }
  }
  return count;
}

// Function to update each frame of the animation
function updateFrame() {
  // Initialize the next state of the game
  let nextState = currentState.map((row) => [...row]);

  // Update the next state based on the current state
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(x, y, currentState);
      const alive = currentState[y][x];
      nextState[y][x] = neighbors === 3 || (alive && neighbors === 2);
    }
  }
   // Increment the frame counter
   frameCount++;
   // Call calculateFPS every 60 frames
   if (frameCount % 60 === 0) {
     calculateFPS();
   }

   if (frameCount < gameOfLifeExplain.length) {
     flicker(frameCount);
   }
  // Update the ASCII characters
  let i = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      chars[i++].textContent = main(x, y, nextState);
    }
  }

  // Update the current state for the next iteration
  currentState = nextState;

  // Increment the frame counter
  frame++;
  // Request the next frame of the animation
  requestAnimationFrame(updateFrame);
}

// Start the animation
updateFrame();