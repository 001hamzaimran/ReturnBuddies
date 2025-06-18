import ProductItem from "../models/ProductItem.js";

export const createProductItems = async (req, res) => {
    try {
        const items = JSON.parse(req.body.items);
        const files = req.files;

        if (!Array.isArray(items) || items.length !== files.length) {
            return res.status(400).json({ error: 'Mismatch between items and images.' });
        }

        const savedItems = [];

        for (let i = 0; i < items.length; i++) {
            const { detail, oversized } = items[i];
            const file = files[i];

            const newProductItem = new ProductItem({
                productName: detail,
                oversized: oversized || false,
                thumbnail: file.path, // multer stores file path
                labelReceipt: 'pending'
            });

            const saved = await newProductItem.save();
            savedItems.push(saved);
        }

        return res.status(201).json({ data: savedItems, success: true });
    } catch (error) {
        console.error("Error creating product items:", error);
        res.status(500).json({ error: "Internal server error", success: false });
    }
};


export const getProductItems = async (req, res) => {
    try {
        const { userid } = req.params;
        const items = await ProductItem.find({ userId: userid });
        res.status(200).json({ data: items, success: true });
    } catch (error) {
        console.error("Error fetching product items:", error);
        res.status(500).json({ error: "Internal server error", success: false });
    }
};


export const updateLabel = async (req, res) => {
    try {
        const { productItemId, filesData } = req.body;

        if (!productItemId || !filesData) {
            return res.status(400).json({ error: "productItemId and filesData are required." });
        }

        const parsedFiles = JSON.parse(filesData);
        const uploadedFiles = req.files;

        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ error: "No files uploaded." });
        }

        const updateFields = {};

        for (const file of uploadedFiles) {
            // Match uploaded file with metadata using original filename
            const matchedMeta = Object.values(parsedFiles).find(meta => meta.name === file.originalname);

            if (!matchedMeta || matchedMeta.error !== null) continue;

            if (matchedMeta.type.startsWith("image/")) {
                updateFields.thumbnail = file.path;
            } else if (matchedMeta.type === "application/pdf") {
                updateFields.labelReceipt = file.path;
            }
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "No valid file types to update." });
        }

        const updatedProductItem = await ProductItem.findByIdAndUpdate(
            productItemId,
            updateFields,
            { new: true }
        );

        if (!updatedProductItem) {
            return res.status(404).json({ error: "ProductItem not found." });
        }

        return res.status(200).json({ success: true, data: updatedProductItem });
    } catch (error) {
        console.error("updateLabel error:", error);
        res.status(500).json({ error: "Internal server error", success: false });
    }
};
