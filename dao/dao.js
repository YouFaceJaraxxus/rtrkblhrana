var mysql = require('mysql');
const JAWS_DB_HOST = process.env.JAWS_DB_HOST || 'eyw6324oty5fsovx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com';
const JAWS_DB_USERNAME = process.env.JAWS_DB_USERNAME || 'znin0opu6uzp4buk';
const JAWS_DB_PASSWORD = process.env.JAWS_DB_PASSWORD || 'w69pwf6canx115mn';
const JAWS_DB_DATABASE = process.env.JAWS_DB_DATABASE || 'x7jcizv39xxeuxj0';


var pool  = mysql.createPool({
    connectionLimit : 10,
    host: JAWS_DB_HOST,
    user: JAWS_DB_USERNAME,
    password: JAWS_DB_PASSWORD,
    database: JAWS_DB_DATABASE
});

exports.sendQuery = (queryString, callback) => {
    let results = pool.query(queryString, (error, results, fields)=>{
        if (error) throw error;
        return callback(results)
    })
    return results;
}

exports.pool = pool;



