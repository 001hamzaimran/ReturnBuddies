import React from 'react'

export default function PickupPagination({ currentPage, totalPages, setCurrentPage }) {
    return (
        <div className="flex justify-between items-center px-4 py-3 bg-white border-t">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                Previous
            </button>

            <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
            </div>

            <button
                onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    )
}
