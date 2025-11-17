import UserModel from "../models/User.js";
import NotificationModel from "../models/Notification.Model.js";

// Helper functions
const createNotificationStructure = (notificationData = null) => {
  const getValue = (field) => notificationData ? notificationData[field] || false : false;

  const text = [
    {
      _id: "PickupUpdates",
      title: "Pickup Updates",
      detail: "Messages confirming your scheduled pickup, item pickup, and dropoff.",
      value: getValue("PickupUpdates"),
    },
    {
      _id: "PickupReminder",
      title: "Pickup Reminder",
      detail: "A morning message letting you know a pickup is scheduled for today.",
      value: getValue("PickupReminder"),
    },
    {
      _id: "LabelIssues",
      title: "Label Issues",
      detail: "Messages if your return label is missing, invalid, or can't be processed.",
      value: getValue("LabelIssues"),
    },
  ];

  const email = [
    {
      _id: "AccountSecurity",
      title: "Account & Security",
      detail: "Important account, support and security related messages.",
      value: getValue("AccountSecurity"),
    },
    {
      _id: "DraftReminder",
      title: "Draft Reminders",
      detail: "Reminder to finish scheduling items saved in drafts.",
      value: getValue("DraftReminder"),
    },
    {
      _id: "PickupConfirmation",
      title: "Pickup Confirmations",
      detail: "Details of when your pickup is scheduled, upcoming, completed, or rescheduled.",
      value: getValue("PickupConfirmation"),
    },
  ];

  return { text, email };
};

const validateUser = async (userId) => {
  if (!userId) {
    return { error: "User ID is required", status: 400 };
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    return { error: "User not found", status: 404 };
  }

  return { user };
};

// Main functions
export const addNotification = async (req, res) => {
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

    // Validate user
    const validation = await validateUser(userId);
    if (validation.error) {
      return res.status(200).json({
        message: validation.error,
        success: false,
        status: validation.status,
      });
    }

    // Update or create notification
    const updateData = {
      PickupUpdates,
      PickupReminder,
      LabelIssues,
      AccountSecurity,
      DraftReminder,
      PickupConfirmation,
    };

    const notification = await NotificationModel.findOneAndUpdate(
      { userId },
      updateData,
      { upsert: true, new: true, runValidators: true }
    );

    const Notifications = createNotificationStructure(notification);

    return res.status(200).json({
      message: "Notifications updated successfully",
      success: true,
      status: 200,
      Notifications,
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

export const getNotification = async (req, res) => {
  try {
    const userId = req.headers["userid"];

    // Validate user
    const validation = await validateUser(userId);
    if (validation.error) {
      return res.status(200).json({
        message: validation.error,
        success: false,
        status: validation.status,
      });
    }

    // Get notifications
    const notifications = await NotificationModel.findOne({ userId });
    const Notifications = createNotificationStructure(notifications);

    return res.status(200).json({
      message: "Notifications fetched successfully",
      success: true,
      status: 200,
      Notifications,
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
