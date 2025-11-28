let selectedFile = null;

window.onload = () => {
  const token = localStorage.getItem("zepeto_token");
  if (token) {
    document.getElementById("upload-screen").classList.remove("hidden");
    document.getElementById("login-screen").classList.add("hidden");
    setupUploadZone();
  } else {
    document.getElementById("login-screen").classList.remove("hidden");
  }
};

function setupUploadZone() {
  document.getElementById("upload-screen").classList.remove("hidden");

  const gifInput = document.getElementById("gif-input");
  const previewImg = document.getElementById("preview-img");
  const uploadBtn = document.getElementById("upload-btn");
  const status = document.getElementById("status");

  gifInput.onchange = (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "image/gif") {
      previewImg.src = URL.createObjectURL(selectedFile);
      uploadBtn.disabled = false;
    }
  };

  uploadBtn.onclick = () => uploadGIF(selectedFile, status);
  document.getElementById("logout-btn").onclick = () => {
    localStorage.removeItem("zepeto_token");
    location.reload();
  };
}

document.getElementById("login-btn").onclick = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const status = document.getElementById("status");

  if (!username || !password) {
    status.textContent = "Please enter username and password";
    return;
  }

  status.textContent = "Logging in...";

  try {
    const res = await fetch("https://api-global.zepeto.me/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: username, password: password })
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem("zepeto_token", data.access_token);
      document.getElementById("login-screen").classList.add("hidden");
      setupUploadZone();
      status.textContent = "Login successful! Choose your GIF";
      status.style.color = "#90EE90";
    } else {
      status.textContent = "Wrong username or password";
      status.style.color = "#ff6b6b";
    }
  } catch (e) {
    status.textContent = "Login failed – check internet";
    status.style.color = "#ff6b6b";
  }
};

async function uploadGIF(file, statusEl) {
  if (!file) return;
  const token = localStorage.getItem("zepeto_token");
  statusEl.textContent = "Uploading your GIF...";
  statusEl.style.color = "#fff";

  const form = new FormData();
  form.append("file", file);

  try {
    const res = await fetch("https://api-global.zepeto.me/v3/user/me/profile-picture", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token },
      body: form
    });

    if (res.ok || res.status === 204) {
      statusEl.textContent = "Success! Refresh Zepeto app now";
      statusEl.style.color = "#90EE90";
    } else {
      statusEl.textContent = "Upload failed – try logging in again";
      statusEl.style.color = "#ff6b6b";
    }
  } catch (e) {
    statusEl.textContent = "Network error";
    statusEl.style.color = "#ff6b6b";
  }
}
