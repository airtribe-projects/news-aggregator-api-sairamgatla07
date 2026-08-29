const jwt = require("jsonwebtoken");


async function checkToken(req, res , next){
    try{

        const authHeader = req.headers?.authorization ;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({"message":"Token needed, Please Login"});
        }
        const token = authHeader.split(" ")[1];
        const decoded =   jwt.verify(token ,process.env.JWT_SECRET_KEY ) ; 
        req.user = decoded ;

        next();
    }catch(err){
        console.log("Token verification failed ", err);
        return res.status(401).json({"message":"Invalid Token, Please Login"})
    }
}

module.exports = checkToken ;