const exp = require('express');
const util = require('../util');
const router = exp.Router();
const foodDao = require('../dao/foodDao');
const specialtyDao = require('../dao/specialtyDao');
const sidedishDao = require('../dao/sidedishDao');
const orderDao = require('../dao/orderDao');
const unauthorizedGuard = util.unauthorizedGuard;

router.use((req, res, next) => unauthorizedGuard(req, res, next));

sidedishMap = new Map();

const NO_SIDEDISH = 5;

var curentMonth = new Date().getMonth();

sidedishDao.getAllSidedishes(result => {
    for(let sidedish of result)
    {
        sidedishMap[sidedish.id] = sidedish.name;
    }
})

router.get('/', (req, res) => {
    res.send("Welcome to login");
});


router.post('/order', (req, res) => {
    let userId = req.body.userId&&req.body.currentUser.isAdmin==1 ? req.body.userId : req.body.currentUser.id;
    let date = req.body.date;
    let mealId = req.body.mealId;
    let locationId = req.body.locationId;
    let timeId = req.body.timeId;
    let sideDishes = req.body.sideDishes;
    console.log('ORDER REQUEST');
    console.log('userId', userId);
    console.log('date', date);
    console.log('mealId', mealId);
    console.log('locationId', locationId);
    console.log('timeId', timeId);
    console.log('sideDishes', sideDishes);
    orderDao.orderMeal(userId, date, mealId, locationId, timeId, sideDishes, result => {
        console.log('got result', result);
        if(result&&result.toString().includes()){
            res.status(400).json(result);
        }else{
            res.status(201).json(result);
        }
    })
})

router.post('/delete', (req, res) => {
    let userId = req.body.userId&&req.body.currentUser.isAdmin==1 ? req.body.userId : req.body.currentUser.id;
    let date = req.body.date;
    console.log('ORDER DELETE');
    console.log('userId', userId);
    console.log('date', date);
    orderDao.deleteOrder(userId, date, result => {
        if(result&&result.toString().includes('Error')){
            res.status(400).json(result);
        }else{
            res.status(204).json(result);
        }
    })
})

router.post('/user/all', (req, res) => {
    let userId = req.body.userId&&req.body.currentUser.isAdmin==1 ? req.body.userId : req.body.currentUser.id;
    console.log('userId', userId);
    if(userId!=null){
        orderDao.getAllOrdersByUserJoined(userId, result => {
            if(result&&result.toString().includes('Error')){
                res.status(400).json(result);
            }else{
                let meals = [];
                for(let meal of result){
                    let foundItem = meals.find(item => item.id == meal.id);
                    if(foundItem!=null){
                        let sidedishObject = {
                            sidedishId: meal.sidedishId,
                            mealId : meal.mealId,
                            name : sidedishMap[meal.sidedishId]
                        };
                        foundItem.sidedishes.push(sidedishObject);
                    }
                    else{
                        if(meal.sidedishId != NO_SIDEDISH){
                            meal.sidedishes = [];
                            let sidedishObject = {
                                sidedishId: meal.sidedishId,
                                mealId : meal.mealId,
                                name : sidedishMap[meal.sidedishId]
                            };
                            meal.sidedishes.push(sidedishObject);
                        }
                        delete meal.sidedishId;
                        meals.push(meal);
                    }
                }
                res.status(200).json(meals);
            }
        })
    }else{
        res.status(400).json({message : "Error : Invalid request."});
    }
})

router.post('/user/date', (req, res) => {
    let userId = req.body.userId&&req.body.currentUser.isAdmin==1 ? req.body.userId : req.body.currentUser.id;
    let date = req.body.date;
    console.log('userId', userId);
    console.log('date', date);
    if(date!=null&&userId!=null){
        orderDao.getAllOrdersByUserAndDate(userId, date, result => {
            if(result&&result.toString().includes('Error')){
                res.status(400).json(result);
            }else{
                res.status(200).json(result);
            }
        })
    }else{
        res.status(400).json({message : "Error : Invalid request."});
    }
    
})



module.exports = router;