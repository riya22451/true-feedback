import UserModel from "@/app/models/User";
import dbConnect from "@/lib/dbconnect";
import { Message } from "@/app/models/User";
import { z } from "zod";

export async function POST(req:Request){
    try {
        await dbConnect();
        const {username,content}=await req.json();
        try {
            const user=await UserModel.findOne({username,isVerified:true});
            if(!user){
                return Response.json({success:false,message:'User not found'},{status:404})
            }
            if(!user.isAcceptingMessages){
                return Response.json({success:false,message:'User is not accepting messages'},{status:403})
            }
            const newMessage={
                content:content,
                createdAt:new Date()
            }
            user.message.push(newMessage as Message)
            await user.save()
            return Response.json({success:true,message:'Message sent successfully'},{status:200})
        } catch (error) {
            return Response.json({success:false,message:'Error sending message'},{status:500})
        }
    } catch (error) {
        return Response.json({success:false,message:'Server error sending message'},{status:500})
    }
}