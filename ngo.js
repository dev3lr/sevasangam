/* ===============================
   NGO DASHBOARD – SEVASANGAM
=============================== */

const ngoName = localStorage.getItem("loggedInNgo");

if (!ngoName) {
  window.location.href = "ngo-login.html";
}

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

  // Keep original index reference
  const openReports = reports
    .map((report, index) => ({ report, index }))
    .filter(({ report }) => {
      if (report.status === "Assigned") return false;

      if (!report.ngoRequests || report.ngoRequests.length === 0) return true;

      const alreadyRequested = report.ngoRequests.some(
        req => req.ngoName === ngoName
      );

      return !alreadyRequested;
    });

  if (openReports.length === 0) {
    openDiv.innerHTML = "<p>No open reports available.</p>";
    return;
  }

  openReports.forEach(({ report, index }) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h4>${report.issue}</h4>
      <p><b>Location:</b> ${report.location}</p>
      <p><b>Date:</b> ${report.date || "—"}</p>

      ${
        report.image && report.image.startsWith("data:image")
          ? `
            <div style="margin-top:10px;">
              <p style="font-weight:500;">Attached Image</p>
              <a href="${report.image}" target="_blank">
                <img
                  src="${report.image}"
                  alt="Report Image"
                  style="
                    max-width:100%;
                    max-height:160px;
                    border-radius:8px;
                    border:1px solid #e5e7eb;
                    margin-top:6px;
                  "
                />
              </a>
            </div>
          `
          : ``
      }

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

  const assignedReports = reports
    .map((report, index) => ({ report, index }))
    .filter(({ report }) => report.assignedNgo === ngoName);

  if (assignedReports.length === 0) {
    assignedDiv.innerHTML = "<p>No reports assigned yet.</p>";
    return;
  }

  assignedReports.forEach(({ report, index }) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h4>${report.issue}</h4>
      <p><b>Location:</b> ${report.location}</p>
      <p><b>Status:</b> ${report.status}</p>

      ${
        report.image && report.image.startsWith("data:image")
          ? `
            <div style="margin-top:10px;">
              <p style="font-weight:500;">Attached Image</p>
              <a href="${report.image}" target="_blank">
                <img
                  src="${report.image}"
                  alt="Report Image"
                  style="
                    max-width:100%;
                    max-height:160px;
                    border-radius:8px;
                    border:1px solid #e5e7eb;
                    margin-top:6px;
                  "
                />
              </a>
            </div>
          `
          : ``
      }

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
function requestToHandle(reportIndex) {
  let reports = JSON.parse(localStorage.getItem("reports")) || [];

  if (!reports[reportIndex].ngoRequests) {
    reports[reportIndex].ngoRequests = [];
  }

  reports[reportIndex].ngoRequests.push({
    ngoName: ngoName,
    note: document.getElementById(`requestNote-${reportIndex}`).value
  });

  reports[reportIndex].status = "Requested";

  localStorage.setItem("reports", JSON.stringify(reports));
  loadNgoDashboard();
}

/* ================= STATUS UPDATE ================= */
function updateStatus(reportIndex) {
  let reports = JSON.parse(localStorage.getItem("reports")) || [];

  const status = document.getElementById(`status-${reportIndex}`).value;
  const remark = document.getElementById(`remark-${reportIndex}`).value;

  if (status === "Cannot Complete" && remark.trim() === "") {
    alert("Please provide reason");
    return;
  }

  reports[reportIndex].status = status;
  reports[reportIndex].ngoRemark = remark;
  reports[reportIndex].lastUpdated = new Date().toISOString();

  localStorage.setItem("reports", JSON.stringify(reports));
  loadNgoDashboard();
}
