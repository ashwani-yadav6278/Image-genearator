import jwt from 'jsonwebtoken'

const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'7d'
    }) 
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("jwt",token,{
        maxAge:5*24*60*60*1000,
        httpOnly:true,
        secure:isProduction,
        sameSite:isProduction ? "None" : "Lax",
    })
    return token;
}
export default generateToken;