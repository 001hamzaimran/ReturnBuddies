import mongoose from "mongoose";

const ItemsSchema=new mongoose.Schema({
    itemDetails:{
        type:String,
    },
    itemPhoto:{
        type:String
    },
   
    ReturnDate:{
        type:String

    },
     ReturnShippingLabel:{
        type:String

    },

},
{timestamps:true})

const ItemModal= mongoose.model("Items",ItemsSchema)

export default ItemModal