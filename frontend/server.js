const path = require('path');
const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Read `config.json` dynamically
const configPath = path.join(__dirname, 'web_app', 'config.json');
let SERVER_IP = 'localhost'; // Default fallback

if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    SERVER_IP = config.SERVER_IP || 'localhost';
}

// Serve static files from `web_app`
app.use(express.static(path.join(__dirname, 'web_app')));

// Serve login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web_app', 'templates', 'login.html'));
});

// Serve addData.html
app.get('/addData', (req, res) => {
    res.sendFile(path.join(__dirname, 'web_app', 'templates', 'addData.html'));
});

// Serve `config.json` explicitly
app.get('/config.json', (req, res) => {
    res.sendFile(configPath);
});

// Start the server and log correct public IP
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at ${SERVER_IP}:${PORT}`);
});
