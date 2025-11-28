const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fileUpload = require('express-fileupload');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(fileUpload());
app.use(express.static('.'));

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const login = await axios.post('https://id.zepeto.me/api/v2/account/login', {
      id: username,
      password: password,
      device_id: 'web-' + Date.now()
    });
    const token = login.data.access_token || login.data.token;
    res.json({ success: true, token });
  } catch (e) {
    res.json({ success: false, message: "Wrong username or password" });
  }
});

app.post('/upload', async (req, res) => {
  try {
    const token = req.body.token;
    const gif = req.files.gif;
    const form = new FormData();
    form.append('file', gif.data, 'pfp.gif');

    await axios.post('https://global.zepeto.me/v3/user/me/profile-picture', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, message: "Upload failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Proxy running'));
