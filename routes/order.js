const exp = require('express');
const util = require('../util');
const router = exp.Router();
const foodDao = require('../dao/foodDao');
const specialtyDao = require('../dao/specialtyDao');
const sidedishDao = require('../dao/sidedishDao');
const orderDao = require('../dao/orderDao');
const unauthorizedGuard = util.unauthorizedGuard;

router.use((req, res, next) => unauthorizedGuard(req, res, next));

router.get('/', (req, res) => {
    res.send("Welcome to login");
});


router.post('/order', (req, res) => {
    let userId = req.body.userId;
    let date = req.body.date;
    let mealId = req.body.mealId;
    let locationId = req.body.locationId;
    let time = req.body.time;
    let sideDishes = req.body.sideDishes;
    orderDao.orderMeal(userId, date, mealId, locationId, time, sideDishes, result => {
        
        res.status(200).json(result);
        
    })
})



module.exports = router;