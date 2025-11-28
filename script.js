let selectedFile = null;

window.onload = () => {
  console.log('Site loaded - JS is working!');
  const token = localStorage.getItem("zepeto_token");
  if (token) {
    console.log('Token found, showing upload screen');
    document.getElementById("upload-screen").classList.remove("hidden");
    document.getElementById("login-screen").classList.add("hidden");
    setupUploadZone();
  } else {
    console.log('No token, showing login');
    document.getElementById("login-screen").classList.remove("hidden");
  }
  document.getElementById("test-btn").onclick = () => {
    console.log('Test button clicked - everything is connected!');
    alert('JS is working! Check browser console for more logs.');
  };
};

function setupUploadZone() {
  const gifInput = document.getElementById("gif-input");
  const previewImg = document.getElementById("preview-img");
  const uploadBtn = document.getElementById("upload-btn");
  const status = document.getElementById("status");

  gifInput.onchange = (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "image/gif") {
      console.log('GIF selected:', selectedFile.name);
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
  console.log('Login button clicked');
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const status = document.getElementById("status");

  if (!username || !password) {
    status.textContent = "Please enter username/email and password";
    status.style.color = "#ff6b6b";
    console.log('Missing credentials');
    return;
  }

  status.textContent = "Logging in...";
  status.style.color = "#fff";
  console.log('Attempting login for:', username);

  try {
    const res = await fetch("https://global.zepeto.me/v1/account/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "User-Agent": "ZEPETO/7.0.0 (iOS; iPhone; iOS 17.0)"
      },
      body: JSON.stringify({ 
        id: username, 
        password: password,
        device_id: "test-device-123",
        os: "web"
      })
    });

    console.log('Login response status:', res.status);
    const data = await res.json();
    console.log('Login response data:', data);

    if (data.access_token || data.token) {
      const token = data.access_token || data.token;
      localStorage.setItem("zepeto_token", token);
      document.getElementById("login-screen").classList.add("hidden");
      setupUploadZone();
      status.textContent = "Login successful! Choose your GIF";
      status.style.color = "#90EE90";
      console.log('Login success, token saved');
    } else {
      status.textContent = "Wrong username/email or password (check console)";
      status.style.color = "#ff6b6b";
      console.log('Login failed - no token in response');
    }
  } catch (error) {
    console.error('Login error:', error);
    status.textContent = "Login failed: " + error.message + " (check console)";
    status.style.color = "#ff6b6b";
  }
};

async function uploadGIF(file, statusEl) {
  if (!file) return;
  const token = localStorage.getItem("zepeto_token");
  statusEl.textContent = "Uploading your GIF...";
  statusEl.style.color = "#fff";
  console.log('Starting upload with token:', token ? 'present' : 'missing');

  const form = new FormData();
  form.append("file", file);
  form.append("type", "profile_picture");

  try {
    const res = await fetch("https://global.zepeto.me/v3/user/me/avatar", {
      method: "POST",
      headers: { 
        "Authorization": "Bearer " + token,
        "User-Agent": "ZEPETO/7.0.0 (iOS; iPhone; iOS 17.0)"
      },
      body: form
    });

    console.log('Upload response status:', res.status);
    if (res.ok || res.status === 204) {
      statusEl.textContent = "Success! Refresh Zepeto app now 🎉";
      statusEl.style.color = "#90EE90";
      console.log('Upload success');
    } else {
      const errData = await res.json();
      console.log('Upload error data:', errData);
      statusEl.textContent = "Upload failed: " + (errData.message || 'Try again');
      statusEl.style.color = "#ff6b6b";
    }
  } catch (error) {
    console.error('Upload error:', error);
    statusEl.textContent = "Upload error: " + error.message;
    statusEl.style.color = "#ff6b6b";
  }
}
