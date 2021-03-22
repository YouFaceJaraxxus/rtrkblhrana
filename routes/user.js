const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userDao = require ('../dao/userDao');
const util = require('../util');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const SECRET_KEY = process.env.SECRET || 'XG7lFlmY1AH58VLH24djkUJBzXtmzXlP';

router.get('/', (req, res)=>{
    userDao.getAllUsers((result)=>{
        console.log('user', result);
        res.status(200).json(result);
    });
})

router.get('/:id', jsonParser, (req, res)=>{
    let id = req.params['id'];
    userDao.getUserById(id, (result)=>{
        console.log('user by id ' + id, result);
        res.status(200).json(result);
    });
})

router.get('/token/:id', jsonParser, (req, res)=>{
    let id = req.params['id'];
    userDao.updateTokenById(id, 'bla',  (result)=>{
        console.log('user by id ' + id, result);
        res.status(200).json(result);
    });
})

router.post('/token/:id', jsonParser, (req, res)=>{
    let id = req.params['id'];
    userDao.updateTokenById(id, 'bla',  (result)=>{
        console.log('user by id ' + id, result);
        res.status(200).json(result);
    });
})

router.post('/token', jsonParser, (req, res) => {
    let token = req.body.token;
    jwt.verify(token, SECRET_KEY, (err, decode) => {
        if(err) return cb(err);
        res.status(200).json(decode);
    })

    
    /*userDao.getUserByToken(token, (result)=>{
        console.log('user by token ' + token, result);
        res.send(JSON.stringify(result));
    });*/
})


loginWithCredentials = (req, res) =>{
    let email = req.body.email;
    let password = req.body.password;
    if(email!=null&&password){
        userDao.getUserByEmail(email, (result) => {
            console.log('login by credentials', result)
            if(result&&result.length>0){
                let user = result[0];
                console.log('user', user.id)
                let saltedPassword = password+user.id;
                bcrypt.compare(saltedPassword, user.password, (err, isMatch)=>{
                    if(err==null&&isMatch){
                        let newToken = util.generateToken(user);
                        console.log('newToken', newToken)
                        userDao.updateTokenById(user.id, newToken, result=>{
                            res.cookie('auth', newToken).status(200).json({message:'Login successful.', token:newToken});
                        });
                    }else res.status(401).json({message:'Invalid credentials.'});
                })
            }
            else res.status(401).json({message:'Invalid credentials.'});
        })
    }else res.status(401).json({message:'Invalid credentials.'}); 
    
}

router.post('/login', (req,res)=>{
    let cookies = req.cookies;
    console.log(cookies);
    if(cookies&&cookies.auth){
        let token = cookies.auth;
        console.log('login by token', token);
        userDao.getUserByToken(token, (result)=>{
            console.log('login by token good', result);
            console.log(result);
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
                        console.log('result of updating password', result);
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
            console.log('settings by credentials 1', result)
            if(result&&result.length>0){
                let user = result[0];
                console.log('user', user.id)
                if(user.isActivated==null||user.isActivated==0){
                    changePassword(res, newPassword, user);
                }else if(oldPassword!=null){
                    bcrypt.hash(oldPassword,user.id, (err,hash) => {
                        console.log('hash', hash);
                        console.log(user.password);
                    })
                    bcrypt.genSalt(user.id, (err, salt) => {
                        if(err==null&&salt!=null){
                            bcrypt.hash(oldPassword, salt, (err,hashedOldPassword)=>{
                                if(err==null&&hashedOldPassword!=null)
                                {
                                    console.log('hashedOldPassword', hashedOldPassword)
                                }
                            })
                        }
                    })
                    bcrypt.compare(oldPassword, user.password, (err, isMatch)=>{
                        console.log(err);
                        console.log(isMatch);
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