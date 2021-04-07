const dao = require('./dao');

const MEAL_SELECT_STRING = 'SELECT * FROM meal';
const MEAL_UPDATE_STRING = 'UPDATE meal';

const MEAL_SIDEDISH_SELECT_STRING = 'SELECT * FROM meal_sidedish';
const MEAL_SIDEDISH_SELECT_JOIN_STRING = 'SELECT * FROM meal_sidedish JOIN meal ON meal.id=meal_sidedish.mealId';
const MEAL_SIDEDISH_UPDATE_STRING = 'UPDATE specialty';



exports.getAllDefaultMeals = (callback) => {
    getMealByParameter('isSpecial = 0', callback);
}

exports.getMealById = (id, callback) => {
    getMealByParameter(`id = '${id}'`, callback);
}

exports.updateMealById = (id, newMeal, callback) => {
    updateUserByParameter(`name = '${newMeal.name}', isSpecial = '${newMeal.isSpecial}', imageUrl = '${newMeal.imageUrl}', isActive = '${newMeal.isActive}', listOrder = '${newMeal.listOrder}', date = '${newMeal.date}'`, `id = ${id}`, callback)
}


const getMealByParameter = (parameters, callback) => {
    let queryString = `${MEAL_SELECT_STRING} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}


const updateMealByParameter = (alteredFields, parameters, callback) => {
    let queryString = `${MEAL_UPDATE_STRING} SET ${alteredFields} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}
