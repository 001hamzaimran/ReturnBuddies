
import CardModel from "../models/Card.Model.js";



export const addPaymentCard = async (req, res) => {
    try {
        const {
            cardNumber,
            cardHolderName,
            expirationDate,
            cvv,
            isDefault
        } = req.body;

        const userId = req.params.userid || req.headers['userid'];

        // Check for required fields
        if (!userId || !cardNumber || !cardHolderName || !expirationDate || !cvv) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
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
            isDefault: isDefault === 1 || isDefault === true ? 1 : 0
        });

        return res.status(200).json({
            success: true,
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
