import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    PickupUpdates: {
        type: Boolean,
        default: false,
    },
    PickupReminder: {
        type: Boolean,
        default: false
    },
    LabelIssues: {
        type: Boolean,
        default: false
    },
    AccountSecurity: {
        type: Boolean,
        default: false
    },
    DraftReminder: {
        type: Boolean,
        default: false
    },
    PickupConfirmation: {
        type: Boolean,
        default: false
    }

})

const NotificationModel = mongoose.model("Notification", NotificationSchema);
export default NotificationModel