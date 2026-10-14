const jwt = require("jsonwebtoken")

module.exports = (req, res, next)=>{
    const header = req.headers.authorization;
    if(!header){
        return res.status(401).json({
            error:"Please Login First."
        })
    }
    const token = header.split(" ")[1];
    
    console.log("Done")
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        next();
    } catch(err){
        res.status(401).json({
            error:"Session expired. Please login again."
        })
    }
}