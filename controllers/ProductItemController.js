import ProductItem from "../models/ProductItem.js";
import ReturnBundle from "../models/ReturnBundle.js";
import cloudinary from "../utils/cloundinary.js";
import path from "path";
import fs from 'fs';


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


// export const editLabel = async (req, res) => {
//   try {
//     const userId = req.params.userid || req.headers['userid'];
//     const { bundleId, date } = req.body;

//     if (!userId || !bundleId) {
//       return res.status(400).json({
//         status: 400,
//         message: 'Missing userId or bundleId.'
//       });
//     }

//     // Parse productIDs
//     let productIDs;
//     try {
//       productIDs = typeof req.body.productIDs === 'string'
//         ? JSON.parse(req.body.productIDs)
//         : req.body.productIDs;
//     } catch (err) {
//       return res.status(400).json({
//         status: 400,
//         message: 'Invalid format for productIDs.'
//       });
//     }

//     if (!Array.isArray(productIDs) || productIDs.length === 0) {
//       return res.status(400).json({
//         status: 400,
//         message: 'productIDs must be a non-empty array.'
//       });
//     }

//     // Check if label file is uploaded
//     const labelPath = req.files?.[0]?.path || null;

//     // Fetch current bundle and check validity
//     const currentBundle = await ReturnBundle.findById(bundleId).lean();
//     if (!currentBundle) {
//       return res.status(404).json({
//         status: 404,
//         message: 'Bundle not found.'
//       });
//     }

//     const currentProductIds = currentBundle.products.map(id => id.toString());
//     const selectedProductIds = productIDs.map(p => p.productId);

//     const updatedProducts = [];

//     for (const item of productIDs) {
//       // Build update object conditionally
//       const updateData = {
//         date: new Date(date)
//       };

//       if (labelPath) {
//         updateData.labelReceipt = labelPath;
//       }

//       const updated = await ProductItem.findOneAndUpdate(
//         { _id: item.productId, userId },
//         updateData,
//         { new: true }
//       );

//       if (updated) {
//         updatedProducts.push(updated._id.toString());
//       }
//     }

//     if (updatedProducts.length === 0) {
//       return res.status(400).json({
//         status: 400,
//         message: 'No products were updated.'
//       });
//     }

//     // Optional: Mark bundle as processed if all products are updated
//     const allSelected = currentProductIds.length === updatedProducts.length &&
//       currentProductIds.every(id => updatedProducts.includes(id));

//     if (allSelected) {
//       await ReturnBundle.findByIdAndUpdate(bundleId, { status: 'processed' });
//     }

//     const updatedBundle = await ReturnBundle.findById(bundleId).populate('products');

//     return res.status(200).json({
//       status: 200,
//       message: labelPath
//         ? 'Label(s) and date updated successfully.'
//         : 'Date updated successfully (label unchanged).',
//       data: {
//         bundle: updatedBundle,
//         updatedProducts
//       }
//     });

//   } catch (error) {
//     console.error('Error in editLabel:', error);
//     return res.status(500).json({
//       status: 500,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };


// Helper function to safely parse DD/MM/YYYY format to a Date object
function parseCustomDate(input) {
  if (!input || typeof input !== 'string') return null;

  const parts = input.split('/');
  if (parts.length !== 3) return null;

  const [month, day, year] = parts; // now interpreting first part as month
  const formatted = `${year}-${month}-${day}`; // YYYY-MM-DD for Date()
  const date = new Date(formatted);

  return isNaN(date.getTime()) ? null : date;
}

// export const uploadLabel = async (req, res) => {
//   let populatedBundle;
//   try {
//     const userId = req.params.userid || req.headers['userid'];
//     const { bundleId, date } = req.body;

//     // Validate inputs
//     if (!userId || !bundleId) {
//       return res.status(200).json({
//         status: 400,
//         message: 'Missing userId or bundleId.'
//       });
//     }

