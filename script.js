const CLIENT_ID = "1000000001";
const REDIRECT_URI = location.origin + "/callback.html";

document.getElementById("login-btn")?.addEventListener("click", () => {
  const authUrl = `https://accounts.zepeto.me/oauth/authorize?client_id=\( {CLIENT_ID}&redirect_uri= \){encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=profile`;
  location.href = authUrl;
});

// Handle callback after login
if (location.pathname.includes("callback.html") && location.hash) {
  const token = new URLSearchParams(location.hash.substring(1)).get("access_token");
  if (token) {
    localStorage.setItem("zepeto_token", token);
    location.href = location.origin;
  }
}

// Main app
window.onload = () => {
  const token = localStorage.getItem("zepeto_token");
  if (!token) {
    document.getElementById("login-screen").classList.remove("hidden");
    return;
  }
  document.getElementById("upload-screen").classList.remove("hidden");

  const gifInput = document.getElementById("gif-input");
  const previewImg = document.getElementById("preview-img");
  const uploadBtn = document.getElementById("upload-btn");
  const status = document.getElementById("status");

  gifInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/gif") {
      previewImg.src = URL.createObjectURL(file);
      uploadBtn.disabled = false;
      selectedFile = file;
    }
  };

  uploadBtn.onclick = () => uploadGIF(selectedFile, token, status);
};

let selectedFile;
async function uploadGIF(file, token, statusEl) {
  statusEl.textContent = "Uploading...";
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("https://api.zepeto.me/v3/user/me/profile-picture", {
    method: "POST",
    headers: { "Authorization": "Bearer " + token },
    body: form
  });

  if (res.ok) {
    statusEl.textContent = "Success! Refresh Zepeto app now 🎉";
    statusEl.style.color = "#90EE90";
  } else {
    statusEl.textContent = "Failed – token expired or GIF too big";
    statusEl.style.color = "#ff6b6b";
  }
}
