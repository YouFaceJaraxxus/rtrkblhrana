const dao = require('./dao');


const SPECIALTY_SELECT_STRING = 'SELECT * FROM specialty';
const SPECIALTY_SELECT_JOIN_STRING = 'SELECT * FROM specialty JOIN meal ON meal.id=specialty.mealId';
const SPECIALTY_UPDATE_STRING = 'UPDATE specialty';



exports.getAllDefaultMeals = (callback) => {
    getMealByParameter('isSpecial = 0', callback);
}

exports.getSpecialMealsByDate = (date, callback) => {
    getSpecialtyJoinedByParameter(`specialty.date = '${date}'`, callback);
}


exports.checkNextMonth = (callback) => {
    let queryString = `SELECT * from specialty as s WHERE MONTH(s.date)=4`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}


const getSpecialtyJoinedByParameter = (parameters, callback) => {
    let queryString = `${SPECIALTY_SELECT_JOIN_STRING} WHERE ${parameters}`;
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}


const getSpecialtyByParameter = (parameters, callback) => {
    let queryString = `${SPECIALTY_SELECT_STRING} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}

const updateSpecialtyByParameter = (alteredFields, parameters, callback) => {
    let queryString = `${SPECIALTY_UPDATE_STRING} SET ${alteredFields} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}
