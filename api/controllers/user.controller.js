import User from "../models/model.user.js";

export const getUser=async(req,res)=>{
    try{
        const user=await User.findById(req.params.userId);
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.json(user)
    }catch(error){
        console.error(error);
        res.status(500).json({message:error.message})
    }
 
}