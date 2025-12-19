import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return setMessage("❌ Please select an image");

    setLoading(true);
    setMessage("");

    try {
      // 🔹 CLOUDINARY UPLOAD (FETCH — NO CORS ISSUES)
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      formData.append("folder", "products");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudData = await cloudRes.json();

      if (!cloudRes.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const imageUrl = cloudData.secure_url;

      // 🔹 SAVE PRODUCT TO BACKEND
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/products`,
        {
          name,
          price: Number(price),
          category,
          description,
          countInStock: Number(countInStock),
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Product added successfully!");
      setName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setCountInStock(1);
      setImageFile(null);
    } catch (error) {
      console.error(error);
      setMessage("❌ Image upload or product creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold font-serif mb-6 text-gray-800">
          Add New Product
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded font-semibold ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto space-y-5"
        >
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="number"
            placeholder="Price (₦)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="text"
            placeholder="Category (e.g Sneakers)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="number"
            placeholder="Stock Quantity"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          <textarea
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="border p-2 rounded-lg w-full"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 w-full text-white p-3 rounded-lg text-lg font-semibold hover:bg-indigo-700"
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
