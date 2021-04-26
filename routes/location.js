const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const locationDao = require ('../dao/locationDao');
const util = require('../util');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const unauthorizedGuard = util.unauthorizedGuard;

router.use((req, res, next) => unauthorizedGuard(req, res, next));

router.get('/', (req, res)=>{
    locationDao.getAllLocations((result)=>{
        res.status(200).json(result);
    });
})

router.get('/:id', (req, res)=>{
    let id = req.params['id'];
    locationDao.getLocationById(id, result=>{
        res.status(200).json(result);
    });
})

module.exports = router;