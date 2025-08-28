import React from 'react'
import { FaShippingFast, FaTruck, FaWarehouse } from 'react-icons/fa'

function PickupStatus({pickedUpCount, warehouseCount, carrierCount}) {
    return (
        <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow flex items-center space-x-4">
                <FaTruck className="text-green-600 text-2xl" />
                <div>
                    <p className="text-sm text-gray-500">Picked Up</p>
                    <p className="text-xl font-semibold">{pickedUpCount}</p>
                </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow flex items-center space-x-4">
                <FaWarehouse className="text-yellow-600 text-2xl" />
                <div>
                    <p className="text-sm text-gray-500">At Warehouse</p>
                    <p className="text-xl font-semibold">{warehouseCount}</p>
                </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow flex items-center space-x-4">
                <FaShippingFast className="text-blue-600 text-2xl" />
                <div>
                    <p className="text-sm text-gray-500">At Carrier</p>
                    <p className="text-xl font-semibold">{carrierCount}</p>
                </div>
            </div>
        </div>
          </>
  )
}

export default PickupStatus