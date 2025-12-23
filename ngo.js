/* ===============================
   NGO DASHBOARD – SEVASANGAM
=============================== */

const ngoName = localStorage.getItem("loggedInNgo");
document.getElementById("ngoName").innerText = ngoName;

loadNgoDashboard();

/* ================= LOAD DASHBOARD ================= */
function loadNgoDashboard() {
  const reports = JSON.parse(localStorage.getItem("reports")) || [];

  loadOpenReports(reports);
  loadAssignedReports(reports);
}

/* ================= OPEN REPORTS ================= */
function loadOpenReports(reports) {
  const openDiv = document.getElementById("openReports");
  openDiv.innerHTML = "";

  const openReports = reports.filter(report => {
    // Already assigned → not open
    if (report.status === "Assigned") return false;

    // No requests yet → open
    if (!report.ngoRequests || report.ngoRequests.length === 0) return true;

    // This NGO already requested → hide
    const alreadyRequested = report.ngoRequests.some(
      req => req.ngoName === ngoName
    );

    return !alreadyRequested;
  });

  if (openReports.length === 0) {
    openDiv.innerHTML = "<p>No open reports available.</p>";
    return;
  }

  openReports.forEach((report, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h4>${report.issue}</h4>
      <p><b>Location:</b> ${report.location}</p>
      <p><b>Date:</b> ${report.date || "—"}</p>

      <textarea id="requestNote-${index}"
        placeholder="Why your NGO can handle this report"></textarea>

      <button class="btn-outline"
        onclick="requestToHandle(${index})">
        Request to Handle
      </button>
    `;

    openDiv.appendChild(card);
  });
}

/* ================= ASSIGNED REPORTS ================= */
function loadAssignedReports(reports) {
  const assignedDiv = document.getElementById("assignedReports");
  assignedDiv.innerHTML = "";

  const assignedReports = reports.filter(
    r => r.assignedNgo === ngoName
  );

  if (assignedReports.length === 0) {
    assignedDiv.innerHTML = "<p>No reports assigned yet.</p>";
    return;
  }

  assignedReports.forEach((report, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h4>${report.issue}</h4>
      <p><b>Location:</b> ${report.location}</p>
      <p><b>Status:</b> ${report.status}</p>

      <label>Update Status</label>
      <select id="status-${index}">
        <option>In Progress</option>
        <option>Resolved</option>
        <option>Cannot Complete</option>
      </select>

      <textarea id="remark-${index}"
        placeholder="Remarks / Reason (required if Cannot Complete)">
      </textarea>

      <button class="btn-primary"
        onclick="updateStatus(${index})">
        Update Status
      </button>
    `;

    assignedDiv.appendChild(card);
  });
}

/* ================= NGO REQUEST ================= */
function requestToHandle(index) {
  let reports = JSON.parse(localStorage.getItem("reports")) || [];

  if (!reports[index].ngoRequests) {
    reports[index].ngoRequests = [];
  }

  reports[index].ngoRequests.push({
    ngoName: ngoName,
    note: document.getElementById(`requestNote-${index}`).value
  });

  reports[index].status = "Requested";

  localStorage.setItem("reports", JSON.stringify(reports));

  alert("Request sent to admin for approval");
  loadNgoDashboard();
}

/* ================= STATUS UPDATE ================= */
function updateStatus(index) {
  let reports = JSON.parse(localStorage.getItem("reports")) || [];

  const assignedReports = reports.filter(
    r => r.assignedNgo === ngoName
  );

  const status = document.getElementById(`status-${index}`).value;
  const remark = document.getElementById(`remark-${index}`).value;

  if (status === "Cannot Complete" && remark.trim() === "") {
    alert("Please provide reason");
    return;
  }

  assignedReports[index].status = status;
  assignedReports[index].ngoRemark = remark;
  assignedReports[index].lastUpdated = new Date().toISOString();

  localStorage.setItem("reports", JSON.stringify(reports));

  alert("Report updated successfully");
  loadNgoDashboard();
}
