const { createPool } = require('mysql2');
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

// Insert new appointment record to the database
async function insertAppointment(apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island){
    if(process.env.NODE == 'CENTRAL'){
        if(island == 'luzon'){
            console.log('INSERTING INTO LUZON NODE');
            pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`, (error, result, fields) => {
                if(error){ // error occurred in setting isolation level
                    console.error('Error occurred in setting isolation level: ', error);
                    return false;
                }
                else{ // no error in setting isolation level, begin transaction
                    console.log('Isolation level set');
                    pool.query('START TRANSACTION;', (error, result, fields) => {
                        if(error){ // error occurred in starting transaction
                            console.error('Error occured in starting transaction', error);
                            return false;
                        }
                        else{ // no error occurred in starting transaction, execute SQL
                            console.log('Transaction started');
                            // sql statement
                            pool.query(`
                                INSERT INTO ${process.env.DATABASE}.${process.env.LUZON_TABLE}(apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island)
                                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) FOR UPDATE;
                                `, [apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island], (error, result, fields) => {
                                if(error){
                                    console.error('Error has occurred in executing statement: ', error);
                                    pool.query(`ROLLBACK;`, (error, result, fields) => {
                                        if(error){ // error occurred in performing ROLLBACK
                                            console.error('Error occurred in performing ROLLBACK: ', error);
                                            return false;
                                        }
                                        else{
                                            console.log('Rollback performed successfully');
                                            return true;
                                        }
                                    });
                                }
                                else{
                                    console.log(`Data inserted successfully for row with appt id: ${apptid}`);
                                    pool.query(`COMMIT;`, (error, result, fields) => {
                                        if(error){
                                            console.error('Error occurred in performing COMMIT: ', error);
                                            return false;
                                        }
                                        else{
                                            console.log('Commit performed successfully');
                                            return true;
                                        }
                                    })
                                    return true;
                                }
                            })
                        }
                    })
                }
            });
        }
        else{
            console.log('INSERTING INTO VIZMIN NODE');
            pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`, (error, result, fields) => {
                if(error){ // error occurred in setting isolation level
                    console.error('Error occurred in setting isolation level: ', error);
                    return false;
                }
                else{ // no error in setting isolation level, begin transaction
                    console.log('Isolation level set');
                    pool.query('START TRANSACTION;', (error, result, fields) => {
                        if(error){ // error occurred in starting transaction
                            console.error('Error occured in starting transaction', error);
                            return false;
                        }
                        else{ // no error occurred in starting transaction, execute SQL
                            console.log('Transaction started');
                            // sql statement
                            pool.query(`
                                INSERT INTO ${process.env.DATABASE}.${process.env.VIZMIN_TABLE}(apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island)
                                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) FOR UPDATE;
                            `, [apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island], (error, result, fields) => {
                                if(error){
                                    console.error('Error has occurred in executing statement: ', error);
                                    pool.query(`ROLLBACK;`, (error, result, fields) => {
                                        if(error){ // error occurred in performing ROLLBACK
                                            console.error('Error occurred in performing ROLLBACK: ', error);
                                            return false;
                                        }
                                        else{
                                            console.log('Rollback performed successfully');
                                            return true;
                                        }
                                    });
                                }
                                else{
                                    console.log(`Data inserted successfully for row with appt id: ${apptid}`);
                                    pool.query(`COMMIT;`, (error, result, fields) => {
                                        if(error){
                                            console.error('Error occurred in performing COMMIT: ', error);
                                            return false;
                                        }
                                        else{
                                            console.log('Commit performed successfully');
                                            return true;
                                        }
                                    })
                                    return true;
                                }
                            })
                        }
                    })
                }
            });
        }
    }
    if(process.env.NODE == 'LUZON'){
        if(process.env.NODE == 'CENTRAL'){
            if(island == 'luzon'){
                console.log('INSERTING INTO LUZON NODE');
                pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`, (error, result, fields) => {
                    if(error){ // error occurred in setting isolation level
                        console.error('Error occurred in setting isolation level: ', error);
                        return false;
                    }
                    else{ // no error in setting isolation level, begin transaction
                        console.log('Isolation level set');
                        pool.query('START TRANSACTION;', (error, result, fields) => {
                            if(error){ // error occurred in starting transaction
                                console.error('Error occured in starting transaction', error);
                                return false;
                            }
                            else{ // no error occurred in starting transaction, execute SQL
                                console.log('Transaction started');
                                // sql statement
                                pool.query(`
                                    INSERT INTO ${process.env.DATABASE}.app_luzon(apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island)
                                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) FOR UPDATE;
                                `, [apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island], (error, result, fields) => {
                                    if(error){
                                        console.error('Error has occurred in executing statement: ', error);
                                        pool.query(`ROLLBACK;`, (error, result, fields) => {
                                            if(error){ // error occurred in performing ROLLBACK
                                                console.error('Error occurred in performing ROLLBACK: ', error);
                                                return false;
                                            }
                                            else{
                                                console.log('Rollback performed successfully');
                                                return true;
                                            }
                                        });
                                    }
                                    else{
                                        console.log(`Data inserted successfully for row with appt id: ${apptid}`);
                                        pool.query(`COMMIT;`, (error, result, fields) => {
                                            if(error){
                                                console.error('Error occurred in performing COMMIT: ', error);
                                                return false;
                                            }
                                            else{
                                                console.log('Commit performed successfully');
                                                return true;
                                            }
                                        })
                                        return true;
                                    }
                                })
                            }
                        })
                    }
                });
            }
    }
    if(process.env.NODE == 'VIZMIN'){
        console.log('INSERTING INTO VIZMIN NODE');
            pool.query(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`, (error, result, fields) => {
                if(error){ // error occurred in setting isolation level
                    console.error('Error occurred in setting isolation level: ', error);
                    return false;
                }
                else{ // no error in setting isolation level, begin transaction
                    console.log('Isolation level set');
                    pool.query('START TRANSACTION;', (error, result, fields) => {
                        if(error){ // error occurred in starting transaction
                            console.error('Error occured in starting transaction', error);
                            return false;
                        }
                        else{ // no error occurred in starting transaction, execute SQL
                            console.log('Transaction started');
                            // sql statement
                            pool.query(`
                                INSERT INTO ${process.env.DATABASE}.${process.env.VIZMIN_TABLE}(apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island)
                                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) FOR UPDATE;
                            `, [apptid, type, queuedate, status, pxid, patients_age, gender, doctorid, mainspecialty, clinicid, hospitalname, city, province, regionname, island], (error, result, fields) => {
                                if(error){
                                    console.error('Error has occurred in executing statement: ', error);
                                    pool.query(`ROLLBACK;`, (error, result, fields) => {
                                        if(error){ // error occurred in performing ROLLBACK
                                            console.error('Error occurred in performing ROLLBACK: ', error);
                                            return false;
                                        }
                                        else{
                                            console.log('Rollback performed successfully');
                                            return true;
                                        }
                                    });
                                }
                                else{
                                    console.log(`Data inserted successfully for row with appt id: ${apptid}`);
                                    pool.query(`COMMIT;`, (error, result, fields) => {
                                        if(error){
                                            console.error('Error occurred in performing COMMIT: ', error);
                                            return false;
                                        }
                                        else{
                                            console.log('Commit performed successfully');
                                            return true;
                                        }
                                    })
                                    return true;
                                }
                            })
                        }
                    })
                }
            });
    }
}
}
// Delete an appointment based on apptid
async function deleteAppointment(apptid){
    // pool.query(`SELECT island FROM `)
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
    const updateStatement = generateUPDATEQuery(tablename, apptid, values, data);
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

async function searchAppointment(tablename, values, data) {
    return new Promise((resolve, reject) => {
        const selectStatement = generateSELECTQuery(tablename, values, data);
        pool.query(selectStatement, (error, result, fields) => {
            if (error) {
                console.error('Error has occurred in searching row: ', error);
                reject(error);
            } else {
                console.log(result);
                resolve(result);
            }
        });
    });
}

// View a set of text-based reports; set of reports is to be determined by the team

module.exports = {pool, insertAppointment, updateAppointment, deleteAppointment, searchAppointment}