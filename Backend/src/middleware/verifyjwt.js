import jwt from "jsonwebtoken";


function verifyjwt(req,res,next){

    const token = req.cookies?.accesstoken;

    // console.log("token from cookie",token);

    if(!token){
        return res.status(401).json({message: 'bhai token hi nhi mila'});
    }

    try{
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        // console.log("ye bhai data hai: ",decoded)
        req.user = decoded;
        next();
    }
    catch(err){
        console.log("jwt verification error",err.message);
        return res.status(401).json({message: 'bhai token hi nhi mila'});
    }

}

export {verifyjwt}