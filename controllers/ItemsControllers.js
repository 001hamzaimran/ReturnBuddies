import ItemModal from "../models/Items.js";


const AddItem = async (req, res) => {
  const { Item_Details, Return_Date } = req.body;

  console.log('Files received:', req.files);  // Debug print

  try {
if (!Item_Details || !Return_Date) {
  return res.status(400).json({
    success: false,
    status: 400,
    message: !Item_Details
      ? 'Item Details is required'
      : !Return_Date
      ? 'Return Date is required'
      : 'is required',
  });
}


    if (!req.files || !req.files['item_image'] || req.files['item_image'].length === 0) {
      return res.status(400).json({ success: false, message: 'Item photo is required' });
    }

    if (!req.files['item_file'] || req.files['item_file'].length === 0) {
      return res.status(400).json({ success: false, message: 'Return shipping label is required' });
    }

    const protocol = req.protocol;  // 'http' or 'https'
    const host = req.get('host');   // e.g., 'localhost:5000'

    // Compose full URL to access the file
    const itemPhotoFilename = req.files['item_image'][0].filename;
    const returnShippingLabelFilename = req.files['item_file'][0].filename;

    // If your files are served with '/public' prefix:
    const itemPhotoURL = `${protocol}://${host}/public/images/${itemPhotoFilename}`;
    const returnShippingLabelURL = `${protocol}://${host}/public/images/${returnShippingLabelFilename}`;

    const NewItems = new ItemModal({
      itemDetails: Item_Details,
      ReturnDate: Return_Date,
      ReturnShippingLabel: returnShippingLabelURL,
      itemPhoto: itemPhotoURL,
    });

    await NewItems.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Item Added Successfully',
      item: NewItems,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const GetItems= async (req, res) => {
  try {
    const items = await ItemModal.find();
    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Items fetched successfully',
      items: items,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export {AddItem,GetItems}