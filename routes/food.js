const exp = require('express');
const util = require('../util');
const router = exp.Router();
const foodDao = require('../dao/foodDao');
const specialtyDao = require('../dao/specialtyDao');
const sidedishDao = require('../dao/sidedishDao');
const currentMonthDao = require('../dao/currentMonthDao');
const gradeDao = require('../dao/gradeDao');
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
    console.log(sidedishMap);
})

currentMonthDao.getCurrentMonth(result => {
    let currentMonthObject = result[0];
    if(currentMonthObject){
        currentMonth = currentMonthObject.month;
    }
})



router.get('/', (req, res) => {
    res.send("Welcome to login");
});

router.get('/next', (req, res) => {
    specialtyDao.checkNextMonth(result => {
        res.status(200).json(result);
    })
});

router.get('/default', (req, res) => {
    foodDao.getAllDefaultMealsJoinedSidedish(result => {
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
    })
})


router.post('/special/date', (req, res) => {
    let date = req.body.date;
    if(date==null) res.status(400).json({message : "Missing date parameter."})
    else{
        specialtyDao.getSpecialMealsByDateJoinedMealAndSidedish(date, result => {
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

router.get('/grades', (req, res) => {
    gradeDao.getAllGrades(result => {
        res.status(200).json(result);
    })
})

router.get('/grade/:mealId', (req, res) => {
    let mealId = req.params['mealId'];
    gradeDao.getGradeByMealId(mealId, result => {
        res.status(200).json(result);
    })
})

//add or update a grade and then fetch all the grades for the meal
router.post('/grade', (req, res) => {
    let grade = req.body.grade;
    if(grade==null) res.status(400).json({message : "Missing grade parameter."})
    else{
        let mealId = req.body.mealId;
        let userId = req.body.currentUser.id;
        gradeDao.addGrade(mealId, userId, grade, result => {
            gradeDao.getGradeByMealId(mealId, result => {
                res.status(200).json(result);
            })
        })
    }
})




module.exports = router;