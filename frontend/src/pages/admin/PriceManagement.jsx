import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PriceManagement = () => {
  const [form, setForm] = useState({
    additionalPrice: undefined,
    basePrice: undefined,
    freeItemsThreshold: undefined,
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { additionalPrice, basePrice, freeItemsThreshold } = form;

    // Basic validation
    if (
      additionalPrice === "" ||
      basePrice === "" ||
      freeItemsThreshold === ""
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}update-baseprice`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          BASE_PRICE: parseFloat(basePrice),
          ADDITIONAL_ITEM_PRICE: parseFloat(additionalPrice),
          FREE_ITEMS_THRESHOLD: parseInt(freeItemsThreshold, 10),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Base price updated successfully!");
        setForm({
          additionalPrice: data.data.ADDITIONAL_ITEM_PRICE,
          basePrice: data.data.BASE_PRICE,
          freeItemsThreshold: data.data.FREE_ITEMS_THRESHOLD,
        });
      } else {
        toast.error("Failed to update base price.");
      }
    } catch (error) {
      toast.error("Error updating base price, please try again later.");
    }
  };

  const getBasePrice = async () => {
    try {
      const response = await fetch(`${BASE_URL}get-baseprice`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setForm({
          additionalPrice: data.data.ADDITIONAL_ITEM_PRICE,
          basePrice: data.data.BASE_PRICE,
          freeItemsThreshold: data.data.FREE_ITEMS_THRESHOLD,
        });
      } else {
        toast.error("Failed to fetch base price, please reload the page.");
      }
    } catch (error) {
      toast.error("Error fetching base price, please try again later.");
    }
  };

  useEffect(() => {
    getBasePrice();
  }, []);

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 10,
        backgroundColor: "#fafafa",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Pricing Settings
      </h2>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>
          Additional Price
        </label>
        <input
          type="number"
          name="additionalPrice"
          value={form.additionalPrice}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>Base Price</label>
        <input
          type="number"
          name="basePrice"
          value={form.basePrice}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 5 }}>
          Free Items Threshold
        </label>
        <input
          type="number"
          name="freeItemsThreshold"
          value={form.freeItemsThreshold}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-purple-700 text-white w-full py-2 rounded mb-6 hover:bg-purple-800"
      >
        Save
      </button>
    </div>
  );
};

export default PriceManagement;
