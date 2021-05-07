const exp = require('express');
const util = require('../util');
const router = exp.Router();
const currentMonthDao = require ('../dao/currentMonthDao');
const unauthorizedGuard = util.unauthorizedGuard;

router.use((req, res, next) => unauthorizedGuard(req, res, next));

router.get('/', (req, res) => {
    currentMonthDao.getCurrentMonth(result => {
        res.status(200).json(result);
    })
});

router.post('/', (req, res) => {
    let currentMonth = req.body.currentMonth;
    if(currentMonth==null){
        res.status(400).json({
            message : 'Invalid parameter (currentMonth cannot be undefined).'
        })
    }
    else{
        currentMonthDao.updateCurrentMonth(currentMonth, result => {
            res.status(200).json(result);
        })
    }
    
});


module.exports = router;