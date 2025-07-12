import jwt from 'jsonwebtoken'

const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'7d'
    }) 
    
    res.cookie("jwt",token,{
        maxAge:5*24*60*60*1000,
        httpOnly:true,
        secure:process.env.NODE_ENV !=='development',
        sameSite:"lax"
    })
    return token;
}
export default generateToken;