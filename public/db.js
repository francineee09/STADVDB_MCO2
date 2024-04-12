const { createPool } = require('mysql2/promise');
require('dotenv').config();
//console.log('Environment variables loaded:', process.env);

const pool = createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10,
})

const central = createPool({
    host: process.env.CENTRAL_HOST,
    port: process.env.CENTRAL_PORT,
    user: process.env.CENTRAL_USER,
    password: process.env.CENTRAL_PASSWORD,
    database: process.env.CENTRAL_DATABASE,
    connectionLimit: 10,
})

// Insert new appointment record to the database
async function insertAppointment(apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island){
    
    // Set isolation level
    await central.query(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;`);

    // Start transaction
    await central.query(`START TRANSACTION;`);

    // Begin transaction
    if(island == 'Luzon'){
        try{
            await central.query(`INSERT INTO ${process.env.DATABASE}.${process.env.LUZON_TABLE}(apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island])
            // If no errors occur, commit
            await central.query(`COMMIT`);
            console.log('Data has been committed')
        }
        catch(error){
            console.log('Error in inserting data');
            await central.query(`ROLLBACK;`);
        }
    }
    else{
        try{
            await central.query(`INSERT INTO ${process.env.DATABASE}.${process.env.VIZMIN_TABLE}(apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island])
            // If no errors occur, commit
            await central.query(`COMMIT`);
            console.log('Data has been committed')
        }
        catch(error){
            console.log('Error in inserting data');
            await central.query(`ROLLBACK;`);
            console.log('ROLLBACK SUCCESSFUL');
        }
    }
}
// Delete an appointment based on apptid
async function deleteAppointment(apptid, island){
    if(island == 'Luzon'){
        // Set isolation level
        await central.query(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;`);

        // Begin transaction
        await central.query(`START TRANSACTION;`);

        // Execute query
        try{
            await central.query(`DELETE FROM ${process.env.LUZON_TABLE} WHERE apptid = ?`, [apptid]);
            await central.query(`COMMIT;`);
            console.log(`Successfully deleted appointment with id: ${apptid}`);
        }
        catch(error){
            await central.query(`ROLLBACK`);
            console.log('Error occurred. Rollback successful');
            throw error;
        }
    }

    else{
        // Set isolation level
        await central.query(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;`);

        // Begin transaction
        await central.query(`START TRANSACTION;`);

        // Execute query
        try{
            await central.query(`DELETE FROM ${process.env.VIZMIN_TABLE} WHERE apptid = ?`, [apptid]);
            await central.query(`COMMIT;`);
            console.log(`Successfully deleted appointment with id: ${apptid}`);
        }
        catch(error){
            await central.query(`ROLLBACK`);
            console.log('Error occurred. Rollback successful');
            throw error;
        }
    }
}


// HELPER FUNCTION TO DYNAMICALLY CREATE UPDATE, PRE-HANDLE: values.length == data.length
function generateUPDATEQuery(apptid, values, data) {
    let island = '';

    // GET table name;
    for (let i = 0; i < values.length; i++) {
        if (values[i] == 'island'){
            console.log("ISLAND: " + data[i]);
            island = data[i];
        }
    }

    if (island == 'Luzon') {
        const updateStatement = `UPDATE ${process.env.LUZON_TABLE} `;
        let setStatement = ' SET ';

        // Generate SET part of query
        for (let i = 0; i < values.length; i++) {
            // Process data: if value is not age, prepend and append the string '\''
            if (values[i] != 'age')
                data[i] = '\'' + data[i] + '\'';
            setStatement = setStatement.concat(`${values[i]} = ${data[i]}, `);
        }

        // Remove final comma
        setStatement = setStatement.slice(0, -2);

        const whereStatement = ` WHERE apptid = '${apptid}';`;

        const query = updateStatement.concat(setStatement).concat(whereStatement);
        return query;
    } else {
        const updateStatement = `UPDATE ${process.env.VIZMIN_TABLE} `;
        let setStatement = ' SET ';

        // Generate SET part of query
        for (let i = 0; i < values.length; i++) {
            // Process data: if value is not age, prepend and append the string '\''
            if (values[i] != 'age')
                data[i] = '\'' + data[i] + '\'';
            setStatement = setStatement.concat(`${values[i]} = ${data[i]}, `);
        }

        // Remove final comma
        setStatement = setStatement.slice(0, -2);

        const whereStatement = ` WHERE apptid = '${apptid}';`;

        const query = updateStatement.concat(setStatement).concat(whereStatement);
        return query;
    }
}

// Perform UPDATE statement on database based on values
async function updateAppointment(apptid, values, data){
    const updateStatement = generateUPDATEQuery(apptid, values, data);
    console.log('UPDATE STATEMENT: ' + updateStatement);
    // set isolation level
    await central.query(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;`);

    // begin transaction
    await central.query(`START TRANSACTION;`);

    // execute sql
    try{
        await central.query(updateStatement);
        await central.query(`COMMIT;`);
        console.log(`Data at apptid: ${apptid} successfully updated`);
    }
    catch(error){
        await central.query(`ROLLBACK`);
        console.error('Error occurred in updating data: ', error);
        throw error;
    }
}

// Search and view appointment records
// HELPER FUNCTION TO DYNAMICALLY CREATE WHERE, PRE-HANDLE: values.length == data.length
function generateSELECTQuery(values, data){
    
    let island = '';

    // GET table name;
    for (let i = 0; i < values.length; i++) {
        if (values[i] == 'island'){
            console.log("ISLAND: " + data[i]);
            island = data[i];
        }
    }

    if(island == 'Luzon'){
        const selectStatement = `SELECT * FROM ${process.env.LUZON_TABLE}`;
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
        const query = selectStatement.concat(whereStatement).concat('FOR SHARE;');
        return query;
    }
    else{
        const selectStatement = `SELECT * FROM ${process.env.VIZMIN_TABLE}`;
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
        const query = selectStatement.concat(whereStatement).concat('FOR UPDATE;');
        return query;
    }
}

async function searchAppointment(values, data) {
    let island = '';

    // GET table name;
    for (let i = 0; i < values.length; i++) {
        if (values[i] == 'island'){
            console.log("ISLAND: " + data[i]);
            island = data[i];
        }
    }

    const selectStatement = generateSELECTQuery(values, data);
    console.log('SELECT STATEMENT IS: ' + selectStatement);

    if(process.env.NODE == 'CENTRAL'){
        if(island == 'Luzon'){
            await central.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

            // start transaction
            await central.query(`START TRANSACTION;`);

            // execute query
            try{
                const result = await central.query(selectStatement);
                await central.query(`COMMIT;`);
                return result;
            }
            catch(error){
                await central.query(`ROLLBACK;`);
                console.log('Error occurred. Rollback successful');
                throw error;
            }
        }
        else{
            await central.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

            // start transaction
            await central.query(`START TRANSACTION;`);

            // execute query
            try{
                const result = await central.query(selectStatement);
                await central.query(`COMMIT;`);
                return result;
            }
            catch(error){
                await central.query(`ROLLBACK;`);
                console.log('Error occurred. Rollback successful');
                throw error;
            }
        }
    }
    if(process.env.NODE == 'LUZON'){
        // set isolation level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute query
        try{
            const result = await central.query(selectStatement);
            await central.query(`COMMIT;`);
            return result;
        }
        catch(error){
            await pool.query(`ROLLBACK;`);
            console.log('Error occurred. Rollback successful');
            throw error;
        }
    }
    if(process.env.NODE == ' VIZMIN'){
        // set isolation level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute query
        try{
            const result = await central.query(selectStatement);
            await central.query(`COMMIT;`);
            return result;
        }
        catch(error){
            await pool.query(`ROLLBACK;`);
            console.log('Error occurred. Rollback successful');
            throw error;
        }
    }
}

// View a set of text-based reports; set of reports is to be determined by the team

// Function to get the city with the most appointments per island
async function getTopCity(island){
    node = process.env.NODE;
    let topCity = '';

    if((node == 'CENTRAL' || node == 'Luzon') && island == 'Luzon'){ // get text report for luzon (most busy city, most busy hospital, most in demand specialization
        // set transaction level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute sql query
        try{
            topCity = await pool.query(`SELECT city, COUNT(*) AS city_count FROM ${process.env.LUZON_TABLE} WHERE island="luzon"  GROUP BY city ORDER BY city_count DESC LIMIT 1;`);
            await pool.query(`COMMIT;`);
            console.log(topCity);
            return topCity;
        }
        catch(error){
            await pool.query(`ROLLBACK`);
            throw error;
        }
    }

    if((node == 'CENTRAL' || node == 'Vizmin') && island == 'Visayas'){ // get text report for luzon (most busy city, most busy hospital, most in demand specialization)
        // set transaction level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute sql query
        try{
            topCity = await pool.query(`SELECT city, COUNT(*) AS city_count FROM ${process.env.VIZMIN_TABLE} WHERE island="visayas"  GROUP BY city ORDER BY city_count DESC LIMIT 1;`);
            await pool.query(`COMMIT;`);
            console.log(topCity);
            return topCity;
        }
        catch(error){
            await pool.query(`ROLLBACK`);
            throw error;
        }
    }

    if((node == 'CENTRAL' || node == 'Vizmin') && island == 'Mindanao'){ // get text report for luzon (most busy city, most busy hospital, most in demand specialization)
        // set transaction level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute sql query
        try{
            topCity = await pool.query(`SELECT city, COUNT(*) AS city_count FROM ${process.env.VIZMIN_TABLE} WHERE island="mindanao"  GROUP BY city ORDER BY city_count DESC LIMIT 1;`);
            await pool.query(`COMMIT;`);
            console.log(topCity);
            return topCity;
        }
        catch(error){
            await pool.query(`ROLLBACK`);
            throw error;
        }
    }
}

async function getTopHospital(island){
    node = process.env.NODE;
    let topCity = '';

    if((node == 'CENTRAL' || node == 'Luzon') && island == 'Luzon'){ // get text report for luzon (most busy city, most busy hospital, most in demand specialization
        // set transaction level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute sql query
        try{
            topHospital = await pool.query(`
                SELECT hospitalname, COUNT(*) AS hospital_count
                FROM ${process.env.LUZON_TABLE}
                WHERE hospitalname IS NOT NULL and island = "Luzon"
                GROUP BY hospitalname
                LIMIT 1;
            `);
            await pool.query(`COMMIT;`);
            console.log(topHospital);
            return topHospital;
        }
        catch(error){
            await pool.query(`ROLLBACK`);
            throw error;
        }
    }

    if((node == 'CENTRAL' || node == 'Vizmin') && island == 'Visayas'){ // get text report for luzon (most busy city, most busy hospital, most in demand specialization)
        // set transaction level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute sql query
        try{
            topHospital = await pool.query(`
                SELECT hospitalname, COUNT(*) AS hospital_count
                FROM ${process.env.VIZMIN_TABLE}
                WHERE hospitalname IS NOT NULL and island = "Visayas"
                GROUP BY hospitalname
                LIMIT 1;
            `);
            await pool.query(`COMMIT;`);
            console.log(topHospital);
            return topHospital;
        }
        catch(error){
            await pool.query(`ROLLBACK`);
            throw error;
        }
    }

    if((node == 'CENTRAL' || node == 'Vizmin') && island == 'Mindanao'){ // get text report for luzon (most busy city, most busy hospital, most in demand specialization)
        // set transaction level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute sql query
        try{
            topHospital = await pool.query(`
                SELECT hospitalname, COUNT(*) AS hospital_count
                FROM ${process.env.VIZMIN_TABLE}
                WHERE hospitalname IS NOT NULL and island = "Mindanao"
                GROUP BY hospitalname
                LIMIT 1;
            `);
            await pool.query(`COMMIT;`);
            console.log(topHospital);
            return topHospital;
        }
        catch(error){
            await pool.query(`ROLLBACK`);
            throw error;
        }
    }
}

async function getTopCity(island){
    node = process.env.NODE;
    let topCity = '';

    if((node == 'CENTRAL' || node == 'Luzon') && island == 'Luzon'){ // get text report for luzon (most busy city, most busy hospital, most in demand specialization
        // set transaction level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute sql query
        try{
            topCity = await pool.query(`SELECT city, COUNT(*) AS city_count FROM ${process.env.LUZON_TABLE} WHERE island="luzon"  GROUP BY city ORDER BY city_count DESC LIMIT 1;`);
            await pool.query(`COMMIT;`);
            console.log(topCity);
            return topCity;
        }
        catch(error){
            await pool.query(`ROLLBACK`);
            throw error;
        }
    }

    if((node == 'CENTRAL' || node == 'Vizmin') && island == 'Visayas'){ // get text report for luzon (most busy city, most busy hospital, most in demand specialization)
        // set transaction level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute sql query
        try{
            topCity = await pool.query(`SELECT city, COUNT(*) AS city_count FROM ${process.env.VIZMIN_TABLE} WHERE island="visayas"  GROUP BY city ORDER BY city_count DESC LIMIT 1;`);
            await pool.query(`COMMIT;`);
            console.log(topCity);
            return topCity;
        }
        catch(error){
            await pool.query(`ROLLBACK`);
            throw error;
        }
    }

    if((node == 'CENTRAL' || node == 'Vizmin') && island == 'Mindanao'){ // get text report for luzon (most busy city, most busy hospital, most in demand specialization)
        // set transaction level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute sql query
        try{
            topCity = await pool.query(`SELECT city, COUNT(*) AS city_count FROM ${process.env.VIZMIN_TABLE} WHERE island="mindanao"  GROUP BY city ORDER BY city_count DESC LIMIT 1;`);
            await pool.query(`COMMIT;`);
            console.log(topCity);
            return topCity;
        }
        catch(error){
            await pool.query(`ROLLBACK`);
            throw error;
        }
    }
}

// Function to get the most indemand main specialty per island
async function getTopSpecialization(island){
    node = process.env.NODE;
    let topSpecialty = '';

    if((node == 'CENTRAL' || node == 'Luzon') && island == 'Luzon'){ // get text report for luzon (most busy city, most busy hospital, most in demand specialization
        // set transaction level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute sql query
        try{
            topSpecialty = await pool.query(`
                SELECT mainspecialty, COUNT(*) AS popularity
                FROM ${process.env.LUZON_TABLE}
                WHERE mainspecialty IS NOT NULL and island = "Luzon"
                GROUP BY mainspecialty
                ORDER BY popularity DESC
                LIMIT 1;
            `);
            await pool.query(`COMMIT;`);
            console.log(topSpecialty);
            return topSpecialty;
        }
        catch(error){
            await pool.query(`ROLLBACK`);
            throw error;
        }
    }

    if((node == 'CENTRAL' || node == 'Vizmin') && island == 'Visayas'){ // get text report for luzon (most busy city, most busy hospital, most in demand specialization)
        // set transaction level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute sql query
        try{
            topSpecialty = await pool.query(`
                SELECT mainspecialty, COUNT(*) AS popularity
                FROM ${process.env.VIZMIN_TABLE}
                WHERE mainspecialty IS NOT NULL and island = "Visayas"
                GROUP BY mainspecialty
                ORDER BY popularity DESC
                LIMIT 1;
            `);
            await pool.query(`COMMIT;`);
            console.log(topSpecialty);
            return topSpecialty;
        }
        catch(error){
            await pool.query(`ROLLBACK`);
            throw error;
        }
    }

    if((node == 'CENTRAL' || node == 'Vizmin') && island == 'Mindanao'){ // get text report for luzon (most busy city, most busy hospital, most in demand specialization)
        // set transaction level
        await pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`);

        // start transaction
        await pool.query(`START TRANSACTION;`);

        // execute sql query
        try{
            topSpecialty = await pool.query(`
                SELECT mainspecialty, COUNT(*) AS popularity
                FROM ${process.env.VIZMIN_TABLE}
                WHERE mainspecialty IS NOT NULL and island = "Mindanao"
                GROUP BY mainspecialty
                ORDER BY popularity DESC
                LIMIT 1;
            `);
            await pool.query(`COMMIT;`);
            console.log(topSpecialty);
            return topSpecialty;
        }
        catch(error){
            await pool.query(`ROLLBACK`);
            throw error;
        }
    }
}

module.exports = {pool, insertAppointment, updateAppointment, deleteAppointment, searchAppointment, getTopCity, getTopHospital, getTopSpecialization}