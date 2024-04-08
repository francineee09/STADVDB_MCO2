const express = require('express');
const path = require('path');
const hbs = require('hbs');
require('dotenv').config();

const app = express();

// Constants
const PORT = process.env.SERVER_PORT;

// Configure middleware
app.use(express.static(path.join(__dirname, 'public'))) // Allow express to serve static files

app.get('/', (req, res) => {
    // Render static html file (temporary)
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// Run server
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});