import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import MainImage from '../../assets/Images/HomeFrame.png'
import { FiTrash2, FiMoreVertical } from "react-icons/fi";
import { BsPlus } from "react-icons/bs";
import PickupModal from '../../components/users/PickupModal/PickupModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [refresh, setRefresh] = useState(false)
  const [items, setItems] = useState()


  useEffect(() => {
    GetItems()
  }, [refresh])

  const GetItems = async () => {
    const res = await axios.get("https://returnbuddies-production.up.railway.app/api/getitems")
    const data = res.data
    setItems(data.items)
    console.log('data', data)
  }
F
  const Image = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  const items2 = [
    {
      id: 1,
      title: "red nike sneaker",
      status: "Label Received",
      image: Image,
      checked: true,
    },
    {
      id: 2,
      title: "red nike sneaker",
      status: "Label Received",
      image: Image,
      checked: true,
    },

  ];
  const handleNavigate = () => {
    // navigate("/Additem")
    setIsModalOpen(true)
  }
  return (
    <>
      {isModalOpen && <PickupModal onClose={() => setIsModalOpen(false)} setRefresh={setRefresh} />}

      {items && items.length > 0 ? (
        <>
          <div className="min-h-screen bg-white p-4 ">
            <h1 className="text-xl font-semibold mb-4">Select order(s) to return</h1>

            <div className="bg-white shadow-lg rounded-3xl p-10">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked className="accent-purple-600" />
                  <span className="font-medium">Deselect All</span>
                </label>
                <FiTrash2 cursor={'pointer'} className="text-x cursor-pointer" color="#ff1111" />
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-7 border-t first:border-t-0 border-gray-300 "
                >
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" checked className="accent-purple-600" />
                    <img
                      src={item.itemPhoto}
                      width={80}
                      height={80}
                      alt={item.itemDetails}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm capitalize">
                        {item.itemDetails}
                      </p>
                      <p className="text-xs text-gray-500">{item.itemDetails}</p>
                    </div>
                  </div>
                  <FiMoreVertical className="text-xl text-gray-500 cursor-pointer" />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg">
                <BsPlus className="text-3xl" onClick={handleNavigate} cursor={'pointer'} />
              </button>
            </div>

            <div className="mt-6">
              <button className="w-full bg-purple-600 text-white py-3 rounded-full font-medium">
                Schedule Pickup for 3 Items
              </button>
            </div>
          </div></>
      ) : (
        <div className=" flex flex-col items-center justify-center bg-white text-center px-4">

          {/* Illustration */}
          <img
            src={MainImage}
            alt="No Items"
            className="w-64 h-64 object-contain"
          />

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-800 mt-6">
            No Items to Return
          </h1>

          {/* Description */}
          <p className="text-gray-500 max-w-md mt-2">
            Add orders manually or scan tracking numbers or QR Codes to schedule a pickup. Packaging is optional.
          </p>

          {/* Floating Plus Button */}
          <div className="fixed bottom-6 w-full flex justify-center">
            <button className="bg-[#d491ff] text-white p-4 rounded-full text-2xl shadow-lg cursor-pointer hover:bg-[#c07dfd]" onClick={handleNavigate}>
              <FiPlus cursor={'pointer'} />
            </button>
          </div>
        </div>
      )}

    </>

  );
}




