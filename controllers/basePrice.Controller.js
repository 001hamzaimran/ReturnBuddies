export const getBasePrice = async (req, res) => {
    try {
        const basePrice = {
            BASE_PRICE: 10,
            FREE_ITEMS_THRESHOLD: 10,
            ADDITIONAL_ITEM_PRICE: 1,
        }
        return res.status(200).json({ status: 200, data: basePrice, success: true });
    } catch (error) {
        console.error("Error fetching base price:", error);
        res.status(500).json({ error: "Internal server error", success: false });
    }
};