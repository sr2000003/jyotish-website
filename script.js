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
