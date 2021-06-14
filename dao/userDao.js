const dao = require('./dao');

const USER_SELECT_STRING = 'SELECT * FROM user';
const USER_UPDATE_STRING = 'UPDATE user';

var cache = {};
exports.memoryCache = () => {
    return {
        get: (key) => { return cache[key]; },
        set: (key, val) => { cache[key] = val; }
    }
}

exports.getCache = (key) =>{
    return cache[key];
}

exports.setCache = (key, val) =>{
    cache[key] = val;
}

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
    let user = cache[token];
    if(user!=null){
        console.log('found user in token list');
        return callback(user);
    }
    else{
        getUserByParameter(`token = '${token}'`, callback);
    }
}

exports.getUserById = (id, callback) => {
    getUserByParameter(`id = '${id}'`, callback);
}

exports.addUser = (name, lastName, email, password, sendOrderEmail, sendForgotOrderEmail, isAdmin, isActivated, callback)=>{
    let queryString = `INSERT INTO user(name, lastName, email, password, sendOrderEmail, sendForgotOrderEmail, isAdmin, isActivated) VALUES ('${name}', '${lastName}', '${email}', '${password}', ${sendOrderEmail}, ${sendForgotOrderEmail}, ${isAdmin}, ${isActivated})`;
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}

exports.updateTokenById = (id, newToken, callback) => {
    updateUserByParameter(`token = '${newToken}'`, `id = ${id}`, callback)
}

exports.updatePasswordById = (id, newPassword, callback) => {
    updateUserByParameter(`password = '${newPassword}', isActivated = 1`, `id = ${id}`, callback)
}

exports.updateEmailPreferencesById = (id, sendOrderEmail, sendForgotOrderEmail, callback) => {
    updateUserByParameter(`sendOrderEmail = ${sendOrderEmail}, sendForgotOrderEmail = ${sendForgotOrderEmail}`, `id = ${id}`, callback)
}

const getUserByParameter = (parameters, callback) => {
    let queryString = `${USER_SELECT_STRING} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (users)=>{
        let user = null;
        if(users!=null&&users.length>0) {
            user = users[0];
            cache[user.token] = user;
        }
        return callback(user)
    });
}

const updateUserByParameter = (alteredFields, parameters, callback) => {
    let queryString = `${USER_UPDATE_STRING} SET ${alteredFields} WHERE ${parameters}`; 
    console.log('query', queryString);
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}
