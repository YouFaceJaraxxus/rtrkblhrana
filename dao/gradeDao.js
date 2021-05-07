const dao = require('./dao');

const GRADE_SELECT_STRING = 'SELECT * FROM grade';
const GRADE_UPDATE_STRING = 'UPDATE grate SET;'



exports.getAllGrades = (callback) => {
    let queryString = GRADE_SELECT_STRING; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}

exports.getGradeByMealId = (mealId, callback) => {
    getGradeByParameter(`mealId = '${mealId}'`, callback);
}

exports.addGrade = (mealId, userId, grade, callback) => {
    let queryString = `INSERT INTO grade (mealId, userId, grade) VALUES ('${mealId}', '${userId}', '${grade}') ON DUPLICATE KEY UPDATE grade = '${grade}'`;
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}

exports.deleteGrade = (mealId, userId, callback) => {
    let queryString = `DELETE FROM grade WHERE mealId = '${mealId}' AND userId = '${userId}'`;
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}

const getGradeByParameter = (parameters, callback) => {
    let queryString = `${GRADE_SELECT_STRING} WHERE ${parameters}`;
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}

const updateGradeByParameter = (alteredFields, parameters, callback) => {
    let queryString = `${GRADE_UPDATE_STRING} SET ${alteredFields} WHERE ${parameters}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}