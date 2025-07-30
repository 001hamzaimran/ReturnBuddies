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
        if (!user) return res.status(200).json({ message: "User not found", success: false, status: 2 });

        const notifications = await NotificationModel.findOne({ userId });

        if (!notifications) return res.status(200).json({ message: "Notifications not found", success: false, status: 200 });
        const text = [
            {
                _id: "pickup_updates",
                title: "Pickup Updates",
                detail:
                    "Messages confirming your scheduled pickup, item pickup, and dropoff.",
                value: notifications.PickupUpdates,
            },
            {
                _id: "pickup_reminder",
                title: "Pickup Reminder",
                detail:
                    "A morning message letting you know a pickup is scheduled for today.",
                value: notifications.PickupReminder,
            },
            {
                _id: "label_issues",
                title: "Label Issues",
                detail:
                    "Messages if your return label is missing, inval_id, or can’t be processed.",
                value: notifications.LabelIssues,
            },
        ]
        const email = [
            {
                _id: "account_security",
                title: "Account & Security",
                detail: "Important account, support and security related messages.",
                value: notifications.AccountSecurity,
            },
            {
                _id: "draft_reminders",
                title: "Draft Reminders",
                detail: "Reminder to finish scheduling items saved in drafts.",
                value: notifications.DraftReminder,
            },
            {
                _id: "pickup_confirmations",
                title: "Pickup Confirmations",
                detail:
                    "Details of when your pickup is scheduled, upcoming, completed, or rescheduled.",
                value: notifications.PickupConfirmation,
            },
        ]
        const Notifications = { text, email }
        return res.status(200).json({ message: "Notifications found successfully", success: true, status: 200, Notifications });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", success: false, status: 500, error: error.message });
    }
}

export { addNotification, getNotification }