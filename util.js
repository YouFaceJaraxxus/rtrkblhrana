const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET || 'XG7lFlmY1AH58VLH24djkUJBzXtmzXlP';
const userDao = require('./dao/userDao')

exports.generateToken = (user) => {
    let baseString = user.email+';'+user.password+';'+user.id;
    console.log('baseString', baseString);
    return jwt.sign((baseString.toString(16)), SECRET_KEY); //toString(16) == get Hex String
}


exports.unauthorizedGuard = (req, res, next) => {
    if(req.url!='/login'){
        let cookies = req.cookies;
        if(cookies&&cookies.auth){
            let token = cookies.auth;
            userDao.getUserByToken(token, (result)=>{
                if(!result||result.length==0){
                    res.status(401).json({ message: "Unauthorized" });
                }
                else{
                    console.log('verify by token good');
                    let currentUser = result[0];
                    req.body.currentUser = currentUser;
                }
            });
        }else res.status(401).json({ message: "Unauthorized" });
        
    }else next();
}