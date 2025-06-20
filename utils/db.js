import mongoose from "mongoose";


const DbCon = async () => {
    try {
        const conn = await mongoose.connect(process.env.Db_Url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 60000,
            socketTimeoutMS: 60000,
        })
        console.log(`Database connected successfully`);
    } catch (error) {
        console.log(`Error while connecting with database ${error}`);
    }
}

export default DbCon