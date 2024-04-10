const { createPool } = require('mysql2');
require('dotenv').config();

const pool = createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10,
})

// Insert new appointment record to the database
async function insertAppointment(apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island){
    pool.query(`
        INSERT INTO ${process.env.TABLE}(apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island], (error, result, fields) => {
        if(error)
            console.error('Error has occurred in executing statement: ', error);
        else
            console.log(`Data inserted successfully for row with appt id: ${apptid}`);
    })
}

// Delete an appointment based on apptid
async function deleteAppointment(apptid){
    pool.query(`DELETE FROM ${process.env.TABLE} WHERE apptid = ?`, [apptid], (error, result, fields) => {
        if(error)
            console.error('Error has occurred in deleting row: ', error);
        else
            console.log(`Row with appt id: ${apptid} has been deleted successfully.`);
    })
}


// HELPER FUNCTION TO DYNAMICALLY CREATE UPDATE, PRE-HANDLE: values.length == data.length
function generateUPDATEQuery(tablename, apptid, values, data){
    
    const updateStatement = `UPDATE ${tablename} `;
    let setStatement = 'SET ';
    
    // Generate SET part of query
    for(let i = 0; i < values.length; i++){
        // Process data: if value is not age, prepend and append the string '\''
        if(values[i] != 'age')
            data[i] = '\'' + data[i] + '\'';
        setStatement = setStatement.concat(`${values[i]} = ${data[i]}, `);
    }

    // Remove final comma
    setStatement = setStatement.slice(0, -2);

    const whereStatement = ` WHERE apptid = '${apptid}';`;

    const query = updateStatement.concat(setStatement).concat(whereStatement);
    return query;
}

// Perform UPDATE statement on database based on values
async function updateAppointment(tablename, apptid, values, data){
    const updateStatement = generateUpdateQuery(tablename, apptid, values, data);
    pool.query(updateStatement, (error, result, fields) => {
        if(error)
            console.error('Error has occurred in deleting row: ', error);
        else
            console.log(`Row with appt id: ${apptid} has been updated successfully.`);
    })
}

// Search and view appointment records
// HELPER FUNCTION TO DYNAMICALLY CREATE WHERE, PRE-HANDLE: values.length == data.length
function generateSELECTQuery(tablename, values, data){
    
    const selectStatement = `SELECT * FROM ${tablename}`;
    let whereStatement = ' WHERE ';
    
    // Generate WHERE part of query
    for(let i = 0; i < values.length; i++){
        // Process data: if value is not age, prepend and append the string '\''
        if(values[i] != 'age')
            data[i] = '\'' + data[i] + '\'';
        whereStatement = whereStatement.concat(`${values[i]} = ${data[i]} AND `);
    }

    // Remove final AND
    whereStatement = whereStatement.slice(0, -5);

    // const whereStatement = ` WHERE apptid = '${apptid}';`;

    const query = selectStatement.concat(whereStatement).concat(';');
    return query;
}

async function searchAppointment(tablename, values, data){
    selectStatement = generateSELECTQuery(tablename, values, data);
    pool.query(selectStatement, (error, result, fields) => {
        if(error)
            console.error('Error has occurred in searching row: ', error);
        else
            console.log(result);
    })
}
// View a set of text-based reports; set of reports is to be determined by the team


module.exports = {pool, insertAppointment, updateAppointment, deleteAppointment, searchAppointment}

