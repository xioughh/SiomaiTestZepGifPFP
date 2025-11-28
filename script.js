const CLIENT_ID = "1000000001";
const REDIRECT_URI = location.origin + location.pathname.replace(/[^\/]+$/, '') + "callback.html";

let selectedFile = null;

// Login button
document.getElementById("login-btn")?.addEventListener("click", () => {
  const authUrl = `https://id.zepeto.me/oauth/authorize?client_id=\( {CLIENT_ID}&redirect_uri= \){encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=openid+profile+user.info`;
  location.href = authUrl;
});

// Handle OAuth callback
if (location.pathname.includes("callback.html") && location.hash) {
  const token = new URLSearchParams(location.hash.substring(1)).get("access_token");
  if (token) {
    localStorage.setItem("zepeto_token", token);
    history.replaceState({}, "", location.origin + location.pathname.split("/").pop());
    location.href = location.origin + location.pathname.replace("callback.html", "");
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
    selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "image/gif") {
      previewImg.src = URL.createObjectURL(selectedFile);
      uploadBtn.disabled = false;
    }
  };

  uploadBtn.onclick = () => uploadGIF(selectedFile, token, status);
};

async function uploadGIF(file, token, statusEl) {
  if (!file) return;
  statusEl.textContent = "Uploading…";
  statusEl.style.color = "#fff";

  const form = new FormData();
  form.append("file", file);

  try {
    const res = await fetch("https://api-global.zepeto.me/v3/user/me/profile-picture", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Origin": "https://id.zepeto.me",
        "Referer": "https://id.zepeto.me/"
      },
      body: form
    });

    if (res.ok || res.status === 204) {
      statusEl.textContent = "Success! Refresh Zepeto app now";
      statusEl.style.color = "#90EE90";
    } else {
      statusEl.textContent = "Failed – token expired or Zepeto patched it";
      statusEl.style.color = "#ff6b6b";
    }
  } catch (e) {
    statusEl.textContent = "Network error – try again";
    statusEl.style.color = "#ff6b6b";
  }
}      selectedFile = file;
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
