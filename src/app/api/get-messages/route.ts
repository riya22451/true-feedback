import UserModel from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import { User } from "next-auth";
import mongoose, { mongo } from "mongoose";

export async function GET(req:Request){
    try {
        await dbConnect();
        const session=await getServerSession(authOptions)
        const user:User=session?.user
        if(!user || !session){
            return Response.json({success:false,message:'Unauthorized'},{status:401})
        }
        const user_id=user._id
        const userId=new mongoose.Types.ObjectId(user_id);
        try {
            const messages=await UserModel.aggregate([
                {$match:{_id:userId}},
                {$unwind:"$messages"},
                {$sort:{'messages.createdAt':-1}},
                {$group:{_id:'$_id',messages:{$push:'$messages'}}}
            ])
            if(!messages || messages.length===0){
                return Response.json({success:false,message:'No messages found'},{status:404})
            }
            return Response.json({success:true,message:'Messages fetched successfully',data:{messages:messages[0].messages}},{status:200})
        } catch (error) {
            return Response.json({success:false,message:'Error fetching messages'},{status:500})
        }

    } catch (error) {
        return Response.json({success:false,message:'Server error fetching messages'},{status:500})
    }
}