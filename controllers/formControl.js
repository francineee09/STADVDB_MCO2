const pool = require('../public/db');

const formControl = {

    async submitForm(req, res){

        try{
            const parameters = {apptid, type, queuedate, statuss, pxid, 
                patients_age, gender, doctorid, mainspecialty, 
                clinicid, hospitalname, city, province, regionname, island 
            } = req.body;

            await pool.insertAppointment(parameters.apptid, parameters.type, parameters.queuedate, parameters.statuss, parameters.pxid, 
                parameters.patients_age, parameters.gender, parameters.doctorid, parameters.mainspecialty, 
                parameters.clinicid, parameters.hospitalname, parameters.city, parameters.province, parameters.regionname, parameters.island);
            console.error('insert successful: ');
            res.status(200).send('Data inserted successfully.');
            console.log(parameters);
            //return res.redirect('/');
        }catch(error){
            console.error('something went wrong: ');
            //return res.redirect('/');
            res.status(500).send('Error inserting data.');
        }   
    }

}

module.exports = formControl;


// exports.submitForm = (req, res) => {
//     const { name } = req.body;
//     const query = "INSERT INTO `names` (name) VALUES (?)";
//     pool.query(query, [name], (error, results) => {
//         if (error) throw error;
//         console.log("1 record inserted");
//         res.redirect('/'); // Redirect back to home page after successful insertion
//     });
// };