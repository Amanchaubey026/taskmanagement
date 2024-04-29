const jwt = require('jsonwebtoken')
const auth = (req,res,next)=>{
    const token = req.header('Authorization').split(" ")[1];
    if(!token){
        return res.status(401).send({error:'Unauthorized- the token is missing'});
    }

    jwt.verify(token,process.env.JWT_Secret,(error,decoded)=>{
        if(error){
            return res.status(401).send({error:'Unauthorized- the token is Invalid'})
        }
        req.userID = decoded.userID;
        req.role = decoded.role;
        // console.log(decoded);
        next();
    })
}

module.exports = {
    auth
}