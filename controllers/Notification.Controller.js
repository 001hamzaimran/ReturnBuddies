import UserModel from "../models/User.js";
import NotificationModel from "../models/Notification.Model.js";

const addNotification = async (req, res) => {
  try {
    const {
      LabelIssues,
      DraftReminder,
      PickupUpdates,
      PickupReminder,
      AccountSecurity,
      PickupConfirmation,
    } = req.body;

    const userId = req.headers["userid"];

    if (!userId)
      return res
        .status(200)
        .json({ message: "User ID is required", success: false, status: 400 });

    const user = await UserModel.findOne({ _id: userId });
    if (!user)
      return res
        .status(200)
        .json({ message: "User not found", success: false, status: 404 });

    const existingNotifications = await NotificationModel.findOne({ userId });

    if (existingNotifications) {
      existingNotifications.PickupUpdates = PickupUpdates;
      existingNotifications.PickupReminder = PickupReminder;
      existingNotifications.LabelIssues = LabelIssues;
      existingNotifications.AccountSecurity = AccountSecurity;
      existingNotifications.DraftReminder = DraftReminder;
      existingNotifications.PickupConfirmation = PickupConfirmation;
      await existingNotifications.save();

      const text = [
        {
          _id: "PickupUpdates",
          title: "Pickup Updates",
          detail:
            "Messages confirming your scheduled pickup, item pickup, and dropoff.",
          value: existingNotifications.PickupUpdates,
        },
        {
          _id: "PickupReminder",
          title: "Pickup Reminder",
          detail:
            "A morning message letting you know a pickup is scheduled for today.",
          value: existingNotifications.PickupReminder,
        },
        {
          _id: "LabelIssues",
          title: "Label Issues",
          detail:
            "Messages if your return label is missing, inval_id, or can’t be processed.",
          value: existingNotifications.LabelIssues,
        },
      ];
      const email = [
        {
          _id: "AccountSecurity",
          title: "Account & Security",
          detail: "Important account, support and security related messages.",
          value: existingNotifications.AccountSecurity,
        },
        {
          _id: "DraftReminder",
          title: "Draft Reminders",
          detail: "Reminder to finish scheduling items saved in drafts.",
          value: existingNotifications.DraftReminder,
        },
        {
          _id: "PickupConfirmation",
          title: "Pickup Confirmations",
          detail:
            "Details of when your pickup is scheduled, upcoming, completed, or rescheduled.",
          value: existingNotifications.PickupConfirmation,
        },
      ];
      const Notifications = { text, email };
      return res.status(200).json({
        message: "Notifications updated successfully",
        success: true,
        status: 200,
        Notifications,
      });
    } else {
      const newNotification = new NotificationModel({
        userId,
        PickupUpdates,
        PickupReminder,
        LabelIssues,
        AccountSecurity,
        DraftReminder,
        PickupConfirmation,
      });
      await newNotification.save();

      const text = [
        {
          _id: "PickupUpdates",
          title: "Pickup Updates",
          detail:
            "Messages confirming your scheduled pickup, item pickup, and dropoff.",
          value: newNotification.PickupUpdates,
        },
        {
          _id: "PickupReminder",
          title: "Pickup Reminder",
          detail:
            "A morning message letting you know a pickup is scheduled for today.",
          value: newNotification.PickupReminder,
        },
        {
          _id: "LabelIssues",
          title: "Label Issues",
          detail:
            "Messages if your return label is missing, inval_id, or can’t be processed.",
          value: newNotification.LabelIssues,
        },
      ];
      const email = [
        {
          _id: "AccountSecurity",
          title: "Account & Security",
          detail: "Important account, support and security related messages.",
          value: newNotification.AccountSecurity,
        },
        {
          _id: "DraftReminder",
          title: "Draft Reminders",
          detail: "Reminder to finish scheduling items saved in drafts.",
          value: newNotification.DraftReminder,
        },
        {
          _id: "PickupConfirmation",
          title: "Pickup Confirmations",
          detail:
            "Details of when your pickup is scheduled, upcoming, completed, or rescheduled.",
          value: newNotification.PickupConfirmation,
        },
      ];
      const Notifications = { text, email };
      return res.status(200).json({
        message: "Notifications added successfully",
        success: true,
        status: 200,
        Notifications,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      status: 500,
      error: error.message,
    });
  }
};

const getNotification = async (req, res) => {
  try {
    const userId = req.headers["userid"];

    if (!userId) {
      return res.status(200).json({
        message: "User ID is required",
        success: false,
        status: 400,
      });
    }

    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.status(200).json({
        message: "User not found",
        success: false,
        status: 2,
      });
    }

    const notifications = await NotificationModel.findOne({ userId });

    let text, email;

    if (!notifications) {
      text = [
        {
          _id: "PickupUpdates",
          title: "Pickup Updates",
          detail:
            "Messages confirming your scheduled pickup, item pickup, and dropoff.",
          value: false,
        },
        {
          _id: "PickupReminder",
          title: "Pickup Reminder",
          detail:
            "A morning message letting you know a pickup is scheduled for today.",
          value: false,
        },
        {
          _id: "LabelIssues",
          title: "Label Issues",
          detail:
            "Messages if your return label is missing, invalid, or can’t be processed.",
          value: false,
        },
      ];

      email = [
        {
          _id: "AccountSecurity",
          title: "Account & Security",
          detail: "Important account, support and security related messages.",
          value: false,
        },
        {
          _id: "DraftReminder",
          title: "Draft Reminders",
          detail: "Reminder to finish scheduling items saved in drafts.",
          value: false,
        },
        {
          _id: "PickupConfirmation",
          title: "Pickup Confirmations",
          detail:
            "Details of when your pickup is scheduled, upcoming, completed, or rescheduled.",
          value: false,
        },
      ];
    } else {
      text = [
        {
          _id: "PickupUpdates",
          title: "Pickup Updates",
          detail:
            "Messages confirming your scheduled pickup, item pickup, and dropoff.",
          value: notifications.PickupUpdates || false,
        },
        {
          _id: "PickupReminder",
          title: "Pickup Reminder",
          detail:
            "A morning message letting you know a pickup is scheduled for today.",
          value: notifications.PickupReminder || false,
        },
        {
          _id: "LabelIssues",
          title: "Label Issues",
          detail:
            "Messages if your return label is missing, invalid, or can’t be processed.",
          value: notifications.LabelIssues || false,
        },
      ];

      email = [
        {
          _id: "AccountSecurity",
          title: "Account & Security",
          detail: "Important account, support and security related messages.",
          value: notifications.AccountSecurity || false,
        },
        {
          _id: "DraftReminder",
          title: "Draft Reminders",
          detail: "Reminder to finish scheduling items saved in drafts.",
          value: notifications.DraftReminder || false,
        },
        {
          _id: "PickupConfirmation",
          title: "Pickup Confirmations",
          detail:
            "Details of when your pickup is scheduled, upcoming, completed, or rescheduled.",
          value: notifications.PickupConfirmation || false,
        },
      ];
    }

    return res.status(200).json({
      message: "Notifications fetched successfully",
      success: true,
      status: 200,
      Notifications: { text, email },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      status: 500,
      error: error.message,
    });
  }
};

export { addNotification, getNotification };
