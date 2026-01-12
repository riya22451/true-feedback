import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt:Date;
}
const MessageSchema:Schema<Message>=new Schema({
    content:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessages:boolean;
    message:Message[]
}
const UserSchema:Schema<User>=new Schema({
    username:{type:String,required:[true,"username is required"],unique:true,trim:true},
    email:{type:String,required:[true,"email is required"],unique:true,match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"please fill a valid email address"],trim:true},
    password:{type:String,required:[true,"password is required"]},
    verifyCode:{type:String,required:[true,"verifyCode is required"]},
    verifyCodeExpiry:{type:Date,required:[true,"verifyCodeExpiry is required"]},
    isVerified:{type:Boolean,default:false},
    isAcceptingMessages:{type:Boolean,default:true},
    message:{type:[MessageSchema],default:[]}
})

const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)
export default UserModel