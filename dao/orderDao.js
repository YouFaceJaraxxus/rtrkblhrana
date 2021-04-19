const dao = require('./dao');

const MEAL_ORDER_SELECT_STRING = 'SELECT * FROM meal_order';
const MEAL_ORDER_UPDATE_STRING = 'UPDATE meal_order';




exports.getAllOrders = (callback) => {
    dao.sendQuery(MEAL_ORDER_SELECT_STRING, (response)=>{
        return callback(response)
    });
}

exports.getAllOrdersByDate = (date, callback) => {
    getMealByParameter(`date = '${date}'`, callback);
}

exports.getAllOrdersByUser = (userId, callback) => {
    getMealByParameter(`userId = '${userId}'`, callback);
}

exports.getAllOrdersByUserAndDate = (userId, date, callback) => {
    getMealByParameter(`userId = '${userId}' and date = '${date}'`, callback);
}

const orderSidedishesRecursively = (connection, orderId, sideDishes, currentPosition, length, callback) => {
    let currentSidedish = sideDishes[currentPosition];
    connection.query(`INSERT INTO order_meal_sidedish (orderId, mealId, sidedishId) VALUES ('${orderId}', '${currentSidedish.mealId}', '${currentSidedish.sidedishId}')`, function (error, results, fields) {
        console.log(results);
        // When done with the connection, release it.
        if(currentPosition==length-1){
            connection.release();
                    
            // Handle error after the release.
            return callback(orderId);
        }

        else return recursiveCall(connection, orderId, sideDishes, currentPosition+1, length, callback);
        

        // Don't use the connection here, it has been returned to the pool.
        
    });
}

const recursiveCall = (connection, orderId, sideDishes, currentPosition, length, callback) => {
    return orderSidedishesRecursively(connection, orderId, sideDishes, currentPosition, length, callback);
}

//returns the id of the created/updated meal, also clean up the sidedishes
exports.orderMeal = (userId, date, mealId, locationId, time, sideDishes, callback) => {
    dao.pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        
        // Use the connection
        connection.query(`INSERT INTO meal_order (userId, date, mealId, locationId, time) VALUES ('${userId}', '${date}', '${mealId}', '${locationId}', '${time}') ON DUPLICATE KEY UPDATE mealId = '${mealId}', locationId= '${locationId}', time = '${time}'`, function (error, results, fields) {
            console.log('order results', results);
            let orderId = results.insertId;

            if(orderId==0){
                connection.query(`SELECT * FROM meal_order WHERE userId = '${userId}' AND date = '${date}'`, function (error, results, fields) {
                    let order = results[0];
                    let orderId = order.id;

                    connection.query(`DELETE FROM order_meal_sidedish WHERE orderId = '${orderId}'`, function (error, results, fields) {
                        // When done with the connection, release it.
                        return orderSidedishesRecursively(connection, orderId, sideDishes, 0, sideDishes.length, callback);
                    })
                })
            }
            else{
                connection.query(`DELETE FROM order_meal_sidedish WHERE orderId = '${orderId}'`, function (error, results, fields) {
                    // When done with the connection, release it.
                    return orderSidedishesRecursively(connection, orderId, sideDishes, 0, sideDishes.length, callback);
                })
            }

            
        });
    });
}

exports.deleteOrder = (userId, date, callback) => {
    dao.pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        
        // Use the connection
        connection.query(`SELECT * FROM meal_order WHERE userId = '${userId}' AND date = '${date}'`, function (error, results, fields) {
            console.log(results);
            if(results&&results.length>0){
                let mealOrder = results[0];
                connection.query(`DELETE FROM order_meal_sidedish WHERE orderId = '${mealOrder.id}'`, function (error, results, fields) {
                    // When done with the connection, release it.
                    connection.release();
                        
                    // Handle error after the release.
                    if (error) throw error;
                    return callback(results);
    
                    // Don't use the connection here, it has been returned to the pool.
                })
            }else{
                console.log('no such meal_order');
                // When done with the connection, release it.
                connection.release();
                        
                // Handle error after the release.
                if (error) throw error;

                // Don't use the connection here, it has been returned to the pool.
            }
            return callback(results);
            
        });
    });
}

exports.orderSidedish = (orderId, mealId, sidedishId, callback) => {
    dao.pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        

        connection.query(`SELECT * FROM meal_sidedish WHERE mealId = '${mealId}' AND sidedishId = '${sidedishId}'`, function (error, results, fields) {
            if(results&&results.length>0){
                // Use the connection
                connection.query(`INSERT INTO order_meal_sidedish (orderId, mealId, sidedishId) VALUES ('${orderId}', '${mealId}', '${sidedishId}')`, function (error, results, fields) {
                    console.log(results);
                    // When done with the connection, release it.
                    connection.release();
                                
                    // Handle error after the release.
                    if (error) throw error;
                    return callback(results);

                    // Don't use the connection here, it has been returned to the pool.
                    
                });
            }else{
                console.log('no such meal_sidedish');
                connection.release();
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
