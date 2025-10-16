import {Schema,model} from "mongoose";

const CardSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    cardHolderName: {
        type: String,
        required: true
    },
    expirationDate: {
        type: String,
        required: true
    },
    cardType: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    isDefault: {
        type: Number,
        default: 0
    }
});
export default model("Card", CardSchema);