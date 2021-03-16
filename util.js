const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET;

generateToken = (user) => {
    return jwt.sign(user.id.toHexString(), SECRET_KEY);
}

applySalt = (password, salt) => {
    bcrypt.genSalt(SALT, (err,salt)=>{
        if(err) return null;
        else{
            bcrypt.hash(password,salt, (err,saltedHash) => {
                if(err) return null;
                else{
                    return saltedHash;
                }
            })
        }
    })
}

