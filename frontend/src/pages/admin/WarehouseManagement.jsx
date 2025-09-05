import React, { useEffect, useState } from "react";
import {
  FiEye,
  FiPrinter,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiX,
  FiInfo,
  FiPackage,
  FiUser,
  FiCalendar,
  FiMapPin,
  FiLoader
} from "react-icons/fi";
import { date } from "zod";

export default function WarehouseManagement() {
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user")).user._id;

  const [pickups, setPickups] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentGroupProducts, setCurrentGroupProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activePickup, setActivePickup] = useState(null);
  const [activeBundle, setActiveBundle] = useState(null);

  useEffect(() => {
    console.log("Selected Product:", selectedProduct);
  }, [selectedProduct]);

  // ✅ Fetch pickups from API
  const getAllPickups = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}get-all-pickup`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userid: userId,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();

      if (result.success && result.data) {
        const transformed = result.data.map((pickup) => {
          const bundles = pickup.bundleId.map((bundle) => {
            const groupedByLabel = bundle.products.reduce((acc, product) => {
              const label = product.labelReceipt || "No Label";
              if (!acc[label]) acc[label] = [];
              acc[label].push(product);
              return acc;
            }, {});
            return { ...bundle, groupedProducts: groupedByLabel };
          });

          return {
            pickupId: pickup._id,
            pickupName: pickup.PickupName,
            pickupDate: pickup.pickupDate,
            pickupTime: pickup.pickupTime,
            user: pickup.userId,
            bundles,
            status: pickup.status,
            pickupAddress: pickup.pickupAddress || null,
          };
        });

        setPickups(transformed);
      }
    } catch (error) {
      console.error("Error fetching pickups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPickups();
  }, []);

  // ✅ Modal handlers
  const handleView = (product, products, pickupstatus, pickup_date) => {
    console.log("handle view first param:", product);
    console.log("handle view second param:", pickupstatus);
    setSelectedProduct({ product, pickupstatus, date: pickup_date });
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
    const { product, date, pickupstatus } = selectedProduct;

    const printWindow = window.open("");
    printWindow.document.write(`
    <html>
      <head>
        <title>Pickup Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
          h1, h2, h3 { margin: 0; padding: 5px 0; }
          .invoice-box {
            max-width: 800px;
            margin: auto;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0,0,0,0.15);
            padding: 30px;
            font-size: 14px;
            color: #555;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #eee;
            margin-bottom: 20px;
            padding-bottom: 10px;
          }
          .header h1 {
            font-size: 24px;
            color: #333;
          }
          .section {
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table th, table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          table th {
            background: #f8f8f8;
            font-weight: bold;
          }
          .images {
            margin-top: 20px;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
          }
          .images img {
            max-height: 150px;
            border: 1px solid #ccc;
            padding: 5px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <h1>Pickup Invoice</h1>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="section">
            <h2>Pickup Information</h2>
            <p><strong>Pickup Status:</strong> ${pickupstatus || "N/A"}</p>
            <p><strong>Return By:</strong> ${date ? new Date(date).toLocaleDateString() : "N/A"}</p>
            <p><strong>User ID:</strong> ${product.userId || "N/A"}</p>
          </div>

          <div class="section">
            <h2>Product Information</h2>
            <table>
              <tr>
                <th>Product Name</th>
                <td>${product.productName}</td>
              </tr>
              <tr>
                <th>Oversized</th>
                <td>${product.oversized ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <th>Created At</th>
                <td>${new Date(product.createdAt).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Updated At</th>
                <td>${new Date(product.updatedAt).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Product ID</th>
                <td>${product._id}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h2>Images</h2>
            <div class="images">
              <div>
                <p><strong>Thumbnail:</strong></p>
                <img src="${product.thumbnail}" alt="Thumbnail"/>
              </div>
              <div>
                <p><strong>Label Receipt:</strong></p>
                <img src="${product.labelReceipt}" alt="Label Receipt"/>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  // ✅ Filter by search (user, bundle, product)
  const filteredPickups = pickups.filter((pickup) => {
    const userMatch = pickup.user?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const bundleMatch = pickup.bundles.some((bundle) =>
      bundle.BundleName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const productMatch = pickup.bundles.some((bundle) =>
      bundle.products.some((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return userMatch || bundleMatch || productMatch;
  });

  // Toggle pickup details
  const togglePickup = (pickupId) => {
    setActivePickup(activePickup === pickupId ? null : pickupId);
  };

  // Toggle bundle details
  const toggleBundle = (bundleIndex) => {
    setActiveBundle(activeBundle === bundleIndex ? null : bundleIndex);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "picked up":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "in transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-orange-100 text-orange-800";
      case "inspected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
        <FiPackage className="mr-2 text-blue-600" />
        Warehouse Management
      </h1>

      {/* ✅ Search Bar */}
      <div className="mb-6 flex items-center max-w-md mx-auto md:mx-0">
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product, bundle or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <FiLoader className="animate-spin text-blue-600 text-3xl mb-4" />
          <p className="text-gray-600">Loading pickup data...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPickups.length === 0 && (
        <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm p-6">
          <FiInfo className="mx-auto text-3xl mb-3 text-gray-400" />
          <p className="text-lg font-medium mb-1">No pickups found</p>
          <p className="text-gray-500">
            {searchTerm ? "Try adjusting your search query" : "No pickups available at the moment"}
          </p>
        </div>
      )}

      {/* Pickups List */}
      <div className="space-y-4 md:space-y-6">
        {filteredPickups.map((pickup) => (
          <div
            key={pickup.pickupId}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            {/* Pickup Header */}
            <div
              className="p-4 md:p-6 cursor-pointer flex justify-between items-center"
              onClick={() => togglePickup(pickup.pickupId)}
            >
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <h2 className="text-lg md:text-xl font-semibold mr-2">
                    Pickup: {pickup.pickupName || pickup.pickupId}
                  </h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                    {pickup.status}
                  </span>
                </div>
                <div className="flex items-center mt-1 text-gray-500 text-sm">
                  <FiCalendar className="mr-1" />
                  <span>{new Date(pickup.pickupDate).toLocaleDateString()} | {pickup.pickupTime}</span>
                </div>
              </div>
              <div className="transform transition-transform duration-200">
                {activePickup === pickup.pickupId ? (
                  <FiX className="text-xl text-gray-400" />
                ) : (
                  <FiChevronRight className="text-xl text-gray-400" />
                )}
              </div>
            </div>

            {/* Pickup Content (Collapsible) */}
            {activePickup === pickup.pickupId && (
              <div className="px-4 pb-4 md:px-6 md:pb-6 border-t pt-4 animate-fadeIn">
                {/* User Info */}
                <div className="flex items-center mb-6 p-3 bg-blue-50 rounded-lg">
                  <img
                    src={pickup.user.profile}
                    alt={pickup.user.name}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full mr-4 border-2 border-white shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold flex items-center">
                      <FiUser className="mr-1 text-blue-600" />
                      {pickup.user.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">{pickup.user.email}</p>
                    {pickup.pickupAddress && (
                      <p className="text-sm text-gray-600 flex items-start">
                        <FiMapPin className="mr-1 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{pickup.pickupAddress.street}, {pickup.pickupAddress.city}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Bundles */}
                <div className="space-y-4">
                  {pickup.bundles.map((bundle, bundleIndex) => (
                    <div key={bundleIndex} className="border rounded-lg overflow-hidden">
                      {/* Bundle Header */}
                      <div
                        className="bg-gray-50 p-3 cursor-pointer flex justify-between items-center"
                        onClick={() => toggleBundle(bundleIndex)}
                      >
                        <div className="flex items-center">
                          <FiPackage className="mr-2 text-blue-600" />
                          <h3 className="font-semibold">{bundle.BundleName}</h3>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bundle.status)}`}>
                            {bundle.status}
                          </span>
                        </div>
                        <div className="transform transition-transform duration-200">
                          {activeBundle === bundleIndex ? (
                            <FiX className="text-gray-400" />
                          ) : (
                            <FiChevronRight className="text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Bundle Content (Collapsible) */}
                      {activeBundle === bundleIndex && (
                        <div className="p-3 animate-fadeIn">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                <tr>
                                  <th className="px-3 py-2">Product</th>
                                  <th className="px-3 py-2">Thumbnail</th>
                                  <th className="px-3 py-2">Status</th>
                                  <th className="px-3 py-2">Return By</th>
                                  <th className="px-3 py-2">Oversized</th>
                                  <th className="px-3 py-2">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {bundle.products.map((product) => (
                                  <tr key={product._id} className="border-b hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-3 py-2 font-medium">{product.productName}</td>
                                    <td className="px-3 py-2">
                                      <img
                                        src={product.thumbnail}
                                        className="w-12 h-12 rounded object-cover"
                                        alt={product.productName}
                                      />
                                    </td>
                                    <td className="px-3 py-2">
                                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}>
                                        {pickup.status}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2">
                                      {product.date
                                        ? new Date(product.date).toLocaleDateString()
                                        : "N/A"}
                                    </td>
                                    <td className="px-3 py-2">
                                      {product.oversized ? (
                                        <span className="text-red-600 font-bold text-sm">
                                          ⚠ Oversized
                                        </span>
                                      ) : (
                                        "No"
                                      )}
                                    </td>
                                    <td className="px-3 py-2">
                                      <button
                                        onClick={() => handleView(product, bundle.products, pickup.status, product.date)}
                                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors duration-150 p-1 rounded hover:bg-blue-50"
                                      >
                                        <FiEye className="text-sm" />
                                        <span className="text-xs">View</span>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md md:max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-150"
            >
              <FiX className="text-xl" />
            </button>

            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center">
              <FiPackage className="mr-2 text-blue-600" />
              Product Details
            </h2>

            <div className="mb-4 flex justify-center">
              <img
                src={selectedProduct.product.labelReceipt || "/placeholder-image.jpg"}
                alt={selectedProduct.product.productName}
                className="w-full max-w-xs h-64 object-contain rounded-lg border"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Product Name</p>
                <p className="font-medium">{selectedProduct.product.productName}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{selectedProduct.pickupstatus}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Return By</p>
                <p className="font-medium">
                  {selectedProduct.date
                    ? new Date(selectedProduct.date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Oversized</p>
                <p className="font-medium">
                  {selectedProduct.product.isOversized ? "Yes ⚠" : "No"}
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-6 mb-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 flex items-center transition-colors duration-150 hover:bg-gray-300"
              >
                <FiChevronLeft className="mr-1" /> Prev
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors duration-150"
              >
                <FiPrinter className="mr-1" /> Print
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === currentGroupProducts.length - 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 flex items-center transition-colors duration-150 hover:bg-gray-300"
              >
                Next <FiChevronRight className="ml-1" />
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              {currentIndex + 1} of {currentGroupProducts.length} products
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}