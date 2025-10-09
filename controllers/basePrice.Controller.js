import BasePrice from "../models/basePrice.model.js";

// Get BasePrice
export const getBasePrice = async (req, res) => {
  try {
    let basePrice = await BasePrice.findOne();

    if (!basePrice) {
      basePrice = await BasePrice.create({});
    }

    return res.status(200).json({ status: 200, data: basePrice, success: true });
  } catch (error) {
    console.error("Error fetching base price:", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
};

// Update BasePrice
export const updateBasePrice = async (req, res) => {
  try {
    const { BASE_PRICE, FREE_ITEMS_THRESHOLD, ADDITIONAL_ITEM_PRICE } = req.body;

    const basePrice = await BasePrice.findOneAndUpdate(
      {},
      { BASE_PRICE, FREE_ITEMS_THRESHOLD, ADDITIONAL_ITEM_PRICE },
      { new: true, upsert: true } // create if not exists
    );

    return res.status(200).json({ status: 200, data: basePrice, success: true });
  } catch (error) {
    console.error("Error updating base price:", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
};
