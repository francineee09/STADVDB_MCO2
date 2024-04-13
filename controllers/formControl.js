const pool = require('../public/db');

const formControl = {

    async insertForm(req, res){
        try{
            const parameters = {apptid, type, queuedate, statuss, pxid, 
                patients_age, gender, doctorid, mainspecialty, 
                clinicid, hospitalname, city, province, regionname, island 
            } = req.body;

            await pool.insertAppointment(parameters.apptid, parameters.type, parameters.queuedate, parameters.statuss, parameters.pxid, 
                parameters.patients_age, parameters.gender, parameters.doctorid, parameters.mainspecialty, 
                parameters.clinicid, parameters.hospitalname, parameters.city, parameters.province,
                parameters.regionname, parameters.island);
            
            console.error('Insert successful');

            const backButtonHtml = '<button onclick="window.history.back()">Back</button>';
            const successMessage = 'Data inserted successfully. ' + backButtonHtml;
            return res.status(200).send(successMessage);
        } catch (error) {
            console.error('Something went wrong: ', error);
            return res.status(500).send('Error inserting data.');
        }   
    },

    async updateForm(req, res){
        try {
            const updateInfo = {
                apptid: req.body.updateApptId,
                values: [], 
                data: []
            };
    
            const fieldsToUpdate = ['updateType', 'updateQueuedate', 'updateStatus', 'updatePatientID', 'updatePatients_Age', 'updateGender', 'updateDoctorID', 'updateMainSpecialty', 'updateClinicID', 'updateHospitalName', 'updateCity', 'updateProvince', 'updateRegionName', 'updateIsland'];
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

            await pool.updateAppointment(updateInfo.apptid, updateInfo.values, updateInfo.data);
            console.log(updateInfo);

            const backButtonHtml = '<button onclick="window.history.back()">Back</button>';
            const successMessage = 'Data updated successfully. ' + backButtonHtml;
            return res.status(200).send(successMessage);
        } catch (error) {
            console.error('Something went wrong: ', error);
            return res.status(500).send('Error updating data.');
        }   
    },

    async deleteForm(req, res) {
        try {
            const apptID = req.body.deleteApptId;
            const island = req.body.deleteIsland;

            console.log(apptID, island);
            pool.deleteAppointment(apptID, island);

            const backButtonHtml = '<button onclick="window.history.back()">Back</button>';
            const successMessage = 'Data deleted successfully. ' + backButtonHtml;
            return res.status(200).send(successMessage);
        } catch (error) {
            console.error('Something went wrong: ', error);
            return res.status(500).send('Error deleting data.');
        }   
    },

    async searchForm(req, res) {
        try {
            const searchInfo = {
                values: [],
                data: []
            };
    
            const fieldsToSearch = ['searchApptId', 'searchType', 'searchQueuedate', 'searchStatus', 'searchPxId', 'searchPatients_Age', 'searchGender', 'searchDoctorID', 'searchMainSpecialty', 'searchClinicID', 'searchHospitalName', 'searchCity', 'searchProvince', 'searchRegionName', 'searchIsland'];
    
            fieldsToSearch.forEach(field => {
                if (req.body[field]) {
                    searchInfo.values.push(field.slice(6).toLowerCase());
                    searchInfo.data.push(req.body[field]);
                }
            });
    
            const searchResult = await pool.searchAppointment(searchInfo.values, searchInfo.data);
            console.log("Search Result:", searchResult);
            console.log("Searched successfully!");

            let tableHtml = `
            <a href="/" style="text-decoration: none; padding: 8px 16px; background-color: rgb(141, 67, 67); color: white; border-radius: 4px; margin-bottom: 10px; display: inline-block;">Back</a>
            <div style="overflow-x: auto;">
                <table class="appointment-table" style="border-collapse: collapse; width: 100%;">
                    <tr class="appointment-headings" style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Appointment ID</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Type</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Queuedate</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Status</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Patient ID</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Patient Age</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Patient Gender</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Doctor ID</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Main Specialty</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Clinic ID</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Hospital Name</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">City</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Province</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Region</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Island</th>
                    </tr>
        `;

        // Loop through searchResult and add table rows with data
        if (Array.isArray(searchResult[0]) && searchResult[0].length > 0) {
            searchResult[0].forEach(result => {
                tableHtml += `
                    <tr class="appointment-results" style="background-color: #ffffff;">
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.apptid}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.type}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.queuedate}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.status}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.pxid}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.patients_age}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.gender}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.doctorid}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.mainspecialty}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.clinicid}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.hospitalname}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.city}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.province}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.regionname}</td>
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${result.island}</td>
                    </tr>
                `;
            });
        } else {
            tableHtml += `
                <tr>
                    <td colspan="15" style="border: 1px solid #dddddd; text-align: center; padding: 8px;">No results found</td>
                </tr>
            `;
        }

        tableHtml += '</table></div>';
        res.send(tableHtml); // Send the constructed HTML table
        } catch (error) {
            console.error('Something went wrong:', error);
            return res.status(500).send('Error searching data.');
        }
    },
}

module.exports = formControl;