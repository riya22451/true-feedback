import UserModel from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import { User } from "next-auth";
export async function POST(req:Request){
    try {
        await dbConnect();
        const session=await getServerSession(authOptions)
        const user:User=session?.user
        if(!user || !session){
            return Response.json({success:false,message:'Unauthorized'},{status:401})
        }
        const user_id=user._id
        const {acceptMessages}=await req.json();
        const updatedUser=await UserModel.findByIdAndUpdate(user_id,{isAcceptingMessages:acceptMessages},{new:true})
        if(!updatedUser){
            return Response.json({success:false,message:'failed to update user status'},{status:404})
        }
        return Response.json({success:true,message:'User status updated successfully',data:{isAcceptingMessages:updatedUser.isAcceptingMessages}},{status:200})

       
    } catch (error) {
        console.error(error);
        return Response.json({success:false,message:'failed to update user to accept messages'},{status:500})
    }
}
export async function GET(req:Request){
    try {
         await dbConnect();
        const session=await getServerSession(authOptions)
        const user:User=session?.user
        if(!user || !session){
            return Response.json({success:false,message:'Unauthorized'},{status:401})
        }
        const user_id=user._id
        const existingUser=await UserModel.findById(user_id);
        if(!existingUser){
            return Response.json({success:false,message:'User not found'},{status:404})
        }
        return Response.json({success:true,message:'User status fetched successfully',data:{isAcceptingMessages:existingUser.isAcceptingMessages}},{status:200})
    } catch (error) {
         console.error(error);
        return Response.json({success:false,message:'failed to get user status for accept messages'},{status:500})
    }
}