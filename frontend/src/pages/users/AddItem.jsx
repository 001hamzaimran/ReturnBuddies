import React, { useState } from 'react';
import { IoCameraOutline, IoCloseOutline } from 'react-icons/io5';
import PickupLogo from '../../assets/Images/pickuplogo.png'
export default function AddItem() {
  const [tab, setTab] = useState(0);

  const next = () => setTab((prev) => prev + 1);
  const prev = () => setTab((prev) => prev - 1);

  return (
  <>
  
    <div className=" p-10">
      <div className="flex space-x-5 mb-5">
        {["Order Details", "Pickup Time", "Pickup Method", "Payment", "Card Details", "Summary", "Confirmation"].map((label, index) => (
          <button
            key={index}
            onClick={() => setTab(index)}
            className={`px-2 py-1 text-sm rounded ${tab === index ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 0 && (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
      {/* Tab 0: Order Details */}
      {tab === 0 && (
        <div className="w-full max-w-md bg-white shadow-md rounded-2xl px-6 py-8">
          {/* Title */}
          <h1 className="text-xl font-bold mb-4 text-gray-800">Order Details</h1>

          {/* Subtitle */}
          <label className="block text-base font-semibold text-gray-800 mb-2">
            What are you returning?
          </label>
          <input
            type="text"
            placeholder='Ex: "Black shirt, size small"'
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none mb-6"
          />

          {/* Upload Section */}
          <label className="block text-sm font-medium text-gray-700">
            Photo of Item <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Helps us identify your return quickly, and avoid any delays!
          </p>

          <div className="w-full border-2 border-dashed border-purple-400 rounded-xl flex flex-col items-center justify-center py-10 text-purple-600 cursor-pointer mb-6 hover:bg-purple-50 transition">
            <IoCameraOutline className="text-3xl mb-2" />
            <span className="font-medium text-sm">Upload Item Photo</span>
          </div>

          {/* Footnote */}
          <p className="text-xs text-gray-400 text-center mb-6">
            *Only add items that belong to this same return shipping label.
          </p>

          {/* Button */}
          <button
            onClick={next}
            className="w-full bg-purple-600 text-white font-medium py-3 rounded-full text-sm hover:bg-purple-700 transition"
          >
            Save Order
          </button>
        </div>
      )}
    </div>
      )}

{tab === 1 && (
  <div className="bg-white w-full max-w-md mx-auto p-10 rounded-2xl shadow-md">
    {/* Title */}
    <h2 className="text-lg font-semibold mb-6 text-center">
      Choose a day and time for pickup
    </h2>

    {/* Date Selection */}
    <div className="flex justify-between mb-6">
      {[7, 8, 9, 10, 11].map((day, idx) => (
        <div
          key={day}
          className={`flex flex-col items-center justify-center w-12 h-16 rounded-full cursor-pointer transition ${
            idx === 0
              ? 'bg-purple-600 text-white'
              : 'text-gray-700 bg-gray-100'
          }`}
        >
          <span className="text-xs font-medium">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][idx]}
          </span>
          <span className="text-lg font-bold">{day}</span>
        </div>
      ))}
    </div>

    {/* Time Slots */}
    <div className="space-y-4 mb-6">
      {["9AM - 6PM", "9AM - 1PM", "11AM - 3PM", "2PM - 6PM"].map((time, idx) => (
        <label
          key={idx}
          className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-purple-500 transition"
        >
          <span className="text-sm text-gray-900 font-medium">{time}</span>
          <input
            type="radio"
            name="pickupTime"
            className="form-radio text-purple-600 focus:ring-purple-500"
            defaultChecked={idx === 0}
          />
        </label>
      ))}
    </div>

    {/* Notice */}
    <p className="text-xs text-gray-400 text-center mb-4">
      *We require at least 2 business days’ notice to process your return.
    </p>

    {/* Continue Button */}
    <button
      onClick={next}
      className="w-full bg-purple-600 text-white py-3 rounded-full text-sm font-semibold hover:bg-purple-700 transition"
    >
      Continue
    </button>
  </div>
)}



     {tab === 2 && (
  <div className="bg-white w-full max-w-md mx-auto p-10 rounded-2xl shadow-md">
    {/* Title */}
    <h2 className="text-lg font-semibold text-center mb-2">Pickup Details</h2>
    <p className="text-sm text-center text-gray-600 mb-6">
      How would you like us to pick up your items?
    </p>

    {/* Pickup Method Options */}
    <div className="space-y-4 mb-6">
      <label
        className="block border-2 border-purple-500 text-purple-600 rounded-xl p-4 cursor-pointer hover:bg-purple-50 transition"
      >
        <strong className="block text-center text-lg mb-1">Doorstep</strong>
        <p className="text-sm text-center text-gray-600">
          Place your items outside your door before your scheduled pickup time
        </p>
        <input type="radio" name="pickupMethod" className="hidden" defaultChecked />
      </label>

      <label
        className="block border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-500 transition"
      >
        <strong className="block text-center text-lg mb-1">Direct Handoff</strong>
        <p className="text-sm text-center text-gray-600">
          Hand your items directly to our driver at your scheduled pickup time.
        </p>
        <input type="radio" name="pickupMethod" className="hidden" />
      </label>
    </div>

    {/* Notes Input */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Additional Notes
      </label>
      <textarea
        placeholder="Add any special instructions..."
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        rows={3}
      />
    </div>

    {/* Continue Button */}
    <button
      onClick={next}
      className="w-full bg-purple-600 text-white py-3 rounded-full text-sm font-semibold hover:bg-purple-700 transition"
    >
      Continue
    </button>
  </div>
)}


{tab === 3 && (
  <div className="bg-white w-full max-w-md mx-auto p-10 rounded-2xl shadow-md">
    {/* Title */}
    <h2 className="text-lg font-semibold text-center mb-6">Select Payment Method</h2>

    {/* Payment Options */}
    <div className="space-y-4 mb-8">
      {/* Credit Card */}
      <label className="flex items-center justify-between border-2 border-purple-500 rounded-xl px-4 py-3 cursor-pointer hover:bg-purple-50 transition">
        <div className="flex items-center space-x-3">
          <img src="https://img.icons8.com/ios-filled/50/000000/bank-card-front-side.png" alt="Card" className="w-6 h-6" />
          <span className="text-sm font-medium">Credit Card / Debit Card</span>
        </div>
        <input type="radio" name="payment" className="accent-purple-600" defaultChecked />
      </label>

      {/* Google Pay */}
      <label className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:border-purple-400 transition">
        <div className="flex items-center space-x-3">
          <img src="https://img.icons8.com/color/48/000000/google-pay-india.png" alt="Google Pay" className="w-6 h-6" />
          <span className="text-sm font-medium">Google Pay</span>
        </div>
        <input type="radio" name="payment" className="accent-purple-600" />
      </label>

      {/* Apple Pay */}
      <label className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:border-purple-400 transition">
        <div className="flex items-center space-x-3">
          <img src="https://img.icons8.com/ios-filled/50/000000/mac-os.png" alt="Apple Pay" className="w-6 h-6" />
          <span className="text-sm font-medium">Apple Pay</span>
        </div>
        <input type="radio" name="payment" className="accent-purple-600" />
      </label>
    </div>

    {/* Continue Button */}
    <button
      onClick={next}
      className="w-full bg-purple-600 text-white py-3 rounded-full text-sm font-semibold hover:bg-purple-700 transition"
    >
      Continue
    </button>
  </div>
)}


     {tab === 4 && (
  <div className="bg-white w-full max-w-md mx-auto p-10 rounded-2xl shadow-md">
    {/* Title */}
    <h2 className="text-lg font-semibold text-center mb-6">Card Details</h2>

    {/* Name */}
    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
    <input
      type="text"
      placeholder="Andrew Ainsley"
      className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-100 text-sm font-medium text-black"
    />

    {/* Card Number */}
    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
    <input
      type="text"
      placeholder="2672 4738 7837 7285"
      className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-100 text-sm font-medium text-black"
    />

    {/* Expiry + CVV */}
    <div className="flex space-x-4 mb-8">
      <div className="w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
        <input
          type="text"
          placeholder="09/07/26"
          className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm font-medium text-black"
        />
      </div>
      <div className="w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
        <input
          type="text"
          placeholder="699"
          className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm font-medium text-black"
        />
      </div>
    </div>

    {/* Continue Button */}
    <button
      onClick={next}
      className="w-full bg-purple-600 text-white py-3 rounded-full text-sm font-semibold hover:bg-purple-700 transition"
    >
      Continue
    </button>
  </div>
)}


{tab === 5 && (
  <div className="bg-white w-full max-w-md mx-auto p-6 rounded-2xl shadow-md">
    {/* Title */}
    <h2 className="text-lg font-semibold text-center mb-6">Confirm Pickup</h2>

    {/* Pickup Details Section */}
    <div className="bg-gray-50 rounded-2xl p-4 mb-6 shadow-sm">
      <p className="text-sm font-semibold mb-3">Pickup Details</p>

      {/* Doorstep */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-2">
          <span className="text-purple-600"><i className="fas fa-door-open"></i></span>
          <div>
            <p className="text-sm font-medium text-black">Doorstep</p>
            <p className="text-xs text-purple-600">Notes</p>
            <p className="text-xs text-gray-600">I placed the items on the front porch</p>
          </div>
        </div>
        <button className="text-sm text-purple-600 font-medium">Edit</button>
      </div>

      {/* Date & Time */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-2">
          <span className="text-purple-600"><i className="fas fa-calendar-day"></i></span>
          <div>
            <p className="text-sm font-medium text-black">Mon, Jun 8th</p>
            <p className="text-xs text-gray-600">2pm - 6pm</p>
          </div>
        </div>
        <button className="text-sm text-purple-600 font-medium">Edit</button>
      </div>

      {/* Address */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-2">
          <span className="text-purple-600"><i className="fas fa-map-marker-alt"></i></span>
          <div>
            <p className="text-sm font-medium text-black">Marc Fisher</p>
            <p className="text-xs text-gray-600">118 Malba Dr, Malba, NY 11357</p>
          </div>
        </div>
        <button className="text-sm text-purple-600 font-medium">Edit</button>
      </div>

      {/* Total Cost */}
      <div className="flex justify-between items-center pt-2 border-t">
        <p className="text-sm font-medium">Total Cost</p>
        <p className="text-sm font-medium text-purple-600">$20.00</p>
      </div>
    </div>

    {/* Payment Info */}
    <div className="bg-gray-50 rounded-2xl p-4 shadow-sm mb-8">
      <p className="text-sm font-semibold mb-2">Payment</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-purple-600"><i className="fas fa-credit-card"></i></span>
          <p className="text-sm text-black">Visa Ending with 3809</p>
        </div>
        <button className="text-sm text-purple-600 font-medium">Edit</button>
      </div>
    </div>

    {/* Schedule Pickup Button */}
    <button
      onClick={next}
      className="w-full bg-purple-600 text-white py-3 rounded-full text-sm font-semibold hover:bg-purple-700 transition"
    >
      Schedule Pickup
    </button>
  </div>
)}


     {tab === 6 && (
  <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-[#f5f5f5] text-center">
    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl">
      
      {/* Van Icon with Checkmark (centered and larger) */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="bg-purple-100 rounded-full w-24 h-24 flex items-center justify-center">
            <img src={PickupLogo} alt="Van" className="w-14 h-14" />
          </div>
          <div className="absolute bottom-1 right-1 bg-green-500 border-2 border-white rounded-full w-6 h-6 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414L8.414 15 5.293 11.879a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Text Confirmation */}
      <h2 className="text-xl font-semibold text-black mb-3">Pickup Confirmed!</h2>
      <p className="text-base text-gray-700 leading-relaxed">
        Your pickup is scheduled for <strong>Tuesday, August 13</strong>.<br />
        We’ll be there between <strong>1–3pm</strong>.
      </p>
    </div>
  </div>
)}

    </div>
  </>
  );
}
