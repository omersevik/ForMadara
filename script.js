// Elements
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const result = document.getElementById("result");
const bgMusic = document.getElementById("bgMusic");
const heartsContainer = document.getElementById("hearts-container");
const fireworksContainer = document.getElementById("fireworks-container");
const particlesContainer = document.querySelector(".particles");
const loveCard = document.querySelector(".love-card");

// Parameters for the No button avoidance behavior - adjusted for smoother, faster movement
let noBtnSpeed = 2; // Increased base speed
let noBtnAcceleration = 1.1; // Reduced acceleration for smoother movement
let mouseRepelDistance = 180; // Increased detection distance
let mousePosition = { x: 0, y: 0 };
let prevMousePosition = { x: 0, y: 0 };
let isFirstNoButtonInteraction = true;
let initialNoBtnSetup = false;
let isYesClicked = false;
let isMouseNearYesBtn = false;

// Timer functionality - Show time since 23.08.2021 22:08
const startDate = new Date("2021-08-23T22:08:00").getTime();
const timerElem = document.getElementById("timer");

function updateTimer() {
  const now = Date.now();
  const diff = now - startDate; // Time difference in milliseconds

  // Calculate days, hours, minutes, seconds
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Update timer element
  timerElem.innerHTML = `
        <span>${days} gün, </span>
        <span>${hours} saat, </span>
        <span>${minutes} dakika, </span>
        <span>${seconds} saniye </span>
        <span>geçti...</span>
    `;
}

// Initial timer update and set interval
updateTimer();
setInterval(updateTimer, 1000);

// Track mouse position for more dynamic button movement
document.addEventListener("mousemove", (e) => {
  prevMousePosition = { ...mousePosition };
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;

  // Check if mouse is near Yes button
  if (yesBtn) {
    const yesBtnRect = yesBtn.getBoundingClientRect();
    isMouseNearYesBtn =
      mousePosition.x >= yesBtnRect.left &&
      mousePosition.x <= yesBtnRect.right &&
      mousePosition.y >= yesBtnRect.top &&
      mousePosition.y <= yesBtnRect.bottom;
  }
});

