// script.js - Handles the roulette logic and spin animation

// Grab DOM elements we need
const nameInput = document.getElementById('nameInput');
const startBtn = document.getElementById('startBtn');
const canvas = document.getElementById('wheel');
const resultEl = document.getElementById('result');

const ctx = canvas.getContext('2d');
let names = [];
let finalRotation = 0;

// Function to draw the roulette wheel based on the current names list
function drawWheel() {
  const num = names.length;
  if (num === 0) return;

  // Clear previous drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Angle of each slice
  const angle = (2 * Math.PI) / num;

  // Radius of the wheel
  const radius = canvas.width / 2;

  // Draw each slice
  for (let i = 0; i < num; i++) {
    // Start/end angles adjusted so the first slice starts at the top (-90 deg)
    const startAngle = -Math.PI / 2 + i * angle;
    const endAngle = startAngle + angle;

    // Alternate colors for better visibility
    ctx.fillStyle = i % 2 === 0 ? '#ffcc66' : '#ffed99';

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();

    // Draw slice border
    ctx.strokeStyle = '#333';
    ctx.stroke();

    // Draw the name text
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(startAngle + angle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(names[i], radius - 10, 5); // 10px padding from edge
    ctx.restore();
  }
}

// Function to start the spinning process
function spin() {
  if (names.length === 0) return;

  // Pick a random index as the winner
  const winnerIndex = Math.floor(Math.random() * names.length);

  // Compute rotation so that the chosen slice ends at the pointer (top)
  const sliceAngle = 360 / names.length;
  const spins = Math.floor(Math.random() * 3) + 3; // 3~5 full spins
  finalRotation = spins * 360 + 90 - (winnerIndex + 0.5) * sliceAngle;

  // Reset transition to allow re-spinning
  canvas.style.transition = 'none';
  canvas.style.transform = `rotate(0deg)`;
  resultEl.textContent = '';

  // Start the animation on the next tick
  setTimeout(() => {
    canvas.style.transition = 'transform 4s ease-out';
    canvas.style.transform = `rotate(${finalRotation}deg)`;
  }, 20);

  // Once the animation is done, show the selected name
  canvas.addEventListener(
    'transitionend',
    function handler() {
      resultEl.textContent = names[winnerIndex];
      canvas.removeEventListener('transitionend', handler);
    }
  );
}

// Parse the input and draw the wheel when the button is clicked
startBtn.addEventListener('click', () => {
  const raw = nameInput.value.trim();
  if (!raw) return;

  // Split by comma and remove empty entries
  names = raw.split(',').map((n) => n.trim()).filter((n) => n);

  drawWheel();
  spin();
});
