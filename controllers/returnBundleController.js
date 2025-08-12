import mongoose from "mongoose";
import ProductItem from "../models/ProductItem.js";
import ReturnBundle from "../models/ReturnBundle.js";
import pickupModel from "../models/pickup.model.js";
import cloudinary from "../utils/cloundinary.js";

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
            items = typeof rawItems === 'string' ? JSON.parse(rawItems) : rawItems;
        } catch (err) {
            return res.status(200).json({ message: 'Invalid JSON in items.', status: 400 });
        }

        if (!Array.isArray(items) || items.length !== files.length) {
            return res.status(200).json({ message: 'Mismatch between items and files.', status: 400 });
        }

        const latestBundle = await ReturnBundle.findOne().sort({ createdAt: -1 }).select('BundleName');
        let nextNumber = 1;
        if (latestBundle?.BundleName?.startsWith("Return #")) {
            const match = latestBundle.BundleName.match(/Return #(\d+)/);
            if (match) nextNumber = parseInt(match[1]) + 1;
        }

        const autoBundleName = `Return #${nextNumber}`;
        const savedItems = [];

        for (let i = 0; i < items.length; i++) {
            const { detail, oversized } = items[i];
            const file = files[i];

            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: 'return-bundles',
                use_filename: true,
                unique_filename: false
            });

            const newProductItem = new ProductItem({
                userId,
                productName: detail,
                oversized: oversized || false,
                thumbnail: uploadResult.secure_url,
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
            message: "Bundle created successfully"
        });

    } catch (error) {
        console.error("Error creating product items and return bundle:", error);
        res.status(500).json({ error: "Internal server error", success: false });
    }
};

// export const getReturnBundle = async (req, res) => {
//     try {
//         const userId = req.params.userid || req.headers['userid'];

//         if (!userId) {
//             return res.status(200).json({ error: "User ID is required", status: 400, success: false });
//         }

//         let bundleIds = req.params.bundleId || req.query.bundleId;
//         if (!bundleIds) {
//             return res.status(400).json({
//                 error: 'Missing bundleId parameter',
//                 success: false,
//                 status: 400
//             });
//         }

//         if (typeof bundleIds === 'string') {
//             bundleIds = bundleIds.split(',').map(id => id.trim());
//         }

//         const invalidIds = bundleIds.filter(id => !mongoose.isValidObjectId(id));
//         if (invalidIds.length > 0) {
//             return res.status(400).json({
//                 error: `Invalid bundleId(s): ${invalidIds.join(', ')}`,
//                 success: false,
//                 status: 400
//             });
//         }

//         const bundles = await ReturnBundle.find({ _id: { $in: bundleIds } }).populate('products');

//         if (!bundles || bundles.length === 0) {
//             return res.status(404).json({
//                 error: 'No return bundles found',
//                 success: false,
//                 status: 404
//             });
//         }

//         const enrichedBundles = [];

//         for (const bundle of bundles) {
//             const products = await ProductItem.find({ _id: { $in: bundle.products } }).populate('userId');

//             const labelReceipt = products[0]?.labelReceipt || null;
//             const date = products[0]?.date;

//             enrichedBundles.push({
//                 _id: bundle._id,
//                 userId: bundle.userId,
//                 BundleName: bundle.BundleName,
//                 labelReceipt,
//                 date,
//                 products,
//                 history: bundle.history,
//                 pickupAddress: bundle.pickupAddress,
//                 payment: bundle.payment,
//                 pickupTime: bundle.pickupTime,
//                 status: bundle.status,
//                 createdAt: bundle.createdAt,
//                 __v: bundle.__v
//             });
//         }

//         return res.status(200).json({
//             data: enrichedBundles,
//             success: true,
//             status: 200
//         });

//     } catch (error) {
//         console.error("Error fetching return bundle(s):", error);
//         return res.status(500).json({
//             error: "Internal server error",
//             success: false
//         });
//     }
// };

export const getReturnBundle = async (req, res) => {
    try {
        const userId = req.params.userid || req.headers['userid'];

        if (!userId) {
            return res.status(200).json({ error: "User ID is required", status: 400, success: false });
        }

        let bundleIds = req.params.bundleId || req.query.bundleId;
        if (!bundleIds) {
            return res.status(400).json({
                error: 'Missing bundleId parameter',
                success: false,
                status: 400
            });
        }

        if (typeof bundleIds === 'string') {
            bundleIds = bundleIds.split(',').map(id => id.trim());
        }

        const invalidIds = bundleIds.filter(id => !mongoose.isValidObjectId(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({
                error: `Invalid bundleId(s): ${invalidIds.join(', ')}`,
                success: false,
                status: 400
            });
        }

        const bundles = await ReturnBundle.find({ _id: { $in: bundleIds } }).populate('products');

        if (!bundles || bundles.length === 0) {
            return res.status(404).json({
                error: 'No return bundles found',
                success: false,
                status: 404
            });
        }

        const enrichedBundles = [];

        for (const bundle of bundles) {
            const products = await ProductItem.find({ _id: { $in: bundle.products } }).populate('userId');

            const labelReceipt = products[0]?.labelReceipt || null;
            const date = products[0]?.date;

            // Format pickupTime to MM/DD/YYYY
            let formattedDate = null;
            if (bundle.pickupTime instanceof Date && !isNaN(bundle.pickupTime)) {
                const month = String(bundle.pickupTime.getMonth() + 1).padStart(2, '0');
                const day = String(bundle.pickupTime.getDate()).padStart(2, '0');
                const year = bundle.pickupTime.getFullYear();
                formattedDate = `${month}/${day}/${year}`;
            }

            enrichedBundles.push({
                _id: bundle._id,
                userId: bundle.userId,
                BundleName: bundle.BundleName,
                labelReceipt,
                date,
                products,
                history: bundle.history,
                pickupAddress: bundle.pickupAddress,
                payment: bundle.payment,
                pickupTime: bundle.pickupTime, // original Date
                formattedDate,                 // new field in MM/DD/YYYY format
                status: bundle.status,
                createdAt: bundle.createdAt,
                __v: bundle.__v
            });
        }

        return res.status(200).json({
            data: enrichedBundles,
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
            return res.status(400).json({ error: "User ID is required", status: 400, success: false });
        }

        // Step 1: Fetch all pickups by this user
        const pickups = await pickupModel.find({ userId }).select("bundleId");

        // Step 2: Flatten all bundleIds into a single array
        const excludedBundleIds = pickups.flatMap(pickup =>
            pickup.bundleId.map(bundle => bundle.toString())
        );

        // Step 3: Find all return bundles NOT in excluded list
        const bundles = await ReturnBundle.find({
            userId,
            _id: { $nin: excludedBundleIds.map(id => new mongoose.Types.ObjectId(id)) }
        }).populate("products");

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