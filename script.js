// Paste your deployed Google Apps Script Web App URL here.
// Keep the /exec ending.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzFxGNPBwDeji84Y2S75U7JhRcyhsboEC8vDM7IOxN1KP0CFk-XV55r1lV9VFOK-qoa/exec";

const form = document.getElementById("registrationForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');

  const registrationData = {
    fullName: document.getElementById("fullName").value.trim(),
    contactNumber: document.getElementById("contactNumber").value.trim(),
    dateOfBirth: document.getElementById("dateOfBirth").value,
    timeOfBirth: document.getElementById("timeOfBirth").value,
    placeOfBirth: document.getElementById("placeOfBirth").value.trim()
  };

  if (
    !GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/") ||
    GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")
  ) {
    formMessage.textContent = "The registration system is not configured yet.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  formMessage.textContent = "";

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(registrationData)
    });

    formMessage.textContent =
      "Your registration request has been sent. Please wait while we verify it.";

    form.reset();

  } catch (error) {
    console.error("Registration submission error:", error);
    formMessage.textContent =
      "We could not send your registration. Please check your internet connection and try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Registration";
  }
});

// Floating Skill Bubbles Physics & Animation
document.addEventListener("DOMContentLoaded", function () {
  const bubbles = document.querySelectorAll(".skill-bubble");
  if (!bubbles.length) return;

  // Respect reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const bubbleData = Array.from(bubbles).map((bubble, index) => {
    const size = 125;
    
    // Stagger initial positions across the screen
    let x = (index * (window.innerWidth / 4)) % Math.max(100, window.innerWidth - size);
    let y = 60 + (index * 90) % Math.max(100, window.innerHeight - size - 120);

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 0.5;
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;

    return { element: bubble, x, y, vx, vy, size };
  });

  function animateBubbles() {
    const maxX = window.innerWidth;
    const maxY = window.innerHeight;

    bubbleData.forEach((b) => {
      b.x += b.vx;
      b.y += b.vy;

      // Bounce off walls
      if (b.x <= 0) {
        b.x = 0;
        b.vx = -b.vx;
      } else if (b.x + b.size >= maxX) {
        b.x = maxX - b.size;
        b.vx = -b.vx;
      }

      if (b.y <= 0) {
        b.y = 0;
        b.vy = -b.vy;
      } else if (b.y + b.size >= maxY) {
        b.y = maxY - b.size;
        b.vy = -b.vy;
      }

      b.element.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
    });

    requestAnimationFrame(animateBubbles);
  }

  requestAnimationFrame(animateBubbles);
});

