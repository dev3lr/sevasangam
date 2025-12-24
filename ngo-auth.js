function ngoLogin() {
  const user = document.getElementById("ngoUser").value.trim();
  const pass = document.getElementById("ngoPass").value.trim();

  /* ================= SECRET ADMIN CREDENTIALS =================
     (NO UI INDICATION, NO LABEL, NO HINT)
  =============================================================== */
  const SECRET_ADMIN_USER = "admin";
  const SECRET_ADMIN_PASS = "admin@sevasangam";

  /* ================= NGO CREDENTIALS ================= */
  const ngos = {
    "Seva Foundation": "seva123",
    "Animal Care Trust": "animal123",
    "RoadCare NGO": "road123"
  };

  /* ================= SILENT ADMIN LOGIN ================= */
  if (user === SECRET_ADMIN_USER && pass === SECRET_ADMIN_PASS) {
    localStorage.setItem("isAdminLoggedIn", "true");
    localStorage.removeItem("loggedInNgo"); // ensure clean state
    window.location.href = "admin.html";
    return;
  }

  /* ================= NGO LOGIN ================= */
  if (ngos[user] && ngos[user] === pass) {
    localStorage.setItem("loggedInNgo", user);
    localStorage.removeItem("isAdminLoggedIn");
    window.location.href = "ngo.html";
    return;
  }

  /* ================= INVALID ================= */
  alert("Invalid credentials");
}
