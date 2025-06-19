import ProductItem from "../models/ProductItem.js";
import ReturnBundle from "../models/ReturnBundle.js";

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
// items: [
//   {
//     "productId": "665f3e80c4e56a1292dff5f1",
//     "labelName": "Label 1"
//   },
//   {
//     "productId": "665f3e80c4e56a1292dff5f2",
//     "labelName": "Label 2"
//   }
// ]


// export const uploadLabel = async (req, res) => {
//     try {
//         const userId = req.params.userid || req.headers['userid'];
//         const { bundleId, date } = req.body;

//         if (!userId || !bundleId) {
//             return res.status(400).json({
//                 status: 400,
//                 message: 'Missing userId, bundleId.'
//             });
//         }

//         // Parse productIDs array
//         let productIDs;
//         try {
//             productIDs = typeof req.body.productIDs === 'string'
//                 ? JSON.parse(req.body.productIDs)
//                 : req.body.productIDs;
//         } catch (err) {
//             return res.status(200).json({
//                 status: 400,
//                 message: 'Invalid format for productIDs.'
//             });
//         }

//         if (!Array.isArray(productIDs) || productIDs.length === 0) {
//             return res.status(200).json({
//                 status: 400,
//                 message: 'productIDs must be a non-empty array.'
//             });
//         }

//         // Ensure label file is provided
//         if (!req.files || req.files.length === 0) {
//             return res.status(200).json({ status: 400, message: 'Label image is required.' });
//         }


//         const labelPath = req.files?.[0]?.path;


//         // Update each selected product with the label
//         const updatedProducts = [];
//         console.log("Received productIDs:", productIDs);
//         console.log("User ID for update:", userId);
//         console.log("Label path:", labelPath);

//         for (const item of productIDs) {
//             console.log("Trying to update product:", item.productId);

//             const updated = await ProductItem.findOneAndUpdate(
//                 { _id: item.productId, userId },
//                 { labelReceipt: labelPath },
//                 { new: true }
//             );

//             if (updated) {
//                 console.log("✅ Updated:", updated._id);
//                 updatedProducts.push(updated._id);
//             } else {
//                 console.log("❌ No match for:", item.productId, "with user:", userId);
//             }
//         }




//         // Generate next bundle name
//         const latestBundle = await ReturnBundle.findOne().sort({ createdAt: -1 }).select('BundleName');
//         let nextNumber = 1;

//         if (latestBundle && latestBundle.BundleName?.startsWith("Return #")) {
//             const match = latestBundle.BundleName.match(/Return #(\d+)/);
//             if (match) {
//                 nextNumber = parseInt(match[1]) + 1;
//             }
//         }

//         if (updatedProducts.length > 0) {
//             const autoBundleName = `Return #${nextNumber}`;

//             const newBundle = new ReturnBundle({
//                 userId,
//                 BundleName: autoBundleName,
//                 products: updatedProducts,
//                 pickupTime: new Date(date),
//                 pickupAddress: null,
//                 payment: null,
//                 status: 'processed'
//             });

//             await newBundle.save();

//             // Remove these products from old bundle
//             await ReturnBundle.findByIdAndUpdate(
//                 bundleId,
//                 { $pull: { products: { $in: updatedProducts } } }
//             );

//             const populatedBundle = await ReturnBundle.findById(newBundle._id).populate('products');

//             return res.status(200).json({
//                 status: 200,
//                 message: 'Label uploaded and new bundle created successfully.',
//                 data: {
//                     bundle: populatedBundle
//                 }
//             });
//         } else {
//             return res.status(400).json({
//                 status: 400,
//                 message: 'No valid products provided to create a new bundle.'
//             });
//         }


//     } catch (error) {
//         console.error('Error in uploadLabel:', error);
//         return res.status(500).json({
//             status: 500,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// };


export const uploadLabel = async (req, res) => {
    let populatedBundle
    try {
        const userId = req.params.userid || req.headers['userid'];
        const { bundleId, date } = req.body;

        if (!userId || !bundleId) {
            return res.status(400).json({
                status: 400,
                message: 'Missing userId or bundleId.'
            });
        }

        // Parse productIDs
        let productIDs;
        try {
            productIDs = typeof req.body.productIDs === 'string'
                ? JSON.parse(req.body.productIDs)
                : req.body.productIDs;
        } catch (err) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid format for productIDs.'
            });
        }

        if (!Array.isArray(productIDs) || productIDs.length === 0) {
            return res.status(400).json({
                status: 400,
                message: 'productIDs must be a non-empty array.'
            });
        }

        // Ensure label file is provided
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ status: 400, message: 'Label image is required.' });
        }

        const labelPath = req.files?.[0]?.path;

        // Get all product IDs in the current bundle
        const currentBundle = await ReturnBundle.findById(bundleId).lean();
        if (!currentBundle) {
            return res.status(404).json({
                status: 404,
                message: 'Original bundle not found.'
            });
        }

        const currentProductIds = currentBundle.products.map(id => id.toString());
        const selectedProductIds = productIDs.map(p => p.productId);

        // Update each selected product with the label
        const updatedProducts = [];
        for (const item of productIDs) {
            console.log("Trying to update product:", item.productId);

            const updated = await ProductItem.findOneAndUpdate(
                { _id: item.productId, userId },
                { labelReceipt: labelPath },
                { new: true }
            );



            if (updated) {
                console.log("✅ Updated:", updated._id);
                updatedProducts.push(updated._id.toString());
                const bundle = await ReturnBundle.findByIdAndUpdate(
                    bundleId,
                    { status: 'processed' },
                    { new: true }
                )
            } else {
                console.log("❌ No match for:", item.productId, "with user:", userId);
            }
        }

        // If no product was updated, stop here
        if (updatedProducts.length === 0) {
            return res.status(400).json({
                status: 400,
                message: 'No valid products provided to create a new bundle.'
            });
        }

        // Check if all products in bundle were selected
        const allSelected = currentProductIds.length === updatedProducts.length &&
            currentProductIds.every(id => updatedProducts.includes(id));

        if (allSelected) {
            return res.status(200).json({
                status: 200,
                message: 'All products in bundle updated with label. No new bundle created.',
                data: {
                    bundle: bundleId
                }
            });
        }

        // Generate next bundle name
        const latestBundle = await ReturnBundle.findOne().sort({ createdAt: -1 }).select('BundleName');
        let nextNumber = 1;

        if (latestBundle && latestBundle.BundleName?.startsWith("Return #")) {
            const match = latestBundle.BundleName.match(/Return #(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        const autoBundleName = `Return #${nextNumber}`;

        // Create a new bundle with selected products
        const newBundle = new ReturnBundle({
            userId,
            BundleName: autoBundleName,
            products: updatedProducts,
            pickupTime: new Date(date),
            pickupAddress: null,
            payment: null,
            status: 'processed'
        });

        await newBundle.save();

        // Remove selected products from the original bundle
        await ReturnBundle.findByIdAndUpdate(
            bundleId,
            { $pull: { products: { $in: updatedProducts } } }
        );

        const remainingBundle = await ReturnBundle.findById(bundleId).lean();
        if (remainingBundle?.products?.length > 0) {
            await ReturnBundle.findByIdAndUpdate(bundleId, { status: 'pending' });
        }


        populatedBundle = await ReturnBundle.findById(newBundle._id).populate('products');

        return res.status(200).json({
            status: 200,
            message: 'Label uploaded and new bundle created successfully.',
            data: {
                bundle: populatedBundle
            }
        });

    } catch (error) {
        console.error('Error in uploadLabel:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};
