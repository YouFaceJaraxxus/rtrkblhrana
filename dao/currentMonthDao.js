const dao = require('./dao');

const CURRENT_MONTH_SELECT_STRING = 'SELECT * FROM current_month WHERE id = 1';
const CURRENT_MONTH_UPDATE_STRING_1 = 'UPDATE current_month SET month =';
const CURRENT_MONTH_UPDATE_STRING_2 = `WHERE id = '1'`;



exports.getCurrentMonth = (callback) => {
    let queryString = CURRENT_MONTH_SELECT_STRING; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}

exports.updateCurrentMonth = (currentMonth, callback) => {
    let queryString = `${CURRENT_MONTH_UPDATE_STRING_1} '${currentMonth}' ${CURRENT_MONTH_UPDATE_STRING_2}`; 
    dao.sendQuery(queryString, (response)=>{
        return callback(response)
    });
}