import {Schema} from "mongoose";

const cancelreturnSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bundleId: {
        type: Schema.Types.ObjectId,
        ref: 'ReturnBundle',
        required: true
    },
    Note:{
        type: String,
        required: true,
        trim: true
    },
},{
    timestamps: true
})