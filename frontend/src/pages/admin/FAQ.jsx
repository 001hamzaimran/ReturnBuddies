import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function FAQ() {
  const [faqList, setFaqList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const getAllFAQ = async () => {
    try {
      const response = await fetch(`${BASE_URL}get-all-faq`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setFaqList(data.data);
      } else {
        toast.error("Failed to fetch FAQs, please reload the page.");
      }
    } catch (error) {
      toast.error("Error fetching FAQs, please try again later.");
    }
  };

  const handleCreateOrEdit = async () => {
    if (!formData.question || !formData.answer) {
      toast.error("Both fields are required");
      return;
    }

    try {
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `${BASE_URL}edit-faq/${selectedFAQ._id}`
        : `${BASE_URL}add-faq`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(isEditMode ? "FAQ updated" : "FAQ created");
        setIsModalOpen(false);
        setFormData({ question: "", answer: "" });
        getAllFAQ();
      } else {
        toast.error(data.message || "Failed to submit");
      }
    } catch (error) {
      toast.error("Error submitting FAQ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const response = await fetch(`${BASE_URL}delete-faq/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success("FAQ deleted");
        getAllFAQ();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting FAQ");
    }
  };

  const openEditModal = (faq) => {
    setSelectedFAQ(faq);
    setFormData({ question: faq.question, answer: faq.answer });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({ question: "", answer: "" });
    setSelectedFAQ(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  useEffect(() => {
    getAllFAQ();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">FAQs</h2>
      <button
        onClick={openCreateModal}
        className="bg-purple-700 text-white px-4 py-2 rounded mb-6 hover:bg-purple-800"
      >
        + Add New FAQ
      </button>

      <div className="space-y-4">
        {faqList.map((faq) => (
          <div
            key={faq._id}
            className="border border-purple-200 rounded-md p-4 bg-white shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-purple-700">
                  {faq.question}
                </h3>
                <p className="text-gray-700 mt-1">{faq.answer}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(faq)}
                  className="text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-purple-700">
              {isEditMode ? "Edit FAQ" : "Create FAQ"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Answer
                </label>
                <textarea
                  rows="4"
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrEdit}
                className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
              >
                {isEditMode ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
