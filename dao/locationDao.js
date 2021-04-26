const dao = require('./dao');

const LOCATION_SELECT_STRING = 'SELECT * FROM location';
const LOCATION_UPDATE_STRING = 'UPDATE location';


exports.getAllLocations = (callback) => {
    dao.sendQuery(LOCATION_SELECT_STRING, (response)=>{
        return callback(response)
    });
}

exports.getLocationById = (id, callback) => {
    getLocationByParameter(`id = '${id}'`, callback);
}

exports.updateLocationById = (id, newLocation, callback) => {
    updateLocationByParameter(`name = '${newLocation}'`, `id = '${id}'` , callback)
}


const getLocationByParameter = (parameters, callback) => {
    let queryString = `${LOCATION_SELECT_STRING} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}


const updateLocationByParameter = (alteredFields, parameters, callback) => {
    let queryString = `${LOCATION_UPDATE_STRING} SET ${alteredFields} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}
