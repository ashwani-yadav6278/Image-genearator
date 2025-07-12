import User from "../models/userModel.js";
import FormData from 'form-data'
import axios from "axios";


export const generateImage=async (req,res)=>{
    
    try {
        const userId=req.user._id;
    const {prompt}=req.body;

    const user= await User.findById(userId);

    if(!user || !prompt ){
        return res.json({success:false, message:"Missing Details"})
    }
    if(!user.credits===0 || User.credits<0){
        return res.json({success:false, message:"No credits available", credits:user.credits})

        

    }
    const formData=new FormData();
    formData.append('prompt',prompt);

    const {data}=await axios.post("https://clipdrop-api.co/text-to-image/v1",formData,{
        headers: {
    'x-api-key': process.env.CLIPDROP_API_KEY,
   
  },
   responseType:'arraybuffer'
    });

    const base64Image=Buffer.from(data,'binary').toString('base64');
    const resultImage=`data:image/png;base64,${base64Image}`;

    await User.findByIdAndUpdate(user._id,{credits:user.credits -1 });

    res.json({success:true, message:"Image Generated",credits:user.credits -1, resultImage})

    } catch (error) {
        console.log("Error in Generate Image Controller:",error.message);
        return res.status(500).json({msg:"Internal Server error "})
        
    }
    
}

