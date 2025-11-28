const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fileUpload = require('express-fileupload');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(fileUpload());
app.use(express.static('.')); // serves your index.html

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const loginRes = await axios.post('https://id.zepeto.me/api/v2/account/login', {
      id: username,
      password: password,
      device_id: 'web-' + Date.now(),
      os_type: 'web'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
      }
    });

    const token = loginRes.data.access_token || loginRes.data.token;
    if (!token) throw new Error("No token received");

    res.json({ success: true, token });
  } catch (e) {
    console.log("Login error:", e.response?.data || e.message);
    res.json({ success: false, message: "Wrong username or password" });
  }
});

app.post('/upload', async (req, res) => {
  try {
    const token = req.body.token;
    const gif = req.files.gif;

    const form = new FormData();
    form.append('file', gif.data, { filename: 'profile.gif', contentType: 'image/gif' });

    await axios.post('https://global.zepeto.me/v3/user/me/profile-picture', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'ZEPETO/999.999.999'
      }
    });

    res.json({ success: true });
  } catch (e) {
    console.log("Upload error:", e.response?.data || e.message);
    res.json({ success: false, message: "Upload failed – try again" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Zepeto GIF Proxy running on port', port);
});
