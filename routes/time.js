const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const timeDao = require ('../dao/timeDao');
const util = require('../util');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const unauthorizedGuard = util.unauthorizedGuard;

router.use((req, res, next) => unauthorizedGuard(req, res, next));

router.get('/', (req, res)=>{
    timeDao.getAllTimes((result)=>{
        res.status(200).json(result);
    });
})

router.get('/:id', (req, res)=>{
    let id = req.params['id'];
    timeDao.getTimeById(id, result=>{
        res.status(200).json(result);
    });
})

module.exports = router;