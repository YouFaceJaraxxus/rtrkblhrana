const dao = require('./dao');

const TIME_SELECT_STRING = 'SELECT * FROM time';
const TIME_UPDATE_STRING = 'UPDATE time';


exports.getAllTimes = (callback) => {
    dao.sendQuery(TIME_SELECT_STRING, (response)=>{
        return callback(response)
    });
}

exports.getTimeById = (id, callback) => {
    getTimeByParameter(`id = '${id}'`, callback);
}

exports.updateTimeById = (id, newTime, callback) => {
    updateTimeByParameter(`time = '${newTime}'`, `id = '${id}'` , callback)
}


const getTimeByParameter = (parameters, callback) => {
    let queryString = `${TIME_SELECT_STRING} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}


const updateTimeByParameter = (alteredFields, parameters, callback) => {
    let queryString = `${TIME_UPDATE_STRING} SET ${alteredFields} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}
