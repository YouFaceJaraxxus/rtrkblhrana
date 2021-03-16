const dao = require('./dao');

const USER_QUERY_STRING = 'SELECT * FROM USER';

exports.getAllUsers = (callback) => {
    dao.select(USER_QUERY_STRING, (response)=>{
        return callback(response)
    });
}

exports.getUserByEmail = (email, callback) => {
    getUserByParameter('email', email, callback);
}

exports.getUserById = (id, callback) => {
    getUserByParameter('id', id, callback);
}

const getUserByParameter = (parameterName, parameterValue, callback) => {
    let queryString = `${USER_QUERY_STRING} WHERE ${parameterName} = '${parameterValue}'`; 
    dao.select(queryString, (response)=>{
        return callback(response)
    });
}
