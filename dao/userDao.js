const dao = require('./dao');

const USER_SELECT_STRING = 'SELECT * FROM USER';
const USER_UPDATE_STRING = 'UPDATE USER';

exports.getAllUsers = (callback) => {
    dao.sendQuery(USER_SELECT_STRING, (response)=>{
        return callback(response)
    });
}

exports.getUserByEmail = (email, callback) => {
    getUserByParameter(`email = '${email}'`, callback);
}

exports.getUserByEmailAndPassword = (email, password, callback) => {
    getUserByParameter(`email = '${email}' and password = '${password}'`, callback);
}

exports.getUserByToken = (token, callback) => {
    getUserByParameter(`token = '${token}'`, callback);
}

exports.getUserById = (id, callback) => {
    getUserByParameter(`id = '${id}'`, callback);
}

exports.updateTokenById = (id, newToken, callback) => {
    updateUserByParameter(`token = '${newToken}'`, `id = ${id}`, callback)
}

exports.updatePasswordById = (id, newPassword, callback) => {
    updateUserByParameter(`password = '${newPassword}', isActivated = 1`, `id = ${id}`, callback)
}

const getUserByParameter = (parameters, callback) => {
    let queryString = `${USER_SELECT_STRING} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}

const updateUserByParameter = (alteredFields, parameters, callback) => {
    let queryString = `${USER_UPDATE_STRING} SET ${alteredFields} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}
