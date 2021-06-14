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
const INITIAL_PASSWORD = 'hrana';

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
        userDao.getUserByEmail(email, (user) => {
            console.log('login by credentials')
            if(user){
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err==null&&isMatch){
                        let newToken = util.generateToken(user);
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
    if(cookies&&cookies.auth){
        let token = cookies.auth;
        console.log('login by token');
        userDao.getUserByToken(token, (user)=>{
            console.log('login by token good');
            if(user==null){
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

router.post('/add', (req,res)=>{
    if(req.body.currentUser.isAdmin==1){
        let name = req.body.name;
        let lastName = req.body.lastName;
        let email = req.body.email;
        let sendOrderEmail = req.body.sendOrderEmail;
        let sendForgotOrderEmail = req.body.sendForgotOrderEmail;
        let isAdmin = req.body.isAdmin;
        let isActivated = req.body.isActivated;
        if(name==null) res.status(400).json({message:'Name was not provided.'});
        else if(lastName==null) res.status(400).json({message:'Last name was not provided.'});
        else if(email==null) res.status(400).json({message:'Email was not provided.'});
        else{
            userDao.getUserByEmail(email, user=>{
                if(user){
                    res.status(422).json({message:`Email '${email}' already exists.`});
                }else{
                    userDao.addUser(name, lastName, email, INITIAL_PASSWORD, sendForgotOrderEmail, sendForgotOrderEmail, isAdmin, isActivated, result=>{
                        let userId = result.insertId;
                        if(userId){
                            bcrypt.genSalt(userId, (err, salt) => {
                                if(err==null&&salt!=null){
                                    bcrypt.hash(INITIAL_PASSWORD, salt, (err,hashedNewPassword)=>{
                                        if(err==null&&hashedNewPassword!=null)
                                        {
                                            userDao.updatePasswordById(userId, hashedNewPassword, (result)=>{
                                                res.setHeader('Location', `https://rtrkblhrana.herokuapp.com/user/${userId}`);
                                                res.status(201).json({message:'User successfully added.', id: userId});
                                            })
                                        }else res.status(422).json({message:'Error when saving changed password.'});
                                    })
                                }else res.status(422).json({message:'Error when changing password.'});
                            })
                        }else res.status(422).json({message:'Error when adding user.'});
                    })
                }
            })
        }
    }else res.status(403).json({message:'Access denied.'});
    
})

changePassword = (res, newPassword, userId) => {
    bcrypt.genSalt(userId, (err, salt) => {
        if(err==null&&salt!=null){
            bcrypt.hash(newPassword, salt, (err,hashedNewPassword)=>{
                if(err==null&&hashedNewPassword!=null)
                {
                    userDao.updatePasswordById(userId, hashedNewPassword, (result)=>{
                        userDao.updateTokenById(userId, null, result=>{
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
        userDao.getUserByEmail(email, (user) => {
            if(user){
                if(user.isActivated==null||user.isActivated==0){
                    changePassword(res, newPassword, user.id);
                }else if(oldPassword!=null){
                    bcrypt.compare(oldPassword, user.password, (err, isMatch)=>{
                        if(err==null&&isMatch){
                            changePassword(res, newPassword, user.id);
                        }else res.status(401).json({message:'Invalid credentials.'});
                    })
                }else res.status(401).json({message:'Invalid credentials.'});
            }
            else res.status(401).json({message:'Invalid credentials.'});
        })
    }else res.status(401).json({message:'Invalid credentials.'});
})

router.post('/settings/emailPreferences', (req,res)=>{
    let sendOrderEmail = req.body.sendOrderEmail;
    let sendForgotOrderEmail = req.body.sendForgotOrderEmail;
    let user = req.body.currentUser;
    if(user!=null){
        if(sendOrderEmail!=null&&sendForgotOrderEmail!=null){
            userDao.updateEmailPreferencesById(user.id, sendOrderEmail, sendForgotOrderEmail, result => {
                user.sendOrderEmail = sendOrderEmail;
                user.sendForgotOrderEmail = sendForgotOrderEmail;
                userDao.setCache(user.token, user);
                req.body.currentUser = user;
                res.status(200).json({message:'Email preferences change successful.'});
            })
        }else res.status(422).json({message:'Missing request field/s.'});
    }else res.status(401).json({message:'Invalid credentials.'});
})

router.get('/settings/emailPreferences', (req,res)=>{
    let user = req.body.currentUser;
    let sendOrderEmail = user.sendOrderEmail;
    let sendForgotOrderEmail = user.sendForgotOrderEmail;
    if(user!=null){
        if(sendOrderEmail!=null&&sendForgotOrderEmail!=null){
            userDao.updateEmailPreferencesById(user.id, sendOrderEmail, sendForgotOrderEmail, result => {
                res.status(200).json(
                    {sendOrderEmail : sendOrderEmail, sendForgotOrderEmail:sendForgotOrderEmail}
                );
            })
        }else res.status(422).json({message:'Missing request field/s.'});
    }else res.status(401).json({message:'Invalid credentials.'});
})


module.exports = router;