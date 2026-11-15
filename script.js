// =====================================
   JYOTISH ASTROLOGY WEBSITE - 60FPS UI/UX MOTION SCRIPT
   =====================================

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzFxGNPBwDeji84Y2S75U7JhRcyhsboEC8vDM7IOxN1KP0CFk-XV55r1lV9VFOK-qoa/exec";

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // FEATURE 1: INTERACTIVE PLANETARY BACKGROUND
  // ==========================================
  const canvas = document.getElementById("planetBg");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    window.addEventListener("mousemove", (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    });

    const sun = {
      x: width / 2,
      y: height / 2,
      radius: 35,
      color: "#ffdf00",
      glowColor: "rgba(255, 140, 0, 0.4)"
    };

    const planets = [
      { a: 110, b: 70, speed: 0.003, angle: 0, radius: 6, color: "#dfc17a" },
      { a: 170, b: 110, speed: 0.002, angle: 1.2, radius: 9, color: "#87ceeb" },
      { a: 240, b: 160, speed: 0.0015, angle: 2.5, radius: 11, color: "#f97316" },
      { a: 320, b: 210, speed: 0.001, angle: 3.8, radius: 8, color: "#791d35" },
      { a: 410, b: 270, speed: 0.0007, angle: 5.1, radius: 14, color: "#b58a36" }
    ];

    let animationId = null;
    let isVisible = !document.hidden;

    document.addEventListener("visibilitychange", () => {
      isVisible = !document.hidden;
      if (isVisible && !animationId) {
        animationId = requestAnimationFrame(drawPlanets);
      } else if (!isVisible && animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });

    function drawPlanets() {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      const parallaxX = (mouseX - width / 2) * 0.03;
      const parallaxY = (mouseY - height / 2) * 0.03;

      const centerX = width / 2 + parallaxX;
      const centerY = height / 2 + parallaxY;

      ctx.save();
      ctx.shadowBlur = 30;
      ctx.shadowColor = sun.glowColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sun.radius, 0, Math.PI * 2);
      ctx.fillStyle = sun.color;
      ctx.globalAlpha = 0.35;
      ctx.fill();
      ctx.restore();

      planets.forEach((p) => {
        if (!reducedMotion) {
          p.angle += p.speed;
        }

        const x = centerX + p.a * Math.cos(p.angle);
        const y = centerY + p.b * Math.sin(p.angle);

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, p.a, p.b, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(181, 138, 54, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.35;
        ctx.fill();
        ctx.restore();
      });

      if (isVisible) {
        animationId = requestAnimationFrame(drawPlanets);
      }
    }

    animationId = requestAnimationFrame(drawPlanets);
  }

  // ==========================================
  // FEATURE 2: 3D SKILLS CAROUSEL
  // ==========================================
  const carouselRing = document.getElementById("skillsCarouselRing");
  const prevSkillBtn = document.querySelector(".skills-carousel-section .prev-btn");
  const nextSkillBtn = document.querySelector(".skills-carousel-section .next-btn");
  const carouselSection = document.querySelector(".skills-carousel-section");

  if (carouselRing) {
    let currentAngle = 0;
    const totalCards = 4;
    const angleStep = 360 / totalCards;
    let autoRotateInterval = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function updateCarousel() {
      carouselRing.style.transform = `rotateY(${currentAngle}deg)`;
    }

    function rotateNext() {
      currentAngle -= angleStep;
      updateCarousel();
    }

    function rotatePrev() {
      currentAngle += angleStep;
      updateCarousel();
    }

    if (!reducedMotion) {
      function startAutoRotate() {
        autoRotateInterval = setInterval(rotateNext, 4000);
      }
      function stopAutoRotate() {
        clearInterval(autoRotateInterval);
      }

      startAutoRotate();

      if (carouselSection) {
        carouselSection.addEventListener("mouseenter", stopAutoRotate);
        carouselSection.addEventListener("mouseleave", startAutoRotate);
      }
    }

    if (nextSkillBtn) {
      nextSkillBtn.addEventListener("click", () => {
        rotateNext();
      });
    }

    if (prevSkillBtn) {
      prevSkillBtn.addEventListener("click", () => {
        rotatePrev();
      });
    }
  }

  const form = document.getElementById("registrationForm");
  const formMessage = document.getElementById("formMessage");
  const cursorGlow = document.querySelector(".cursor-glow");

  // ==========================================
  // 1. CURSOR-REACTIVE BACKGROUND GLOW
  // ==========================================
  if (cursorGlow && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursorGlow() {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(updateCursorGlow);
    }
    requestAnimationFrame(updateCursorGlow);
  }

  // ==========================================
  // 2. NAME INPUT "FALLING LETTERS" PHYSICS
  // ==========================================
  const fullNameInput = document.getElementById("fullName");
  const fallingPreview = document.getElementById("fallingLettersPreview");

  if (fullNameInput && fallingPreview) {
    fullNameInput.addEventListener("input", function () {
      const val = fullNameInput.value;
      fallingPreview.innerHTML = "";

      for (let i = 0; i < val.length; i++) {
        const span = document.createElement("span");
        span.classList.add("falling-letter");
        span.textContent = val[i] === " " ? "\u00A0" : val[i];
        span.style.animationDelay = `${i * 0.03}s`;
        fallingPreview.appendChild(span);
      }
    });
  }

  // ==========================================
  // 3. AMBIENT CLOCK WITH MOUSE PURSUING EFFECT
  // ==========================================
  const timeInput = document.getElementById("timeOfBirth");
  const timeSkyWidget = document.getElementById("timeSkyWidget");
  const hourHand = document.getElementById("hourHand");
  const minuteHand = document.getElementById("minuteHand");
  const clockFace = document.querySelector(".ambient-clock");
  const clockAura = document.querySelector(".clock-ambient-aura");

  if (timeSkyWidget && clockFace && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    timeSkyWidget.addEventListener("mousemove", (e) => {
      const rect = timeSkyWidget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Subtle 3D tilt and magnetic pursuing effect
      clockFace.style.transform = `perspective(300px) rotateY(${x * 0.05}deg) rotateX(${ -y * 0.05 }deg) scale(1.03)`;
      if (clockAura) {
        clockAura.style.transform = `translate(calc(-50% + ${x * 0.15}px), calc(-50% + ${y * 0.15}px))`;
      }
    });

    timeSkyWidget.addEventListener("mouseleave", () => {
      clockFace.style.transform = "perspective(300px) rotateY(0deg) rotateX(0deg) scale(1)";
      if (clockAura) {
        clockAura.style.transform = "translate(-50%, -50%)";
      }
    });
  }

  // Time Sky & Clock Hand Updates
  function updateTimeWidget() {
    if (!timeInput) return;
    const val = timeInput.value;
    if (!val) {
      if (timeSkyWidget) timeSkyWidget.className = "time-sky-widget sky-neutral ambient-clock-container";
      if (hourHand) hourHand.style.transform = "translateX(-50%) rotate(0deg)";
      if (minuteHand) minuteHand.style.transform = "translateX(-50%) rotate(0deg)";
      return;
    }

    const [hoursStr, minutesStr] = val.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    const minuteDegrees = minutes * 6;
    const hourDegrees = (hours % 12) * 30 + (minutes / 60) * 30;

    if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourDegrees}deg)`;
    if (minuteHand) minuteHand.style.transform = `translateX(-50%) rotate(${minuteDegrees}deg)`;

    if (timeSkyWidget) {
      timeSkyWidget.classList.remove("sky-neutral", "sky-day", "sky-sunset", "sky-night");
      if (hours >= 6 && hours < 17) {
        timeSkyWidget.classList.add("sky-day");
      } else if (hours >= 17 && hours < 19) {
        timeSkyWidget.classList.add("sky-sunset");
      } else {
        timeSkyWidget.classList.add("sky-night");
      }
    }
  }

  if (timeInput) {
    timeInput.addEventListener("input", updateTimeWidget);
    timeInput.addEventListener("change", updateTimeWidget);
    if (timeInput.value) updateTimeWidget();
  }

  // ==========================================
  // 4. CALENDAR WITH 3D FLIP & MICRO-INTERACTIONS
  // ==========================================
  const dobInput = document.getElementById("dateOfBirth");
  const calendarPopup = document.getElementById("calendarPopup");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");
  const closeCalendarBtn = document.getElementById("closeCalendar");
  const monthYearEl = document.getElementById("calendarMonthYear");
  const daysContainer = document.getElementById("calendarDays");

  if (dobInput && calendarPopup) {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    if (dobInput.value) {
      const parts = dobInput.value.split("-");
      if (parts.length === 3) {
        currentYear = parseInt(parts[0], 10);
        currentMonth = parseInt(parts[1], 10) - 1;
      }
    }

    function updateSeasonalClass(monthIndex) {
      calendarPopup.classList.remove("season-spring", "season-summer", "season-monsoon", "season-winter");
      if (monthIndex >= 2 && monthIndex <= 4) calendarPopup.classList.add("season-spring");
      else if (monthIndex >= 5 && monthIndex <= 7) calendarPopup.classList.add("season-summer");
      else if (monthIndex >= 8 && monthIndex <= 10) calendarPopup.classList.add("season-monsoon");
      else calendarPopup.classList.add("season-winter");
    }

    function renderCalendar(year, month, animate = false) {
      daysContainer.innerHTML = "";
      const firstDayIndex = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();

      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      if (monthYearEl) monthYearEl.textContent = `${monthNames[month]} ${year}`;
      updateSeasonalClass(month);

      if (animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        daysContainer.classList.add("flip-3d");
        setTimeout(() => daysContainer.classList.remove("flip-3d"), 400);
      }

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

        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
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
      renderCalendar(currentYear, currentMonth, false);
      calendarPopup.hidden = false;
    });

    dobInput.addEventListener("click", function () {
      renderCalendar(currentYear, currentMonth, false);
      calendarPopup.hidden = false;
    });

    if (closeCalendarBtn) {
      closeCalendarBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        calendarPopup.hidden = true;
      });
    }

    if (prevMonthBtn) {
      prevMonthBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        renderCalendar(currentYear, currentMonth, true);
      });
    }

    if (nextMonthBtn) {
      nextMonthBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        renderCalendar(currentYear, currentMonth, true);
      });
    }

    document.addEventListener("click", (e) => {
      if (!calendarPopup.contains(e.target) && e.target !== dobInput) {
        calendarPopup.hidden = true;
      }
    });
  }

  // ==========================================
  // 5. FLOATING SKILL BUBBLES PHYSICS
  // ==========================================
  const bubbles = document.querySelectorAll(".skill-bubble");
  if (bubbles.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const bubbleData = Array.from(bubbles).map((bubble, index) => {
      const size = 125;
      let x = (index * (window.innerWidth / 4)) % Math.max(100, window.innerWidth - size);
      let y = 60 + (index * 90) % Math.max(100, window.innerHeight - size - 120);

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 0.4;
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

        if (b.x <= 0) { b.x = 0; b.vx = -b.vx; }
        else if (b.x + b.size >= maxX) { b.x = maxX - b.size; b.vx = -b.vx; }

        if (b.y <= 0) { b.y = 0; b.vy = -b.vy; }
        else if (b.y + b.size >= maxY) { b.y = maxY - b.size; b.vy = -b.vy; }

        b.element.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
      });

      requestAnimationFrame(animateBubbles);
    }
    requestAnimationFrame(animateBubbles);
  }

  // ==========================================
  // 6. FORM SUBMISSION LOGIC
  // ==========================================
  if (form) {
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
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(registrationData)
        });

        formMessage.textContent = "Your registration request has been sent. Please wait while we verify it.";
        form.reset();
        if (fallingPreview) fallingPreview.innerHTML = "";
      } catch (error) {
        console.error("Registration submission error:", error);
        formMessage.textContent = "We could not send your registration. Please check your internet connection and try again.";
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Registration";
      }
    });
  }
});