//     const parsedDate = parseCustomDate(date);
//     if (!parsedDate) {
//       return res.status(200).json({
//         status: 400,
//         message: 'Invalid date format. Please use MM/DD/YYYY.'
//       });
//     }

//     // Parse productIDs
//     let productIDs;
//     try {
//       productIDs = typeof req.body.productIDs === 'string'
//         ? JSON.parse(req.body.productIDs)
//         : req.body.productIDs;
//     } catch (err) {
//       return res.status(200).json({
//         status: 400,
//         message: 'Invalid format for productIDs.'
//       });
//     }

//     if (!Array.isArray(productIDs) || productIDs.length === 0) {
//       return res.status(200).json({
//         status: 400,
//         message: 'productIDs must be a non-empty array.'
//       });
//     }

//     // Ensure label file is provided
//     if (!req.files || req.files.length === 0) {
//       return res.status(200).json({ status: 400, message: 'Label image is required.' });
//     }

//     const labelPath = req.files?.[0]?.path;

//     // Get current bundle
//     const currentBundle = await ReturnBundle.findById(bundleId).lean();
//     if (!currentBundle) {
//       return res.status(200).json({
//         status: 404,
//         message: 'Original bundle not found.'
//       });
//     }

//     const currentProductIds = currentBundle.products.map(id => id.toString());
//     const selectedProductIds = productIDs.map(p => p.productId);

//     // Update each selected product
//     const updatedProducts = [];
//     for (const item of productIDs) {
//       console.log("Trying to update product:", item.productId);

//       const updated = await ProductItem.findOneAndUpdate(
//         { _id: item.productId, userId },
//         { labelReceipt: labelPath, date: parsedDate },
//         { new: true }
//       );

//       if (updated) {
//         console.log("✅ Updated:", updated._id);
//         updatedProducts.push(updated._id.toString());

//         await ReturnBundle.findByIdAndUpdate(
//           bundleId,
//           {
//             status: 'processed',
//             pickupTime: parsedDate
//           },
//           { new: true }
//         );
//       } else {
//         console.log("❌ No match for:", item.productId, "with user:", userId);
//       }
//     }

//     // If no product was updated, return error
//     if (updatedProducts.length === 0) {
//       return res.status(200).json({
//         status: 400,
//         message: 'No valid products provided to create a new bundle.'
//       });
//     }

//     // Check if all products in bundle were selected
//     const allSelected = currentProductIds.length === updatedProducts.length &&
//       currentProductIds.every(id => updatedProducts.includes(id));

//     if (allSelected) {
//       return res.status(200).json({
//         status: 200,
//         message: 'All products in bundle updated with label. No new bundle created.',
//         data: {
//           bundle: bundleId,
//           date: parsedDate
//         }
//       });
//     }

//     // Generate next bundle name
//     const latestBundle = await ReturnBundle.findOne().sort({ createdAt: -1 }).select('BundleName');
//     let nextNumber = 1;

//     if (latestBundle?.BundleName?.startsWith("Return #")) {
//       const match = latestBundle.BundleName.match(/Return #(\d+)/);
//       if (match) {
//         nextNumber = parseInt(match[1]) + 1;
//       }
//     }

//     const autoBundleName = `Return #${nextNumber}`;

//     // Create a new bundle with updated products
//     const newBundle = new ReturnBundle({
//       userId,
//       BundleName: autoBundleName,
//       products: updatedProducts,
//       pickupTime: parsedDate,
//       pickupAddress: null,
//       payment: null,
//       status: 'processed'
//     });

//     await newBundle.save();

//     // Remove products from old bundle
//     await ReturnBundle.findByIdAndUpdate(
//       bundleId,
//       { $pull: { products: { $in: updatedProducts } } }
//     );

//     const remainingBundle = await ReturnBundle.findById(bundleId).lean();
//     if (remainingBundle?.products?.length > 0) {
//       await ReturnBundle.findByIdAndUpdate(bundleId, { status: 'pending' });
//     }

