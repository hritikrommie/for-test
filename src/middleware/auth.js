const jwt = require('jsonwebtoken')
const Hospital = require('../model/hosp')

const auth = async (req,res,next)=>{
    try{
        
        const token = req.header('Authorization').replace('Bearer ','')
        //console.log(token)
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        //console.log(decoded._id)
        const hosp =await Hospital.findOne({_id: decoded._id,'tokens.token':token})
        if(!hosp){
            throw new Error()
        }

        req.token =token
        req.hosp =hosp
        next()
    }
    catch(e){
        res.status(401).send({error: 'Athentication Error!'})
    }
    
}

module.exports = auth