// Create background particles
function createParticles() {
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = `${Math.random() * 5 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.background = `rgba(255, ${Math.random() * 100 + 155}, ${
      Math.random() * 100 + 155
    }, ${Math.random() * 0.5 + 0.3})`;
    particle.style.borderRadius = "50%";
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.boxShadow = "0 0 10px rgba(255, 105, 180, 0.5)";
    particle.style.animation = `float ${
      Math.random() * 10 + 10
    }s linear infinite`;
    particle.style.animationDelay = `-${Math.random() * 10}s`;
    particlesContainer.appendChild(particle);
  }
}

// Generate random position for noBtn
function generateRandomPosition() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const bodyRect = document.body.getBoundingClientRect();

  // Get button dimensions
  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  // Calculate maximum allowed position values
  // Use the minimum of window and body dimensions to ensure it stays within both
  const maxX = Math.min(windowWidth, bodyRect.width) - btnWidth - 50;
  const maxY = Math.min(windowHeight, bodyRect.height) - btnHeight - 50;

  // Calculate minimum allowed position values
  const minX = 50; // Margin from left
  const minY = 50; // Margin from top

  // Generate random position within the safe area
  return {
    x: Math.max(minX, Math.min(maxX, minX + Math.random() * (maxX - minX))),
    y: Math.max(minY, Math.min(maxY, minY + Math.random() * (maxY - minY))),
  };
}

// Determine if mouse is moving towards the No button
function isMovingTowardsNoBtn() {
  if (!noBtn) return false;

  const rect = noBtn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;

  // Calculate vectors
  const prevVector = {
    x: btnCenterX - prevMousePosition.x,
    y: btnCenterY - prevMousePosition.y,
  };

  const currentVector = {
    x: btnCenterX - mousePosition.x,
    y: btnCenterY - mousePosition.y,
  };

  // Calculate distances
  const prevDistance = Math.sqrt(
    prevVector.x * prevVector.x + prevVector.y * prevVector.y
  );
  const currentDistance = Math.sqrt(
    currentVector.x * currentVector.x + currentVector.y * currentVector.y
  );

  // If distance is decreasing, mouse is moving towards button
  return currentDistance < prevDistance;
}

// Make sure button stays in viewport
function checkButtonInView() {
  if (!noBtn) return;

  // Always ensure the button is visible
  noBtn.style.opacity = "1";
  noBtn.style.visibility = "visible";
  noBtn.style.display = "block";

  // Get button's current position
  const rect = noBtn.getBoundingClientRect();

  // If button is out of view, bring it back
  if (
    rect.right < 0 ||
    rect.bottom < 0 ||
    rect.left > window.innerWidth ||
    rect.top > window.innerHeight
  ) {
    // Generate a new visible position
    const newPos = generateRandomPosition();
    noBtn.style.position = "fixed";
    noBtn.style.left = `${newPos.x}px`;
    noBtn.style.top = `${newPos.y}px`;

    // Reset any transformations that might affect visibility
    noBtn.style.transform = "none";
  }
}

// Move the No button away from the cursor - smoother movement
function moveNoButton() {
  if (!noBtn) return;

  // Make sure button is visible
  checkButtonInView();

  const rect = noBtn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;

  // Calculate distance between button and mouse
  const dx = mousePosition.x - btnCenterX;
  const dy = mousePosition.y - btnCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Only move if mouse is close enough AND either:
  // 1. It's the first interaction, OR
  // 2. Mouse is moving toward the No button OR
  // 3. Mouse was near Yes but now moving toward No
  if (
    distance < mouseRepelDistance &&
    (isFirstNoButtonInteraction ||
      isMovingTowardsNoBtn() ||
      (isMouseNearYesBtn && isMovingTowardsNoBtn()))
  ) {
    // First interaction should be smooth but dramatic
    if (isFirstNoButtonInteraction) {
      const newPos = generateRandomPosition();
      noBtn.style.position = "fixed";
      // Add transition for smoother first movement
      noBtn.style.transition = "left 0.3s ease-out, top 0.3s ease-out";
      noBtn.style.left = `${newPos.x}px`;
      noBtn.style.top = `${newPos.y}px`;
      isFirstNoButtonInteraction = false;

      // Increase the button's evasiveness after first interaction
      noBtnSpeed *= noBtnAcceleration;
      mouseRepelDistance += 20;

      // Reset transition after initial movement
      setTimeout(() => {
        noBtn.style.transition =
          "left 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)";
      }, 300);

      return;
    }

    // Calculate the direction to move (opposite of mouse direction)
    // Using a smooth easing for the movement
    let moveX = (-dx / distance) * noBtnSpeed * 12; // Increased multiplier for faster movement
    let moveY = (-dy / distance) * noBtnSpeed * 12;

    // Get current position
    let currentX = parseInt(noBtn.style.left) || rect.left;
    let currentY = parseInt(noBtn.style.top) || rect.top;

    // Calculate new position
    let newX = currentX + moveX;
    let newY = currentY + moveY;

    // Ensure button stays within viewport and body bounds
    const bodyRect = document.body.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const bodyWidth = bodyRect.width;
    const bodyHeight = bodyRect.height;

    // Use minimum of viewport and body dimensions
    const maxX = Math.min(viewportWidth, bodyWidth) - rect.width - 30;
    const maxY = Math.min(viewportHeight, bodyHeight) - rect.height - 30;

    if (newX < 30) newX = 30;
    if (newY < 30) newY = 30;
    if (newX > maxX) newX = maxX;
    if (newY > maxY) newY = maxY;

    // Apply the new position with smooth transition
    noBtn.style.position = "fixed";
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;

    // Ensure the button is visible
    noBtn.style.visibility = "visible";
    noBtn.style.opacity = "1";
    noBtn.style.display = "block";

    // Increase the button's evasiveness (but cap it to avoid it getting too fast)
    noBtnSpeed = Math.min(noBtnSpeed * 1.01, 6); // Increased max speed to 6
  }
}

// Set up event listeners for noBtn
function setupNoButton() {
  if (initialNoBtnSetup) return;
  initialNoBtnSetup = true;

  // Initial positioning to be ready for interactions
  noBtn.style.position = "relative";

  // Ensure the button is visible
  noBtn.style.visibility = "visible";
  noBtn.style.opacity = "1";
  noBtn.style.display = "block";

  // Add smooth transition for movement
  noBtn.style.transition =
    "left 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)";

  // Handle mouse hover event
  noBtn.addEventListener("mouseenter", () => {
    moveNoButton();

    // Add some swing effect
    noBtn.style.transform = `rotate(${Math.random() > 0.5 ? "" : "-"}${
      Math.random() * 15 + 5
    }deg)`;
  });

  // Handle click event (just in case they somehow click it)
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Speed up and teleport the button far away
    noBtnSpeed = Math.min(noBtnSpeed * 1.5, 6);
    const newPos = generateRandomPosition();
    noBtn.style.left = `${newPos.x}px`;
    noBtn.style.top = `${newPos.y}px`;

    // Add a funny wobble
    noBtn.style.animation = "float 1s ease-in-out infinite";

    // Reset animation after a while
    setTimeout(() => {
      noBtn.style.animation = "";
    }, 1000);
  });

  // For touch devices
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveNoButton();
  });
}

// Yes button response
function handleYesClick() {
  // Prevent multiple clicks
  if (isYesClicked) return;
  isYesClicked = true;

  // Disable the yes button temporarily
  yesBtn.disabled = true;

  // Make the No button temporarily stop moving by removing focus
  noBtn.style.transition = "left 0.5s ease-out, top 0.5s ease-out";

  // Play background music
  bgMusic.play().catch((e) => console.log("Audio autoplay blocked by browser"));

  // Show result message with typing effect
  const message = "Zaten evet diyeceğini biliyordum 💖";
  let i = 0;
  result.innerHTML = "";
  result.style.opacity = 1;

  // Typing animation
  const typing = setInterval(() => {
    if (i < message.length) {
      result.innerHTML += message.charAt(i);
      i++;
    } else {
      clearInterval(typing);

      // Add additional hearts celebration
      createHeartShower();
      createFireworks();

      // Add a floating heart to Yes button
      yesBtn.innerHTML += " 💕";
      yesBtn.style.transform = "scale(1.1)";

      // Redirect to second question after animations complete
      setTimeout(() => {
        window.location.href = "question2.html";
      }, 3000);
    }
  }, 60);
}

// Create hearts animation when "Yes" is clicked - coming from different directions with rotation
function createHeartShower() {
  const directions = [
    { name: "bottom", x: 50, y: 100, angle: 0 },
    { name: "bottom-left", x: 0, y: 100, angle: 30 },
    { name: "bottom-right", x: 100, y: 100, angle: -30 },
  ];

  for (let i = 0; i < 75; i++) {
    setTimeout(() => {
      // Choose a random direction
      const dirIndex = Math.floor(Math.random() * directions.length);
      const direction = directions[dirIndex];

      const heart = document.createElement("div");
      heart.classList.add("heart");

      // Randomize starting position based on direction
      const randomOffset = Math.random() * 30 - 15; // -15 to 15
      heart.style.left = `${direction.x + randomOffset}vw`;
      heart.style.bottom = `${Math.random() * 10}vh`; // Small variation in starting height

      // Randomize size
      const size = Math.random() * 30 + 20;
      heart.style.width = `${size}px`;
      heart.style.height = `${size}px`;

      // Add rotation - base angle from direction plus random variation
      const rotationAngle = direction.angle + (Math.random() * 60 - 30); // ±30 degrees variation
      heart.style.transform = `rotate(${rotationAngle}deg)`;

      // Randomize animation duration
      const duration = Math.random() * 4 + 3;
      heart.style.animationDuration = `${duration}s`;

      // Calculate proportional rotation during animation
      // For direction-specific behavior
      if (direction.name === "bottom-left") {
        heart.style.animation = `float-heart-left ${duration}s linear forwards`;
      } else if (direction.name === "bottom-right") {
        heart.style.animation = `float-heart-right ${duration}s linear forwards`;
      } else {
        heart.style.animation = `float-heart ${duration}s linear forwards`;
      }

      heartsContainer.appendChild(heart);

      // Remove heart after animation completes
      setTimeout(() => {
        heart.remove();
      }, duration * 1000 + 200); // Add a small buffer
    }, i * 80); // Create hearts more frequently
  }
}

// Create firework effects when "Yes" is clicked
function createFireworks() {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const firework = document.createElement("div");
      firework.classList.add("firework");

      // Randomize position (excluding edges)
      const x = 10 + Math.random() * 80;
      const y = 10 + Math.random() * 80;
      firework.style.left = `${x}vw`;
      firework.style.top = `${y}vh`;

      // Randomize color
      const hue = Math.random() * 60 + 300; // Pink/purple range
      firework.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;

      fireworksContainer.appendChild(firework);

      // Remove firework after animation completes
      setTimeout(() => {
        firework.remove();
      }, 1000);
    }, i * 300);
  }
}

// Initialize everything
function init() {
  createParticles();
  setupNoButton();

  // Set up continuous monitoring of mouse position vs No button
  setInterval(moveNoButton, 50); // Increased frequency for smoother movement

  // Additional check to ensure button never disappears
  setInterval(checkButtonInView, 500);

  // Set up Yes button click event
  yesBtn.addEventListener("click", handleYesClick);

  // For touch devices
  yesBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    handleYesClick();
  });

  // Handle window resize events
  window.addEventListener("resize", () => {
    // Check if the button is still visible after resize
    setTimeout(checkButtonInView, 100);
  });
}

// Start the magic
document.addEventListener("DOMContentLoaded", init);
