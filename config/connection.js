const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SkyMoon',
    database: 'CMS_db'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to CMS database.');
});

module.exports = connection;