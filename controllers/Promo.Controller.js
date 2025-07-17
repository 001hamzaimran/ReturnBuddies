import PromoCodeModal from "../models/promoCode.Model.js";
import UserModel from "../models/User.js";


const addPromo = async (req, res) => {
    try {
        const userid = req.headers['userid'];

        if (!userid) return res.status(200).json({ message: "User ID is required in headers", success: false, status: 400 });

        const user = await UserModel.findOne({ _id: userid });
        if (!user) return res.status(200).json({ message: "User not found", success: false, status: 404 });

        const { userId, Name, PromoCode, Discount, status } = req.body
        if (!Name || !PromoCode || !Discount || !status) return res.status(200).json({ message: "All fields are required", success: false, status: 400 });

        const newPromo = await PromoCodeModal.create({ userId, Name, PromoCode, Discount, status });
        return res.status(200).json({ message: "Promo Code Added Successfully", success: true, status: 200, newPromo });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", success: false, status: 500, error: error.message });
    }
}

const getPromo = async (req, res) => {
    try {
        const userid = req.headers['userid'];
        const discountCode = req.query.code || req.params.code;

        if (!userid) {
            return res.status(200).json({ message: "User ID is required in headers", success: false,status: 400 });
        }

        if (!discountCode) {
            return res.status(200).json({ message: "Promo code is required in query or param", success: false ,status: 400 });
        }

        const user = await UserModel.findById(userid);
        if (!user) {
            return res.status(200).json({status: 404, message: "User not found", success: false });
        }

        const promo = await PromoCodeModal.findOne({
            PromoCode: discountCode,
            $or: [
                { userId: userid },
                { userId: 'All' }
            ],
            status: true
        });

        if (!promo) {
            return res.status(200).json({status: 404, message: "Promo code not found or not available for this user", success: false });
        }

        return res.status(200).json({status: 200, message: "Promo code found", success: true, promo });
    } catch (error) {
        console.error('getPromo error:', error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export { addPromo, getPromo }