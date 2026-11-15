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

// Interactive Seasonal Calendar Logic
document.addEventListener("DOMContentLoaded", function () {
  const dobInput = document.getElementById("dateOfBirth");
  const calendarPopup = document.getElementById("calendarPopup");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");
  const closeCalendarBtn = document.getElementById("closeCalendar");
  const monthYearEl = document.getElementById("calendarMonthYear");
  const daysContainer = document.getElementById("calendarDays");

  if (!dobInput || !calendarPopup) return;

  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth(); // 0-11

  if (dobInput.value) {
    const parts = dobInput.value.split("-");
    if (parts.length === 3) {
      currentYear = parseInt(parts[0], 10);
      currentMonth = parseInt(parts[1], 10) - 1;
    }
  }

  function updateSeasonalClass(monthIndex) {
    calendarPopup.classList.remove("season-spring", "season-summer", "season-monsoon", "season-winter");
    // Spring: March (2), April (3), May (4)
    // Summer: June (5), July (6), August (7)
    // Monsoon: September (8), October (9), November (10)
    // Winter: December (11), January (0), February (1)
    if (monthIndex >= 2 && monthIndex <= 4) {
      calendarPopup.classList.add("season-spring");
    } else if (monthIndex >= 5 && monthIndex <= 7) {
      calendarPopup.classList.add("season-summer");
    } else if (monthIndex >= 8 && monthIndex <= 10) {
      calendarPopup.classList.add("season-monsoon");
    } else {
      calendarPopup.classList.add("season-winter");
    }
  }

  function renderCalendar(year, month) {
    daysContainer.innerHTML = "";
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    monthYearEl.textContent = `${monthNames[month]} ${year}`;
    updateSeasonalClass(month);

    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("calendar-day", "empty");
      daysContainer.appendChild(emptyCell);
    }

    const today = new Date();
    const selectedVal = dobInput.value;

    for (let day = 1; day <= totalDays; day++) {
      const dayCell = document.createElement("div");
      dayCell.classList.add("calendar-day");
      dayCell.textContent = day;

      const formattedMonth = String(month + 1).padStart(2, "0");
      const formattedDay = String(day).padStart(2, "0");
      const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

      if (
        year === today.getFullYear() &&
        month === today.getMonth() &&
        day === today.getDate()
      ) {
        dayCell.classList.add("today");
      }

      if (selectedVal === dateStr) {
        dayCell.classList.add("selected");
      }

      dayCell.addEventListener("click", function () {
        dobInput.value = dateStr;
        dobInput.dispatchEvent(new Event("change"));
        calendarPopup.hidden = true;
      });

      daysContainer.appendChild(dayCell);
    }
  }

  dobInput.addEventListener("focus", function () {
    if (dobInput.value) {
      const parts = dobInput.value.split("-");
      if (parts.length === 3) {
        currentYear = parseInt(parts[0], 10);
        currentMonth = parseInt(parts[1], 10) - 1;
      }
    }
    renderCalendar(currentYear, currentMonth);
    calendarPopup.hidden = false;
  });

  dobInput.addEventListener("click", function () {
    renderCalendar(currentYear, currentMonth);
    calendarPopup.hidden = false;
  });

  closeCalendarBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    calendarPopup.hidden = true;
  });

  prevMonthBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
  });

  nextMonthBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
  });

  document.addEventListener("click", function (e) {
    if (!calendarPopup.contains(e.target) && e.target !== dobInput) {
      calendarPopup.hidden = true;
    }
  });
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

