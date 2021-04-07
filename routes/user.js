const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userDao = require ('../dao/userDao');
const util = require('../util');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const SECRET_KEY = process.env.SECRET || 'XG7lFlmY1AH58VLH24djkUJBzXtmzXlP';
const unauthorizedGuard = util.unauthorizedGuard;

router.use((req, res, next) => unauthorizedGuard(req, res, next));

router.get('/', (req, res)=>{
    userDao.getAllUsers((result)=>{
        res.status(200).json(result);
    });
})

router.get('/:id', jsonParser, (req, res)=>{
    let id = req.params['id'];
    userDao.getUserById(id, (result)=>{
        res.status(200).json(result);
    });
})

router.get('/token/:id', jsonParser, (req, res)=>{
    let id = req.params['id'];
    userDao.updateTokenById(id, 'bla',  (result)=>{
        res.status(200).json(result);
    });
})

router.post('/token/:id', jsonParser, (req, res)=>{
    let id = req.params['id'];
    userDao.updateTokenById(id, 'bla',  (result)=>{
        res.status(200).json(result);
    });
})

router.post('/token', jsonParser, (req, res) => {
    let token = req.body.token;
    jwt.verify(token, SECRET_KEY, (err, decode) => {
        if(err) return cb(err);
        res.status(200).json(decode);
    })
})


loginWithCredentials = (req, res) =>{
    let email = req.body.email;
    let password = req.body.password;
    if(email!=null&&password){
        userDao.getUserByEmail(email, (result) => {
            console.log('login by credentials')
            if(result&&result.length>0){
                let user = result[0];
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err==null&&isMatch){
                        let newToken = util.generateToken(user);
                        userDao.updateTokenById(user.id, newToken, result=>{
                            res.cookie('auth', newToken).status(200).json({message:'Login successful.', token:newToken});
                        });
                    }else res.status(401).json({message:'Invalid credentials 1.'});
                })
            }
            else res.status(401).json({message:'Invalid credentials 2.'});
        })
    }else res.status(401).json({message:'Invalid credentials 3.'}); 
    
}

router.post('/login', (req,res)=>{
    let cookies = req.cookies;
    if(cookies&&cookies.auth){
        let token = cookies.auth;
        console.log('login by token');
        userDao.getUserByToken(token, (result)=>{
            console.log('login by token good');
            if(!result||result.length==0){
                loginWithCredentials(req, res)
            }
            else{
                res.status(200).json({message:'Login successful.', token:token})
            }
        });
    }
    else{
        loginWithCredentials(req, res);
    }
})

changePassword = (res, newPassword, user) => {
    bcrypt.genSalt(user.id, (err, salt) => {
        if(err==null&&salt!=null){
            bcrypt.hash(newPassword, salt, (err,hashedNewPassword)=>{
                if(err==null&&hashedNewPassword!=null)
                {
                    userDao.updatePasswordById(user.id, hashedNewPassword, (result)=>{
                        userDao.updateTokenById(user.id, null, result=>{
                            res.status(200).json({message:'Password change successful.'});
                        })
                    })
                }else res.status(401).json({message:'Invalid credentials.'});
            })
        }else res.status(401).json({message:'Invalid credentials.'});
    })
    
}

router.post('/settings/password', (req,res)=>{
    let email = req.body.email;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    if(email!=null&&newPassword!=null){
        userDao.getUserByEmail(email, (result) => {
            if(result&&result.length>0){
                let user = result[0];
                if(user.isActivated==null||user.isActivated==0){
                    changePassword(res, newPassword, user);
                }else if(oldPassword!=null){
                    bcrypt.compare(oldPassword, user.password, (err, isMatch)=>{
                        if(err==null&&isMatch){
                            changePassword(res, newPassword, user);
                        }else res.status(401).json({message:'Invalid credentials.'});
                    })
                }else res.status(401).json({message:'Invalid credentials.'});
            }
            else res.status(401).json({message:'Invalid credentials.'});
        })
    }else res.status(401).json({message:'Invalid credentials.'});
})


module.exports = router;