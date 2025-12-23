function ngoLogin() {
    const ngo = document.getElementById("ngoUser").value.trim();
    const pass = document.getElementById("ngoPass").value.trim();
  
    // TEMP NGO CREDENTIALS (MOVE TO FIREBASE LATER)
    const ngos = {
      "Seva Foundation": "seva123",
      "Animal Care Trust": "animal123",
      "RoadCare NGO": "road123"
    };
  
    if (!ngos[ngo] || ngos[ngo] !== pass) {
      alert("Invalid NGO credentials");
      return;
    }
  
    localStorage.setItem("loggedInNgo", ngo);
    window.location.href = "ngo.html";
  }
  