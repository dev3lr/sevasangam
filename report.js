let userPhone = "";

// Step 1: Login
function loginUser() {
  const phone = document.getElementById("phoneInput").value.trim();

  if (phone.length < 10) {
    alert("Enter a valid phone number");
    return;
  }

  userPhone = phone;

  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("reportBox").classList.remove("hidden");
}

// Step 2: Submit Report
function submitReport() {
  const report = {
    issue: document.getElementById("issue").value,
    location: document.getElementById("location").value,
    date: document.getElementById("date").value,
    phone: userPhone,
    email: document.getElementById("email").value,
    support: document.getElementById("support").value,
    status: "Reported",
    assignedNgo: "NA",
    timestamp: new Date().toISOString()
  };

  if (!report.issue || !report.location || !report.date) {
    alert("Please fill all required fields");
    return;
  }

  let reports = JSON.parse(localStorage.getItem("reports")) || [];
  reports.push(report);
  localStorage.setItem("reports", JSON.stringify(reports));

  alert("Report submitted successfully!");

  window.location.href = "index.html";
}


  console.log("Report Submitted:", report);

  alert("Report submitted successfully!");

  // Later: push to Firebase

