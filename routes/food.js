const exp = require('express');
const router = exp.Router();
const foodDao = require('../dao/foodDao');
const specialtyDao = require('../dao/specialtyDao');
const sidedishDao = require('../dao/sidedishDao');

router.get('/', (req, res) => {
    res.send("Welcome to login");
});

router.get('/next', (req, res) => {
    specialtyDao.checkNextMonth(result => {
        res.status(200).json(result);
    })
});

router.get('/default', (req, res) => {
    foodDao.getAllDefaultMeals(result => {
        res.status(200).json(result);
    })
})

router.post('/special/date', (req, res) => {
    let date = req.body.date;
    if(date==null) res.status(400).json({message : "Missing date parameter."})
    else{
        specialtyDao.getSpecialMealsByDate(date, result => {
            res.status(200).json(result);
        })
    }
})

router.get('/sidedish/default', (req, res) => {
    sidedishDao.getAllMealSidedishesDefaultJoined(result => {
        res.status(200).json(result);
    })
})

router.get('/sidedish/special', (req, res) => {
    sidedishDao.getAllMealSidedishesSpecialJoined(result => {
        res.status(200).json(result);
    })
})

router.post('/sidedish/special/date', (req, res) => {
    let date = req.body.date;
    if(date==null) res.status(400).json({message : "Missing date parameter."})
    else{
        sidedishDao.getAllMealSidedishesSpecialJoinedByDate(date, result => {
            res.status(200).json(result);
        })
    }
})


module.exports = router;