function isAdmin(req,res,next){
    let admin = req.decodedJwt.isAdmin;
    if(!admin){
        res.send('Access Denied, please contact administrator');
    }
    else{
        next();
    }
}

module.exports= isAdmin;