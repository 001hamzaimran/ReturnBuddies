import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    profile:{
        type:String,
        default:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.756143352.1747218968&semt=ais_hybrid&w=740"
    },
    
 password: {
  type: String,
  required: function () {
    return !this.googleId; // Password is required only if not using Google login
  },
},

    verified:{
        type:Boolean,
        default:false
    },
    googleId:{
        type:String,
        default:null
    },
    otp:{
        type:String,
        default:null
    },
    phone:{
        type:String,
        default:null

    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    }
},{timestamps:true})


const UserModel=mongoose.model("User",UserSchema)
export default UserModel