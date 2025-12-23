/* ===============================
   ADMIN PANEL – SEVASANGAM
=============================== */

const adminReportsDiv = document.getElementById("adminReports");

let reports = JSON.parse(localStorage.getItem("reports")) || [];

renderAdminReports();

/* ===============================
   RENDER REPORTS
=============================== */
function renderAdminReports() {
  adminReportsDiv.innerHTML = "";

  if (reports.length === 0) {
    adminReportsDiv.innerHTML = "<p>No reports available.</p>";
    return;
  }

  reports.forEach((report, reportIndex) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${report.issue}</h3>
      <p><b>Location:</b> ${report.location}</p>
      <p><b>Date:</b> ${report.date || "—"}</p>
      <p><b>Status:</b> ${report.status}</p>
      <p><b>Assigned NGO:</b> ${report.assignedNgo || "NA"}</p>

      <div style="margin-top:10px;">
        <button class="btn-outline"
          style="border-color:#dc2626;color:#dc2626;"
          onclick="deleteReport(${reportIndex})">
          Delete Report
        </button>
      </div>

      <hr style="margin:16px 0;">

      ${renderNgoRequests(report, reportIndex)}
    `;

    adminReportsDiv.appendChild(card);
  });
}

/* ===============================
   NGO REQUESTS UI
=============================== */
function renderNgoRequests(report, reportIndex) {
  if (!report.ngoRequests || report.ngoRequests.length === 0) {
    return `<p><i>No NGO requests.</i></p>`;
  }

  let html = `<h4>NGO Requests</h4><ul style="padding-left:16px;">`;

  report.ngoRequests.forEach((req, reqIndex) => {
    html += `
      <li style="margin-bottom:14px;">
        <b>${req.ngoName}</b><br>
        <small>${req.note || "No note provided"}</small><br><br>

        <button class="btn-primary"
          onclick="approveNgo(${reportIndex}, ${reqIndex})">
          Approve
        </button>

        <button class="btn-outline"
          style="margin-left:8px;"
          onclick="rejectNgo(${reportIndex}, ${reqIndex})">
          Reject
        </button>

        <button class="btn-outline"
          style="margin-left:8px;border-color:#dc2626;color:#dc2626;"
          onclick="deleteNgoRequest(${reportIndex}, ${reqIndex})">
          Delete Request
        </button>
      </li>
    `;
  });

  html += `</ul>`;
  return html;
}

/* ===============================
   APPROVE NGO
=============================== */
function approveNgo(reportIndex, reqIndex) {
  reports[reportIndex].assignedNgo =
    reports[reportIndex].ngoRequests[reqIndex].ngoName;

  reports[reportIndex].status = "Assigned";
  reports[reportIndex].ngoRequests = [];

  persist();
  alert("NGO approved and assigned");
}

/* ===============================
   REJECT NGO REQUEST
=============================== */
function rejectNgo(reportIndex, reqIndex) {
  reports[reportIndex].ngoRequests.splice(reqIndex, 1);

  if (reports[reportIndex].ngoRequests.length === 0) {
    reports[reportIndex].status = "Reported";
  }

  persist();
  alert("NGO request rejected");
}

/* ===============================
   DELETE NGO REQUEST (HARD)
=============================== */
function deleteNgoRequest(reportIndex, reqIndex) {
  if (!confirm("Delete this NGO request?")) return;

  reports[reportIndex].ngoRequests.splice(reqIndex, 1);

  if (reports[reportIndex].ngoRequests.length === 0) {
    reports[reportIndex].status = "Reported";
  }

  persist();
  alert("NGO request deleted");
}

/* ===============================
   DELETE ENTIRE REPORT
=============================== */
function deleteReport(reportIndex) {
  if (!confirm("Delete this entire report permanently?")) return;

  reports.splice(reportIndex, 1);

  persist();
  alert("Report deleted");
}

/* ===============================
   SAVE & RERENDER
=============================== */
function persist() {
  localStorage.setItem("reports", JSON.stringify(reports));
  reports = JSON.parse(localStorage.getItem("reports")) || [];
  renderAdminReports();
}
