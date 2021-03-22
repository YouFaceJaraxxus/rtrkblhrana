const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET || 'XG7lFlmY1AH58VLH24djkUJBzXtmzXlP';

exports.generateToken = (user) => {
    let baseString = user.email+';'+user.password+';'+user.id;
    console.log('baseString', baseString);
    return jwt.sign((baseString.toString(16)), SECRET_KEY); //toString(16) == get Hex String
}


