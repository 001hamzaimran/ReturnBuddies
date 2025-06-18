import mongoose from "mongoose";


const DbCon=async()=>{
    try {
        const conn=await mongoose.connect(process.env.Db_Url)
        console.log(`Database connected successfully`);
    } catch (error) {
        console.log(`Error while connecting with database ${error}`);
    }
}

export default DbCon