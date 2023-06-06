const jwt = require("jsonwebtoken");

const authenticate = (req,res,next)=>{
    const token = req.headers.authorization;
    try {
        if(token){
            jwt.verify(token, 'ALPHA', (err, decoded)=>{
                if(decoded){
                    req.body.email = decoded.email;
                    req.body._id = decoded._id
                    next()
                }else{
                    console.log(err);
                    req.send(err.message)
                }
              });
        }
        else{
            res.send("Token Expired")
        }
    } catch (error) {
        console.log(error);
        res.send("ERROR in authenticate middleware")
    }
}

module.exports = {
    authenticate
}