//     populatedBundle = await ReturnBundle.findById(newBundle._id).populate('products');

//     return res.status(200).json({
//       status: 200,
//       message: 'Label uploaded and new bundle created successfully.',
//       data: {
//         bundle: populatedBundle,
//         date: parsedDate
//       }
//     });

//   } catch (error) {
//     console.error('Error in uploadLabel:', error);
//     return res.status(500).json({
//       status: 500,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };


function detectResourceType(file) {
  const mimetype = (file.mimetype || '').toLowerCase();
  const ext = path.extname(file.originalname || '').toLowerCase();

  if (mimetype.startsWith('image/')) return 'image';
  // treat common non-image as raw
  if (['.pdf', '.doc', '.docx', '.zip', '.xlsx', '.csv'].includes(ext)) return 'raw';
  if (mimetype.startsWith('application/')) return 'raw';
  // fallback
  return 'raw';
}

export const uploadLabel = async (req, res) => {
  let populatedBundle;
  try {
    const userId = req.params.userid || req.headers['userid'];
    const { bundleId, date } = req.body;

    if (!userId || !bundleId) {
      return res.status(200).json({
        status: 400,
        message: 'Missing userId or bundleId.'
      });
    }

    const parsedDate = parseCustomDate(date);
    if (!parsedDate) {
      return res.status(200).json({
        status: 400,
        message: 'Invalid date format. Please use MM/DD/YYYY.'
      });
    }

    // Parse productIDs
    let productIDs;
    try {
      productIDs = typeof req.body.productIDs === 'string'
        ? JSON.parse(req.body.productIDs)
        : req.body.productIDs;
    } catch (err) {
      return res.status(200).json({
        status: 400,
        message: 'Invalid format for productIDs.'
      });
    }

    if (!Array.isArray(productIDs) || productIDs.length === 0) {
      return res.status(200).json({
        status: 400,
        message: 'productIDs must be a non-empty array.'
      });
    }

    // Ensure label file is provided
    if (!req.files || req.files.length === 0) {
      return res.status(200).json({ status: 400, message: 'Label image is required.' });
    }
    console.log("Label file received:", req.files);
    // Detect file type (image vs pdf vs doc)
    // const fileExt = path.extname(req.files[0].originalname).toLowerCase();
    // let resourceType = "auto";
    // if ([".pdf", ".docx", ".doc", ".zip"].includes(fileExt)) {
    //   resourceType = "auto";
    // }

    // // Upload to Cloudinary
    // const uploadResult = await cloudinary.uploader.upload(req.files[0].path, {
    //   folder: 'return-bundles',
    //   use_filename: true,
    //   unique_filename: false,
    //   type: "upload",
    //   access_mode: "public",
    //   resource_type: resourceType
    // });
    // const labelUrl = uploadResult.secure_url;

    // file is req.files[0]
    // file is req.files[0]
    const file = req.files[0];
    const resourceType = detectResourceType(file);

    // Upload to Cloudinary
    let uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'return-bundles',
      use_filename: true,
      unique_filename: false,
      access_mode: 'public',
      resource_type: resourceType // raw for PDFs
    });

    // Build public URL
    let labelUrl = uploadResult.secure_url;

    // If it's raw and your account is untrusted, build signed download URL:
    if (resourceType === 'raw') {
      const publicId = uploadResult.public_id; // e.g. return-bundles/17579...
      const format = path.extname(file.originalname).replace('.', ''); // pdf/docx etc.

      // Signed URL
      labelUrl = cloudinary.utils.private_download_url(
        publicId,
        format,
        { resource_type: 'raw' }
      );
    }

    console.log("Uploaded to Cloudinary:", labelUrl);


    console.log("Uploaded to Cloudinary:", labelUrl);
    console.log("Upload result:", uploadResult);

    // Get current bundle
    const currentBundle = await ReturnBundle.findById(bundleId).lean();
    if (!currentBundle) {
      return res.status(200).json({
        status: 404,
        message: 'Original bundle not found.'
      });
    }

    const currentProductIds = currentBundle.products.map(id => id.toString());
    const updatedProducts = [];

    for (const item of productIDs) {
      const updated = await ProductItem.findOneAndUpdate(
        { _id: item.productId, userId },
        { labelReceipt: labelUrl, date: parsedDate },
        { new: true }
      );

      if (updated) {
        updatedProducts.push(updated._id.toString());

        await ReturnBundle.findByIdAndUpdate(
          bundleId,
          {
            status: 'processed',
            pickupTime: parsedDate
          },
          { new: true }
        );
      }
    }

    if (updatedProducts.length === 0) {
      return res.status(200).json({
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
          bundle: bundleId,
          date: parsedDate
        }
      });
    }

    // Generate next bundle name
    const latestBundle = await ReturnBundle.findOne().sort({ createdAt: -1 }).select('BundleName');
    let nextNumber = 1;

    if (latestBundle?.BundleName?.startsWith("Return #")) {
      const match = latestBundle.BundleName.match(/Return #(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    const autoBundleName = `Return #${nextNumber}`;

    // Create new bundle
    const newBundle = new ReturnBundle({
      userId,
      BundleName: autoBundleName,
      products: updatedProducts,
      pickupTime: parsedDate,
      pickupAddress: null,
      payment: null,
      status: 'processed'
    });

    await newBundle.save();

    // Remove products from old bundle
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
      message: 'Label uploaded to Cloudinary and new bundle created successfully.',
      data: {
        bundle: populatedBundle,
        date: parsedDate,
        labelUrl
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


export const editLabel = async (req, res) => {
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

    const file = req.files[0];
    const resourceType = detectResourceType(file);

    let uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'return-bundles',
      use_filename: true,
      unique_filename: false,
      access_mode: 'public',
      resource_type: resourceType
    });

    let labelUrl = uploadResult.secure_url;

    if (resourceType === 'raw') {
      const publicId = uploadResult.public_id;
      const format = path.extname(file.originalname).replace('.', '');
      labelUrl = cloudinary.utils.private_download_url(
        publicId,
        format,
        { resource_type: 'raw' }
      );
    }

    console.log("Uploaded to Cloudinary:", labelUrl);
    console.log("Upload result:", uploadResult);
  }

    // Fetch current bundle
    const currentBundle = await ReturnBundle.findById(bundleId).lean();
  if (!currentBundle) {
    return res.status(404).json({
      status: 404,
      message: 'Bundle not found.'
    });
  }

  const currentProductIds = currentBundle.products.map(id => id.toString());
  const updatedProducts = [];

  for (const item of productIDs) {
    const updateData = {
      date: new Date(date)
    };
    if (labelUrl) {
      updateData.labelReceipt = labelUrl;
    }

    const updated = await ProductItem.findOneAndUpdate(
      { _id: item.productId, userId },
      updateData,
      { new: true }
    );

    if (updated) {
      updatedProducts.push(updated._id.toString());
    }
  }

  if (updatedProducts.length === 0) {
    return res.status(400).json({
      status: 400,
      message: 'No products were updated.'
    });
  }

  // Mark bundle processed if all products updated
  const allSelected = currentProductIds.length === updatedProducts.length &&
    currentProductIds.every(id => updatedProducts.includes(id));

  if (allSelected) {
    await ReturnBundle.findByIdAndUpdate(bundleId, { status: 'processed' });
  }

  const updatedBundle = await ReturnBundle.findById(bundleId).populate('products');

  return res.status(200).json({
    status: 200,
    message: labelUrl
      ? 'Label uploaded to Cloudinary and updated successfully.'
      : 'Date updated successfully (label unchanged).',
    data: {
      bundle: updatedBundle,
      updatedProducts,
      labelUrl
    }
  });

} catch (error) {
  console.error('Error in editLabel:', error);
  return res.status(500).json({
    status: 500,
    message: 'Internal server error',
    error: error.message
  });
}
};
