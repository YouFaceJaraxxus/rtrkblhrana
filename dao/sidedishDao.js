const dao = require('./dao');


const MEAL_SIDEDISH_SELECT_STRING = 'SELECT * FROM meal_sidedish';
const MEAL_SIDEDISH_SELECT_JOIN_SIDEDISH_STRING = 'SELECT * FROM meal_sidedish JOIN sidedish ON sidedish.id = meal_sidedish.sidedishId';
const MEAL_SIDEDISH_SELECT_JOIN_MEAL_STRING = 'SELECT * FROM meal_sidedish JOIN meal ON meal.id = meal_sidedish.mealId';
const MEAL_SIDEDISH_UPDATE_STRING = 'UPDATE meal_sidedish';



exports.getAllMealSidedishes = (callback) => {
    let queryString = `${MEAL_SIDEDISH_SELECT_STRING}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}

exports.getAllMealSidedishesDefaultJoined = (callback) => {
    getMealSidedishJoinedByParameter('meal_sidedish.date IS NULL', callback);
}

exports.getAllMealSidedishesSpecialJoined = (callback) => {
    getMealSidedishJoinedByParameter('meal_sidedish.date IS NOT NULL', callback);
}

exports.getAllMealSidedishesSpecialJoinedByDate= (date, callback) => {
    getMealSidedishJoinedByParameter(`meal_sidedish.date = '${date}'`, callback);
}



const getMealSidedishByParameter = (parameters, callback) => {
    let queryString = `${MEAL_SIDEDISH_SELECT_STRING} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}

const getMealSidedishJoinedByParameter = (parameters, callback) => {
    let queryString = `${MEAL_SIDEDISH_SELECT_JOIN_SIDEDISH_STRING} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}

const updateSidedishByParameter = (alteredFields, parameters, callback) => {
    let queryString = `${MEAL_SIDEDISH_UPDATE_STRING} SET ${alteredFields} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}