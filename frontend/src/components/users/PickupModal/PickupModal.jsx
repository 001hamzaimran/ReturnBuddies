import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";

export default function PickupModal({ onClose,setRefresh }) {
  const [data, setData] = useState({
    Item_Details: "",
    Return_Date: "",
    item_image: null,
    return_label: null,
  });

  // For displaying chosen file names in UI
  const [itemPhotoName, setItemPhotoName] = useState("");
  const [returnLabelName, setReturnLabelName] = useState("");

  // Handlers to update data state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setData((prev) => ({ ...prev, [name]: files[0] }));

      if (name === "item_image") setItemPhotoName(files[0].name);
      else if (name === "return_label") setReturnLabelName(files[0].name);
    }
  };

  // create form data 
  const Formdata = new FormData();
  Formdata.append("Item_Details", data.Item_Details);
  Formdata.append("Return_Date", data.Return_Date);
  Formdata.append("item_image", data.item_image);
  Formdata.append("item_file", data.return_label);

  // This function would be called to send data to API, for now just closes modal
const handleSave = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/additem", Formdata);
    const itemdata = res.data;

    if (res.status === 200 && itemdata.success) {
      toast.success(itemdata.message || "Request sent successfully!");
      // You can close modal here if needed, e.g. onClose();
      setRefresh((prev) => !prev);  
      onClose()
    } else {
      // Handle unexpected success response without success flag
      toast.error("Something went wrong. Please try again.");
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Network error or server is unreachable.");
    }
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative max-h-[90vh] overflow-auto">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          <IoCloseOutline cursor={"pointer"} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">What are you returning?</h2>

        {/* Item Description Input */}
        <input
          type="text"
          name="Item_Details"
          value={data.Item_Details}
          onChange={handleInputChange}
          placeholder='Ex: "Black shirt, size small"'
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Return Date */}
        <label className="block text-sm font-medium text-purple-600 mb-1">
          Return Deadline Date<span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="Return_Date"
          value={data.Return_Date}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Upload Item Photo */}
        <label className="block text-sm font-medium text-purple-600 mb-1">
          Photo of Item<span className="text-red-500">*</span>
        </label>
        <div className="flex items-center mb-4 space-x-3">
          <input
            type="file"
            name="item_image"
            id="item_image"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
          <label
            htmlFor="item_image"
            className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition select-none"
          >
            Choose File
          </label>
          <span
            className="text-gray-600 text-sm truncate max-w-xs"
            title={itemPhotoName}
          >
            {itemPhotoName || "No file chosen"}
          </span>
        </div>

        {/* Upload Return Shipping Label */}
        <label className="block text-sm font-medium text-purple-600 mb-1">
          Upload Return Shipping Label<span className="text-red-500">*</span>
        </label>
        <div className="flex items-center mb-6 space-x-3">
          <input
            type="file"
            name="return_label"
            id="return_label"
            className="hidden"
            onChange={handleFileChange}
            accept="application/pdf,image/*"
          />
          <label
            htmlFor="return_label"
            className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition select-none"
          >
            Choose File
          </label>
          <span
            className="text-gray-600 text-sm truncate max-w-xs"
            title={returnLabelName}
          >
            {returnLabelName || "No file chosen"}
          </span>
        </div>

        {/* Note */}
        <p className="text-xs text-gray-400 mb-4 text-center">
          *Only add items that belong to this same return shipping label.
        </p>

        {/* Save Button */}
        <button
          className="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition"
          onClick={handleSave}
        >
          Save Order
        </button>
      </div>
    </div>
  );
}
