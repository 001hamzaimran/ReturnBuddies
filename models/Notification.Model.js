import { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  PickupUpdates: {
    type: Boolean,
    default: false,
  },
  PickupReminder: {
    type: Boolean,
    default: false,
  },
  LabelIssues: {
    type: Boolean,
    default: false,
  },
  AccountSecurity: {
    type: Boolean,
    default: false,
  },
  DraftReminder: {
    type: Boolean,
    default: false,
  },
  PickupConfirmation: {
    type: Boolean,
    default: false,
  },
});

const NotificationModel = model("Notification", NotificationSchema);
export default NotificationModel;
