import mongoose from "mongoose";
import { de } from "zod/locales";
type ConnectionObject={
    isConnected?:number
}
const connection:ConnectionObject={}

async function dbConnect():Promise<void>{
      console.log("POST /api/... hit");
    if(connection.isConnected){
        console.log('Already connected to database')
        return
    }
    try {
        const db=await mongoose.connect(process.env.MONGO_URI || '');
       connection.isConnected= db.connections[0].readyState
       console.log("DB NAME:", mongoose.connection.name);

         console.log('Connected to database')
    } catch (error) {
        console.log('database connection failed',error)
        process.exit(1)
    }
}
export default dbConnect;