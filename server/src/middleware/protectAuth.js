
import jwt from 'jsonwebtoken';
import User  from '../models/userModel.js';

const protectRoute=async(req,res,next)=>{
    try {
        

         // Check cookie first
    let token = req.cookies?.jwt;

    // If not in cookie, check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
        if(!token){
            return res.status(401).json({success:false,message:'Unauthorized: No token provide'});
        }

        const decode=await jwt.verify(token,process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({success:false, message:'Unauthorized: Invalid token'});
        }
        const user=await User.findById(decode.userId).select("-password")
        if(!user){
            return res.status(404).json({success:false,message:' User not found'});

        }
        req.user=user;
        next();
    } catch (error) {
        console.log("Error in protect route:", error);
    res.status(500).json({success:false, message: "Internal Server Error" });
    }
}
export default protectRoute;