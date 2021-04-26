const dao = require('./dao');

const MEAL_ORDER_SELECT_STRING = 'SELECT * FROM meal_order';
const MEAL_ORDER_UPDATE_STRING = 'UPDATE meal_order';




exports.getAllOrders = (callback) => {
    dao.sendQuery(MEAL_ORDER_SELECT_STRING, (response)=>{
        return callback(response)
    });
}

exports.getAllOrdersByDate = (date, callback) => {
    getOrderByParameter(`date = '${date}'`, callback);
}

exports.getAllOrdersByUser = (userId, callback) => {
    getOrderByParameter(`userId = '${userId}'`, callback);
}

exports.getAllOrdersByUserAndDate = (userId, date, callback) => {
    getOrderByParameter(`userId = '${userId}' and date = '${date}'`, callback);
}

const orderSidedishesRecursively = (connection, mealId, orderId, sideDishes, currentPosition, length, callback) => {
    if(length>0){
        let currentSidedish = sideDishes[currentPosition];
        connection.query(`INSERT INTO order_meal_sidedish (orderId, mealId, sidedishId) VALUES ('${orderId}', '${mealId}', '${currentSidedish}')`, function (error, results, fields) {
            if(error){
                connection.release();
                return callback("Error when inserting order sidedish.");
            }
            if(currentPosition==length-1){
                connection.release();
                return callback(orderId);
            }
            else return recursiveCall(connection, mealId, orderId, sideDishes, currentPosition+1, length, callback);
        });
    }
    else{
        connection.release();
        return callback(orderId);
    }
    
}

const recursiveCall = (connection, mealId, orderId, sideDishes, currentPosition, length, callback) => {
    return orderSidedishesRecursively(connection, mealId, orderId, sideDishes, currentPosition, length, callback);
}

//returns the id of the created/updated meal, also clean up the sidedishes
exports.orderMeal = (userId, date, mealId, locationId, timeId, sideDishes, callback) => {
    dao.pool.getConnection(function(error, connection) {
        if (error){
            connection.release();
            return callback("Error when establishing connection"); 
        }
        connection.query(`INSERT INTO meal_order (userId, date, mealId, locationId, timeId) VALUES ('${userId}', '${date}', '${mealId}', '${locationId}', '${timeId}') ON DUPLICATE KEY UPDATE mealId = '${mealId}', locationId= '${locationId}', timeId = '${timeId}'`, function (error, results, fields) {
            if(error){
                connection.release();
                return callback("Error when establishing connection.");
            }
            let orderId = results.insertId;

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

exports.deleteOrder = (userId, date, callback) => {
    dao.pool.getConnection(function(error, connection) {
        if (error) return callback("Error when establishing connection") 
        connection.query(`SELECT * FROM meal_order WHERE userId = '${userId}' AND date = '${date}'`, function (error, results, fields) {
            if(error){
                connection.release();
                return callback ("Error when selecting meal order.")
            }
            if(results&&results[0]){
                let mealOrder = results[0];
                return connection.query(`DELETE FROM order_meal_sidedish WHERE orderId = ${mealOrder.id}`, function (error, results, fields) {
                    if(error){
                        connection.release();
                        return callback ("Error when deleting meal sidedish.")
                    }
                    return connection.query(`DELETE FROM meal_order WHERE userId = '${userId}' AND date = '${date}'`, function (error, results, fields) {
                        connection.release();
                        if(error){
                            console.log(error)
                            return callback ("Error when deleting order.")
                        }
                        return callback(mealOrder.id);
                    })
                })
            }else{
                connection.release();
                return callback("Info : No such order exists");
            }
        });
    });
}

exports.orderSidedish = (orderId, mealId, sidedishId, callback) => {
    dao.pool.getConnection(function(error, connection) {
        if (error) return callback("Error when establishing connection");
        connection.query(`SELECT * FROM meal_sidedish WHERE mealId = '${mealId}' AND sidedishId = '${sidedishId}'`, function (error, results, fields) {
            if(results&&results.length>0){
                
                connection.query(`INSERT INTO order_meal_sidedish (orderId, mealId, sidedishId) VALUES ('${orderId}', '${mealId}', '${sidedishId}')`, function (error, results, fields) {
                    connection.release();
                    if (error){
                        return callback("Error when inserting order sidedish.");
                    }
                    return callback(results);
                });
            }else{
                connection.release();
                return callback('Info : No such sidedish exists for that order');
            }
            return callback(results);
        });
    });
    
}

exports.getMealById = (id, callback) => {
    getMealByParameter(`id = '${id}'`, callback);
}

exports.updateMealById = (id, newMeal, callback) => {
    updateUserByParameter(`name = '${newMeal.name}', isSpecial = '${newMeal.isSpecial}', imageUrl = '${newMeal.imageUrl}', isActive = '${newMeal.isActive}', listOrder = '${newMeal.listOrder}', date = '${newMeal.date}'`, `id = ${id}`, callback)
}


const getOrderByParameter = (parameters, callback) => {
    let queryString = `${MEAL_ORDER_SELECT_STRING} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}


const updateOrderByParameter = (alteredFields, parameters, callback) => {
    let queryString = `${MEAL_ORDER_UPDATE_STRING} SET ${alteredFields} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}
