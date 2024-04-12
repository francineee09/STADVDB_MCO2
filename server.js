const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
require('dotenv').config();

const app = express();

// controllers
const indexControl = require("./controllers/indexControl");
const formControl = require("./controllers/formControl");

// Constants
const PORT = process.env.SERVER_PORT;

// Configure middleware
app.use(express.static(path.join(__dirname, 'public'))) // Allow express to serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('hbs', hbs.engine({extname:'hbs'}));
app.set('view engine', 'hbs');
app.set('views', './views');

// app.get('/', (req, res) => {
//     // Render static html file (temporary)
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
//     res.render('index');
// })

// render index
app.get('/', indexControl.showHome);
app.post('/insert', formControl.insertForm);
app.post('/update', formControl.updateForm);
app.post('/delete', formControl.deleteForm);
app.post('/search',formControl.searchForm);

// Run server
// webpage at http://localhost:3000/
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});