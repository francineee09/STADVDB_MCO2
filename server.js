const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
require('dotenv').config();

const app = express();

// controllers
const indexControl = require("./controllers/indexControl");
const formControl = require("./controllers/formControl");
const reportControl = require("./controllers/reportControl");

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

app.get('/', indexControl.showHome);
app.post('/insert', formControl.insertForm);
app.post('/update', formControl.updateForm);
app.post('/delete', formControl.deleteForm);
app.post('/search',formControl.searchForm);
app.post('/genHospi', reportControl.renderTopHospital);
app.post('/genCity', reportControl.renderTopCity);
app.post('/genSpec', reportControl.renderTopSpecialization);

// Run server
// webpage at http://localhost:3000/
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});