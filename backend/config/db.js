require('dotenv').config(); 

const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    connectionLimit : 10,
    dateStrings : false,
    enableKeepAlive : true,
    keepAliveInitialDelay : 0
});

pool.getConnection()
    .then(conn => {
        console.log(' MySql connected successfully');
        conn.release();
    })
    .catch(err => {
        console.error('   MySQL connection failed:', err.message);
        console.error('  Check your .env credentials and MySQL service');
    });

    module.exports = pool;