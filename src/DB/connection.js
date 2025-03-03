import mongoose from "mongoose"

export const database_connection = async () =>{
   try{
    await mongoose.connect(process.env.DB_URI)
    console.log('Database connected sucessfully')
   }
   catch(error){
    console.log('Database connected failed',error)
   }
}