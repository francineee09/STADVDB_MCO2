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
            return res.redirect('/');
        }catch(error){
            console.error('something went wrong: ');
            res.status(500).send('Error inserting data.');
            return res.redirect('/');
        }   
    },

    async updateForm(req, res){

        try {
            const updateInfo = {
                tablename: process.env.TABLE,
                apptid: req.body.updateApptId,
                values: [], 
                data: []
            };
    
           
            const fieldsToUpdate = ['updateType', 'updateQueuedate', 'updateStatus', 'updatePatientID', 'updatePatients_Age', 'updateGender', 'updateDoctorID', 'updateMainSpecialty', 'updateClinicID', 'updateHospitalName', 'updateCity', 'updateProvince', 'updateRegion', 'updateIsland'];
            fieldsToUpdate.forEach(field => {
                if (req.body[field]) {
                    updateInfo.values.push(field.slice(6).toLowerCase());
                    updateInfo.data.push(req.body[field]);
                }
            });

            if (updateInfo.values.length === 0) {
                console.log('No fields to update.');
                return res.status(200).send('No fields to update.');
            }

            await pool.updateAppointment(updateInfo.tablename, updateInfo.apptid, updateInfo.values, updateInfo.data);
            console.log(updateInfo);
            return res.redirect('/');
        } catch (error) {
            console.error('Something went wrong:', error);
            return res.redirect('/');
        }  
    },

    async deleteForm(req, res) {
        try {
            const apptID = req.body.deleteApptId;
            console.log(apptID);
            pool.deleteAppointment(apptID);
            return res.redirect('/');
        } catch (error) {
            console.error('Error deleting:', error);
            return res.redirect('/');
        }
    },

    async searchForm(req, res) {
        try {
            const searchInfo = {
                tablename: process.env.TABLE,
                values: [],
                data: []
            };
    
            const fieldsToSearch = ['searchApptId', 'searchType', 'searchQueuedate', 'searchStatus', 'searchPxId', 'searchPatients_Age', 'searchGender', 'searchDoctorID', 'searchMainSpecialty', 'searchClinicID', 'searchHospitalName', 'searchCity', 'searchProvince', 'searchRegion', 'searchIsland'];
    
            fieldsToSearch.forEach(field => {
                if (req.body[field]) {
                    searchInfo.values.push(field.slice(6).toLowerCase());
                    searchInfo.data.push(req.body[field]);
                }
            });
    
            const searchResult = await pool.searchAppointment(searchInfo.tablename, searchInfo.values, searchInfo.data);
            console.log(searchResult);
            console.log("Searched successfully!");
            
            res.render('index', { searchResult:searchResult });
        } catch (error) {
            console.error('Something went wrong:', error);
            return res.status(500).send('Internal Server Error');
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