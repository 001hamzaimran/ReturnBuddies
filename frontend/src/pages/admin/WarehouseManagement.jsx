import React, { useEffect, useState } from 'react';
import { FiEye, FiPrinter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function WarehouseManagement() {
  const [groupedData, setGroupedData] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentGroupProducts, setCurrentGroupProducts] = useState([]);

  const GetBundles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getAllReturnBundlesAdmin');
      const result = await response.json();

      if (result.success && result.data) {
        const grouped = result.data.reduce((acc, bundle) => {
          const userId = bundle.userId._id;

          if (!acc[userId]) {
            acc[userId] = {
              user: bundle.userId,
              products: [],
            };
          }

          // attach BundleName to each product
          const productsWithBundle = bundle.products.map(p => ({
            ...p,
            BundleName: bundle.BundleName,
            status: bundle.status,
          }));

          acc[userId].products.push(...productsWithBundle);
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

  const handleView = (product, products) => {
    setSelectedProduct(product);
    setCurrentGroupProducts(products);
    setCurrentIndex(products.findIndex((p) => p._id === product._id));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleNext = () => {
    if (currentIndex < currentGroupProducts.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedProduct(currentGroupProducts[newIndex]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedProduct(currentGroupProducts[newIndex]);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Product</title>
        <style>
          body { font-family: Arial, sans-serif;  }
          img { max-width: 100%; height: auto; margin-bottom: 20px; }
          h2 { margin-bottom: 10px; }
          p { margin: 6px 0; }
        </style>
      </head>
      <body>
        <h2>Product Details</h2>
        <img id="print-image" src="${selectedProduct.labelReceipt}" alt="${selectedProduct.productName}" />
        <p><strong>Product:</strong> ${selectedProduct.productName}</p>
        <p><strong>Date:</strong> ${new Date(selectedProduct.date).toLocaleString()}</p>
      </body>
    </html>
  `);

    printWindow.document.close();

    // ✅ wait until image fully loads
    printWindow.onload = () => {
      const img = printWindow.document.getElementById("print-image");
      if (img.complete) {
        printWindow.print();
      } else {
        img.onload = () => {
          printWindow.print();
        };
      }
    };
  };


  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">📦 Warehouse Management</h1>

      {Object.values(groupedData).map((group) => (
        <div key={group.user._id} className="bg-white rounded-xl shadow p-4 md:p-6 mb-6">
          {/* User Info */}
          <div className="flex items-center mb-4">
            <img
              src={group.user.profile}
              alt={group.user.name}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-4"
            />
            <div>
              <h2 className="text-base md:text-lg font-semibold">{group.user.name}</h2>
              <p className="text-xs md:text-sm text-gray-500">{group.user.email}</p>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                <tr>
                  <th className="px-3 py-2 md:px-4 md:py-2">Bundle</th>
                  <th className="px-3 py-2 md:px-4 md:py-2">Product</th>
                  <th className="px-3 py-2 md:px-4 md:py-2">Thumbnail</th>
                  <th className="px-3 py-2 md:px-4 md:py-2">Status</th>
                  <th className="px-3 py-2 md:px-4 md:py-2">Date</th>
                  <th className="px-3 py-2 md:px-4 md:py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {group.products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-3 py-2 md:px-4 md:py-2 font-medium">{product.BundleName}</td>
                    <td className="px-3 py-2 md:px-4 md:py-2 font-medium">{product.productName}</td>
                    <td className="px-3 py-2 md:px-4 md:py-2">
                      <img
                        src={product.thumbnail}
                        alt={product.productName}
                        className="w-10 h-10 md:w-12 md:h-12 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-2 font-medium">{product.status}</td>
                    <td className="px-3 py-2 md:px-4 md:py-2">
                      {new Date(product.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-2">
                      <button
                        onClick={() => handleView(product, group.products)}
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
          </div>

          {group.products.length === 0 && (
            <div className="text-center py-6 text-gray-400">No products yet.</div>
          )}
        </div>
      ))}

      {Object.keys(groupedData).length === 0 && (
        <div className="text-center py-10 text-gray-400">No bundles found.</div>
      )}

      {/* View Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md md:max-w-lg relative">
            <h2 className="text-lg md:text-xl font-bold mb-4">Product Details</h2>

            {/* Larger Product Image */}
            <img
              src={selectedProduct.labelReceipt}
              alt={'Not Uploaded'}
              className="w-full h-64 object-contain rounded mb-4"
            />

            <p className="mb-2"><strong>Product:</strong> {selectedProduct.productName}</p>
            <p className="mb-2"><strong>Date:</strong> {new Date(selectedProduct.date).toLocaleString()}</p>

            {/* Controls */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center"
              >
                <FiChevronLeft className="mr-1" /> Prev
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                <FiPrinter className="mr-1" /> Print
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === currentGroupProducts.length - 1}
                className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center"
              >
                Next <FiChevronRight className="ml-1" />
              </button>
            </div>

            {/* Close */}
            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
