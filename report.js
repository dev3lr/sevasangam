/* ===============================
   REPORT FLOW – SEVASANGAM
=============================== */

let userPhone = "";
let reportImageBase64 = "";

/* ===============================
   STEP 1: PHONE LOGIN
=============================== */
function loginUser() {
  const phoneInput = document.getElementById("phoneInput");
  const errorBox = document.getElementById("phoneError");

  const phone = phoneInput.value.trim();
  errorBox.classList.add("hidden");

  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(phone)) {
    errorBox.textContent = "Please enter a valid 10-digit mobile number.";
    errorBox.classList.remove("hidden");
    return;
  }

  userPhone = phone;

  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("reportBox").classList.remove("hidden");
}

/* ===============================
   STEP 2: SUBMIT REPORT
=============================== */
function submitReport() {
  const errorBox = document.getElementById("reportError");
  errorBox.classList.add("hidden");

  const issue = document.getElementById("issue").value.trim();
  const location = document.getElementById("location").value.trim();
  const dateValue = document.getElementById("date").value;
  const email = document.getElementById("email").value.trim();
  const support = document.getElementById("support").value.trim();

  if (!issue || !location || !dateValue) {
    errorBox.textContent = "Please fill all required fields.";
    errorBox.classList.remove("hidden");
    return;
  }

  /* ================= DATE VALIDATION (TIMEZONE SAFE) ================= */

  function localDateString(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  const todayStr = localDateString(0);
  const sevenDaysAgoStr = localDateString(-7);

  if (dateValue > todayStr) {
    errorBox.textContent = "Future incidents cannot be reported.";
    errorBox.classList.remove("hidden");
    return;
  }

  if (dateValue < sevenDaysAgoStr) {
    errorBox.textContent = "You can only report incidents from the last 7 days.";
    errorBox.classList.remove("hidden");
    return;
  }

  /* ================= CREATE REPORT ================= */
  const report = {
    issue,
    location,
    date: dateValue,
    phone: userPhone,
    email,
    support,
    image: reportImageBase64 || null,
    status: "Reported",
    assignedNgo: "NA",
    ngoRequests: [],
    timestamp: new Date().toISOString()
  };

  /* ================= SAVE ================= */
  const reports = JSON.parse(localStorage.getItem("reports")) || [];
  reports.push(report);
  localStorage.setItem("reports", JSON.stringify(reports));

  window.location.href = "index.html";
}

/* ===============================
   IMAGE HANDLING
=============================== */
document.getElementById("reportImage").addEventListener("change", function () {
  const file = this.files[0];
  const errorBox = document.getElementById("reportError");

  if (!file) return;

  // Max 2MB image
  if (file.size > 2 * 1024 * 1024) {
    errorBox.textContent = "Image size should be under 2MB.";
    errorBox.classList.remove("hidden");
    this.value = "";
    reportImageBase64 = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    reportImageBase64 = e.target.result;

    const preview = document.getElementById("imagePreview");
    preview.src = reportImageBase64;
    preview.classList.remove("hidden");
  };

  reader.readAsDataURL(file);
});

/* ===============================
   UX POLISH – AUTO HIDE ERRORS
=============================== */
document.addEventListener("input", () => {
  const phoneError = document.getElementById("phoneError");
  const reportError = document.getElementById("reportError");

  if (phoneError) phoneError.classList.add("hidden");
  if (reportError) reportError.classList.add("hidden");
});
