alert("JS IS WORKING! Site ready.");

let file = null;

document.getElementById("login-btn").onclick = () => {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value;
  if (!u || !p) {
    document.getElementById("status").textContent = "Enter username & password";
    return;
  }
  document.getElementById("status").textContent = "This version works — full one coming after this test";
};

document.getElementById("gif-input").onchange = (e) => {
  file = e.target.files[0];
  if (file) {
    document.getElementById("preview-img").src = URL.createObjectURL(file);
    document.getElementById("upload-btn").disabled = false;
  }
};

document.getElementById("upload-btn").onclick = () => {
  if (file) alert("Upload would work now — full version ready!");
};
