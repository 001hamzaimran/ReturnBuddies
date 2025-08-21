import React, { useEffect, useState } from 'react';
import { FiEye } from 'react-icons/fi';

export default function WarehouseManagement() {
  const [groupedData, setGroupedData] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  const GetBundles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getAllReturnBundlesAdmin');
      const result = await response.json();

      if (result.success && result.data) {
        // Group by userId
        const grouped = result.data.reduce((acc, bundle) => {
          const userId = bundle.userId._id;

          if (!acc[userId]) {
            acc[userId] = {
              user: bundle.userId,
              products: [],
            };
          }

          acc[userId].products.push(...bundle.products);
          return acc;
        }, {});

        setGroupedData(grouped);
      }
    } catch (error) {
      console.error('Error fetching bundles:', error);
    }
  };

  useEffect(() => {
    GetBundles();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Warehouse Management</h1>

      {Object.values(groupedData).map((group) => (
        <div key={group.user._id} className="bg-white rounded-xl shadow p-6 mb-6">
          {/* User Info */}
          <div className="flex items-center mb-4">
            <img
              src={group.user.profile}
              alt={group.user.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">{group.user.name}</h2>
              <p className="text-sm text-gray-500">{group.user.email}</p>
            </div>
          </div>

          {/* Products Table */}
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Thumbnail</th>
                <th className="px-4 py-2">Label Status</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {group.products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-2 font-medium">{product.productName}</td>
                  <td className="px-4 py-2">
                    <img
                      src={product.thumbnail}
                      alt={product.productName}
                      className="w-12 h-12 rounded"
                    />
                  </td>
                  <td className="px-4 py-2">{product.labelReceipt}</td>
                  <td className="px-4 py-2">{new Date(product.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <FiEye />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {group.products.length === 0 && (
            <div className="text-center py-6 text-gray-400">No products yet.</div>
          )}
        </div>
      ))}

      {Object.keys(groupedData).length === 0 && (
        <div className="text-center py-10 text-gray-400">No bundles found.</div>
      )}

      {/* View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <img
              src={selectedProduct.thumbnail}
              alt={selectedProduct.productName}
              className="w-32 h-32 object-cover rounded mb-4 mx-auto"
            />
            <p className="mb-2"><strong>Name:</strong> {selectedProduct.productName}</p>
            <p className="mb-2"><strong>Label Status:</strong> {selectedProduct.labelReceipt}</p>
            <p className="mb-2"><strong>Date:</strong> {new Date(selectedProduct.date).toLocaleString()}</p>

            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
