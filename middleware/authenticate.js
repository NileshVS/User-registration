const jwt = require('jsonwebtoken');
const config= require('config');

function authMiddleware (req,res,next){
    let token = req.header('x-auth-token');
    if(!token){ res.send('Token not found, please login first');}
    try{
        let decoded = jwt.verify(token, config.get('jwtKey'))
        req.decodedJwt=decoded;
        next();
    }
    catch(ex){
        res.send('Token signature not verified');
        console.log(ex.message);
    }
}

module.exports= authMiddleware;