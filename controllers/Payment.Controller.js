
import CardModel from "../models/Card.Model.js";
import UserModel from "../models/User.js";

export const addPaymentCard = async (req, res) => {
    try {
        const {
            cardNumber,
            cardHolderName,
            expirationDate,
            cvv,
            isDefault,
            cardType
        } = req.body;

        const userId = req.params.userid || req.headers['userid'];

        // Check for required fields
        if (!userId || !cardNumber || !cardHolderName || !expirationDate || !cvv) {
            return res.status(200).json({
                status: 400,
                success: false,
                message: "All fields are required"
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(200).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        }

        // If isDefault is true, unset other default cards for the user
        if (isDefault === 1 || isDefault === true) {
            await CardModel.updateMany(
                { userId },
                { $set: { isDefault: 0 } }
            );
        }

        // Create and save the card
        const newCard = await CardModel.create({
            userId,
            cardNumber,
            cardHolderName,
            expirationDate,
            cvv,
            cardType,
            isDefault: isDefault === 1 || isDefault === true ? 1 : 0
        });

        if (isDefault === 1) {
            user.payment = newCard._id;
            await user.save();
            return res.status(200).json({
                success: true,
                status: 200,
                message: "Card added successfully",
                card: newCard
            })
        }

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Card added successfully",
            card: newCard
        });

    } catch (error) {
        console.error("Error adding card:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserCards = async (req, res) => {
    try {
        const userId = req.params.userid || req.headers['userid'];

        const cards = await CardModel.find({ userId });

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Cards retrieved successfully",
            cards
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};

export const editCard = async (req, res) => {
    try {
        const cardId = req.params.cardId;
        const {
            cardNumber,
            cardHolderName,
            expirationDate,
            cvv,
            isDefault,
            cardType
        } = req.body;

        const card = await CardModel.findById(cardId);
        if (!card) {
            return res.status(200).json({ status: 404, success: false, message: "Card not found" });
        }

        // Update fields
        card.cardNumber = cardNumber || card.cardNumber;
        card.cardHolderName = cardHolderName || card.cardHolderName;
        card.expirationDate = expirationDate || card.expirationDate;
        card.cardType = cardType || card.cardType;
        card.cvv = cvv || card.cvv;

        // If setting this card as default, unset others
        if (isDefault === 1 || isDefault === true) {
            await CardModel.updateMany({ userId: card.userId, _id: { $ne: cardId } }, { isDefault: 0 });
            card.isDefault = 1;
            const user = await UserModel.findById(card.userId);
            if (user) {
                user.payment = card._id; // change to your field name
                await user.save();
            }

        }

        await card.save();
        return res.status(200).json({ status: 200, success: true, message: "Card updated successfully", card });

    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: error.message });
    }
};


export const deleteCard = async (req, res) => {
    try {
        const { Id } = req.params

        if (!Id) {
            return res.status(200).json({ status: 400, message: "Card Id is required" });
        }

        const deleteCard = await CardModel.findByIdAndDelete(Id);
        if (!deleteCard) {
            return res.status(200).json({ status: 404, message: "Card not found" });
        }

        const user = await UserModel.findById(deleteCard.userId);

        if (user && user.payment?.toString() === Id) {
            user.payment = null;
            await user.save();
        }

        return res.status(200).json({
            status: 200,
            message: "Card deleted successfully",
            deleteCard
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}