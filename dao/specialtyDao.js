const dao = require('./dao');


const SPECIALTY_SELECT_STRING = 'SELECT * FROM specialty';
const SPECIALTY_SELECT_JOIN_STRING = 'SELECT * FROM specialty JOIN meal ON meal.id=specialty.mealId';
const SPECIALTY_UPDATE_STRING = 'UPDATE specialty';
const SPECIALTY_MEAL_SIDEDISH_JOIN_STRING = 'SELECT * FROM specialty JOIN meal ON specialty.mealId = meal.id JOIN meal_sidedish ON meal_sidedish.mealid = meal.id';



exports.getAllDefaultMeals = (callback) => {
    getMealByParameter('isSpecial = 0', callback);
}

exports.getSpecialMealsByDate = (date, callback) => {
    getSpecialtyJoinedByParameter(`specialty.date = '${date}'`, callback);
}

exports.getSpecialMealsByDateJoinedMeal = (date, callback) => {
    let queryString = `SELECT * FROM specialty JOIN meal ON specialty.mealId = meal.id WHERE specialty.date = '${date}'`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}

exports.getSpecialMealsByDateJoinedMealAndSidedish = (date, callback) => {
    let queryString = `${SPECIALTY_MEAL_SIDEDISH_JOIN_STRING} WHERE specialty.date = '${date}'`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
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


const getSpecialtiesJoinedByDate = (date, callback) => {
    dao.pool.getConnection(function(error, connection) {
        if (error){
            connection.release();
            return callback("Error when establishing connection"); 
        }
        connection.query(`select * from specialty join meal ON specialty.mealId = meal.id JOIN meal_sidedish ON meal_sidedish.mealid = meal.id WHERE specialty.date = '${date}'`, function (error, results, fields) {
            if(error){
                connection.release();
                return callback("Error when establishing connection.");
            }

            if(orderId==0){
                connection.query(`SELECT * FROM meal_order WHERE userId = '${userId}' AND date = '${date}'`, function (error, results, fields) {
                    if(error){
                        connection.release();
                        return callback("Error when selecting meal order.");
                    }
                    let order = results[0];
                    let orderId = order.id;

                    connection.query(`DELETE FROM order_meal_sidedish WHERE orderId = '${orderId}'`, function (error, results, fields) {
                        if(error){
                            connection.release();
                            return callback ("Error when deleting order sidedishes 1.")
                        }
                        return orderSidedishesRecursively(connection, mealId, orderId, sideDishes, 0, sideDishes.length, callback);
                    })
                })
            }
            else{
                connection.query(`DELETE FROM order_meal_sidedish WHERE orderId = '${orderId}'`, function (error, results, fields) {
                    if(error){
                        connection.release();
                        return callback ("Error when deleting order sidedishes 2.")
                    }
                    return orderSidedishesRecursively(connection, mealId, orderId, sideDishes, 0, sideDishes.length, callback);
                })
            }
        });
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
