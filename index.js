const express = require('express');
const bodyParser = require('body-parser');
const exp = express();
const mysql = require('mysql');
const userDao = require ('./dao/userDao');



exp.use(bodyParser.urlencoded({ extended: true }));
exp.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});



exp.get('/', (req,res)=>{
    res.send(`
        <html>
            <body>
                <h1> Duvaj ga Slobo. </h1>
            </body>
        </html>
    `)
})


exp.get('/user', (req, res)=>{
    userDao.getAllUsers((result)=>{
        console.log('user', result);
        res.send(JSON.stringify(result));
    });
})

exp.get('/user/:id', (req, res)=>{
    let id = req.params['id'];
    userDao.getUserById(id, (result)=>{
        console.log('user by id ' + id, result);
        res.send(JSON.stringify(result));
    });
})

const port = process.env.PORT || 3000;

exp.listen(port,()=>{
    console.log(`Started on port ${port}`);
})
console.log('SERVER STARTED!')