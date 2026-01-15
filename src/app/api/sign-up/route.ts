import dbConnect from "@/lib/dbconnect";
import UserModel from "@/app/models/User";
import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "../../../../helpers/sendVerificationEmail";
 export async function POST(req:Request){
    await dbConnect();
    try {
       const {username,email,password}=await req.json();
       const verifyCode=Math.floor(100000 + Math.random() * 900000).toString();
       const existingUser=await UserModel.findOne({username,isVerified:true})
       if(existingUser){
        return Response.json({success:false,message:"Username already taken"}, {status: 400});
       }
       const existingEmail=await UserModel.findOne({email})
       if(existingEmail){
  if(existingEmail.isVerified){
    return Response.json({success:false,message:"Email already registered"}, {status: 400});
  }
  else{
    const hashedPassword=await bcrypt.hash(password,10);
    existingEmail.password=hashedPassword;
    
    existingEmail.verifyCode=verifyCode;
    const expiryDate=new Date()
    expiryDate.setHours(expiryDate.getHours()+1)
    existingEmail.verifyCodeExpiry=expiryDate
    existingEmail.username=username;
    await existingEmail.save();
  }
       }
       else{
       
       const hashedPassword=await bcrypt.hash(password,10);
       const expiryDate=new Date()
       expiryDate.setHours(expiryDate.getHours()+1)
       const newUser= new UserModel({
          username,
            email,
            password:hashedPassword,
            verifyCode,
            verifyCodeExpiry:expiryDate,
            isVerified:false,
            isAcceptingMessages:true,
            message:[]
       })
       await newUser.save()
    }
        const emailResponse= await sendVerificationEmail(email,username,verifyCode)
        if(!emailResponse.success){
            return Response.json({success:false,message:emailResponse.message}, {status: 500});
        }
          return Response.json({success:true,message:"User registered successfully. Verification email sent."}, {status: 201});


    } catch (error) {
        console.error('Error registering user',error)
        return Response.json({success:false,message:"Error registering user"}, {status: 500});
    }
 }