const pool = require('../db');

exports.submitForm = (req, res) => {
    const { name } = req.body; // Assuming you have a 'name' field in your form
    const query = "INSERT INTO `names` (name) VALUES (?)";
    pool.query(query, [name], (error, results) => {
        if (error) throw error;
        console.log("1 record inserted");
        res.redirect('/'); // Redirect back to home page after successful insertion
    });
};