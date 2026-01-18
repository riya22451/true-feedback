import dbConnect from "@/lib/dbconnect";
import UserModel from "@/app/models/User";
import {z} from "zod";
import { usernameValidation } from "@/app/Schemas/signUpSchema";

const usernameVerifySchema=z.object({
    username:usernameValidation
})

export async function GET(req:Request){
    // if(req.method!=='GET'){
    //     return Response.json({success:false,message:'Method not allowed'},{status:405})
    // }
    try {
        await dbConnect();
        const {searchParams}=new URL(req.url);
        const queryParams={
            username:searchParams.get('username')
        }
        const result=usernameVerifySchema.safeParse(queryParams);
      if(!result.success){
        return Response.json({success:false,message:'invalid username'},{status:400})
      }
      const{username}=result.data;
      const existingUser=await UserModel.findOne({username,isVerified:true});
      if(existingUser){
        return Response.json({success:false,message:'Username already taken'},{status:400})
      }
       return Response.json({success:true,message:'Username is unique'},{status:200})

    } catch (error) {
        console.error(error);
        return Response.json({success:false,message:'Server error checking username'},{status:500})
    }
}