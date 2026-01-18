import dbConnect from "@/lib/dbconnect";
import UserModel from "@/app/models/User";

export async function POST(req:Request){
    try {
        await dbConnect();
        const {username,verifyCode}=await req.json();
        const user=await UserModel.findOne({username})
        if(!user){
            return Response.json({success:false,message:'Invalid username'},{status:400})
        }
        const isValid=user.verifyCode===verifyCode;
        const isCodeNotExpired=new Date()<new Date(user.verifyCodeExpiry);
        if(isValid && isCodeNotExpired ){
            user.isVerified=true;
            await user.save();
            return Response.json({success:true,message:'User verified successfully'},{status:200})
        }
        return Response.json({success:false,message:'Invalid or expired verification code'},{status:400})

        
    } catch (error) {
        
    }
}