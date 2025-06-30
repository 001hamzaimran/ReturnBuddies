import mongoose from "mongoose";
import ProductItem from "../models/ProductItem.js";
import ReturnBundle from "../models/ReturnBundle.js";
import { stat } from "fs";

export const createProductItemsAndReturnBundle = async (req, res) => {
    try {
        const userId = req.params.userid || req.headers['userid'];
        const rawItems = req.body.items;
        const files = req.files;

        if (!userId) {
            return res.status(200).json({ message: 'Missing userId in params or headers.', status: 400 });
        }

        if (!rawItems) {
            return res.status(200).json({ message: 'Missing items in request body.', status: 400 });
        }

        let items;
        try {
            // If rawItems is already an object, don't parse
            items = typeof rawItems === 'string' ? JSON.parse(rawItems) : rawItems;
        } catch (err) {
            return res.status(200).json({ message: 'Invalid JSON in items.', status: 400 });
        }

        if (!Array.isArray(items) || items.length !== files.length) {
            return res.status(200).json({ message: 'Mismatch between items and files.', status: 400 });
        }

        // Generate BundleName
        const latestBundle = await ReturnBundle.findOne().sort({ createdAt: -1 }).select('BundleName');
        let nextNumber = 1;

        if (latestBundle && latestBundle.BundleName?.startsWith("Return #")) {
            const match = latestBundle.BundleName.match(/Return #(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        const autoBundleName = `Return #${nextNumber}`;

        const savedItems = [];

        for (let i = 0; i < items.length; i++) {
            const { detail, oversized } = items[i];
            const file = files[i];

            const newProductItem = new ProductItem({
                userId,
                productName: detail,
                oversized: oversized || false,
                thumbnail: {
                    data: file.buffer,         // save buffer directly
                    contentType: file.mimetype // required for proper display
                },

                labelReceipt: 'pending'
            });

            const saved = await newProductItem.save();
            savedItems.push(saved);
        }

        const productIds = savedItems.map(item => item._id);

        const newReturnBundle = new ReturnBundle({
            userId,
            BundleName: autoBundleName,
            products: productIds,
            payment: null,
            pickupAddress: null,
            pickupTime: null
        });

        const savedBundle = await newReturnBundle.save();

        const populatedBundle = await ReturnBundle.findById(savedBundle._id).populate('products');

        return res.status(200).json({
            data: {
                bundle: populatedBundle,
                products: savedItems
            },
            status: 200,
            message: "Bundle created successfully",

        });

    } catch (error) {
        console.error("Error creating product items and return bundle:", error);
        res.status(500).json({ error: "Internal server error", success: false });
    }
};


export const getReturnBundle = async (req, res) => {
    try {
        const userId = req.params.userid || req.headers['userid'];


        if (!userId) {
            return res.status(200).json({ error: "User ID is required", status: 400, success: false });
        }

        // Support both single and multiple bundleId from query or params
        let bundleIds = req.params.bundleId || req.query.bundleId;

        if (!bundleIds) {
            return res.status(400).json({
                error: 'Missing bundleId parameter',
                success: false,
                status: 400
            });
        }

        // If comma-separated string, convert to array
        if (typeof bundleIds === 'string') {
            bundleIds = bundleIds.split(',').map(id => id.trim());
        }

        // Validate all IDs
        const invalidIds = bundleIds.filter(id => !mongoose.isValidObjectId(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({
                error: `Invalid bundleId(s): ${invalidIds.join(', ')}`,
                success: false,
                status: 400
            });
        }

        // Fetch all matching bundles
        const bundles = await ReturnBundle.find({ _id: { $in: bundleIds } })
            .populate('products');

        const processedBundles = bundles.map(bundle => {
            const processedProducts = bundle.products.map(product => {
                const productObj = product.toObject(); // Convert Mongoose document to plain object

                // Add image as Base64 URL if it exists
                if (product.thumbnail?.data && product.thumbnail?.contentType) {
                    const base64Image = product.thumbnail.data.toString('base64');
                    productObj.thumbnailUrl = `data:${product.thumbnail.contentType};base64,${base64Image}`;
                } else {
                    productObj.thumbnailUrl = null;
                }

                return productObj;
            });

            const bundleObj = bundle.toObject();
            bundleObj.products = processedProducts;

            return bundleObj;
        });

        return res.status(200).json({
            data: bundles,
            success: true,
            status: 200
        });

    } catch (error) {
        console.error("Error fetching return bundle(s):", error);
        return res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
};


export const getAllReturnBundles = async (req, res) => {
    try {
        const userId = req.params.userid || req.headers['userid'];

        if (!userId) {
            return res.status(200).json({ error: "User ID is required", status: 400, success: false });
        }

        const bundles = await ReturnBundle.find({ userId: userId }).populate('products');

        res.status(200).json({ data: bundles, status: 200, success: true });
    } catch (error) {
        console.error("Error fetching user return bundles:", error);
        res.status(500).json({ error: "Internal server error", success: false });
    }
};

export const DeleteBundle = async (req, res) => {
    try {
        const userId = req.params.userid || req.headers['userid'];
        const bundleId = req.query.bundleId

        if (!userId) {
            return res.status(200).json({ error: "User ID is required", status: 400, success: false });
        }

        if (!bundleId) {
            return res.status(200).json({ error: "Bundle ID is required", status: 400, success: false });
        }

        const bundle = await ReturnBundle.findByIdAndDelete(bundleId);
        if (!bundle) {
            return res.status(200).json({ error: "Bundle not found", status: 404, success: false });
        }
        return res.status(200).json({ data: bundle, status: 200, success: true });

    } catch (error) {
        console.error("Error deleting bundle:", error);
        res.status(500).json({ error: "Internal server error", success: false });

    }
}