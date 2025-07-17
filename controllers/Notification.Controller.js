import NotificationModel from "../models/Notification.Model.js";
import UserModel from "../models/User.js";

const addNotification = async (req, res) => {
    try {
        const {
            PickupUpdates,
            PickupReminder,
            LabelIssues,
            AccountSecurity,
            DraftReminder,
            PickupConfirmation
        } = req.body

        const userId = req.headers['userid'];

        if (!userId) return res.status(200).json({ message: "User ID is required", success: false, status: 400 });

        const user = await UserModel.findOne({ _id: userId });
        if (!user) return res.status(200).json({ message: "User not found", success: false, status: 404 });

        const existingNotifications = await NotificationModel.findOne({ userId });

        if (existingNotifications) {
            existingNotifications.PickupUpdates = PickupUpdates;
            existingNotifications.PickupReminder = PickupReminder;
            existingNotifications.LabelIssues = LabelIssues;
            existingNotifications.AccountSecurity = AccountSecurity;
            existingNotifications.DraftReminder = DraftReminder;
            existingNotifications.PickupConfirmation = PickupConfirmation;
            await existingNotifications.save();
            return res.status(200).json({ message: "Notifications updated successfully", success: true, status: 200, existingNotifications });
        } else {
            const newNotification = new NotificationModel({ userId, PickupUpdates, PickupReminder, LabelIssues, AccountSecurity, DraftReminder, PickupConfirmation });
            await newNotification.save();
            return res.status(200).json({ message: "Notifications added successfully", success: true, status: 200, newNotification });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", success: false, status: 500, error: error.message });

    }
}

const getNotification = async (req, res) => {
    try {
        const userId = req.headers['userid'];

        if (!userId) return res.status(200).json({ message: "User ID is required", success: false, status: 400 });

        const user = await UserModel.findOne({ _id: userId });
        if (!user) return res.status(200).json({ message: "User not found", success: false, status: 404 });

        const notifications = await NotificationModel.findOne({ userId });

        if (!notifications) return res.status(200).json({ message: "Notifications not found", success: false, status: 404 });

        return res.status(200).json({ message: "Notifications found successfully", success: true, status: 200, notifications });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", success: false, status: 500, error: error.message });
    }
}

export { addNotification, getNotification }