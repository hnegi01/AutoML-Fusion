// server.js
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;


// Serve login.html when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web_app', 'templates', 'login.html'));
});

// Serve addData.html when accessing the "/addData" path
app.get('/addData', (req, res) => {
    res.sendFile(path.join(__dirname, 'web_app', 'templates', 'addData.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
