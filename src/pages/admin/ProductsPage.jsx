// src/pages/admin/ProductPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    countInStock: 1,
  });
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000/products";

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      if (editingProduct) {
        await axios.put(
          `${API_URL}/${editingProduct._id}`,
          { ...form },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessage("✅ Product updated successfully!");
      }

      setForm({
        name: "",
        price: "",
        category: "",
        description: "",
        countInStock: 1,
      });

      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Product deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete product");
    }
  };

  // FILL FORM FOR EDITING
  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      countInStock: product.countInStock,
    });
  };

  // 🔍 FILTER PRODUCTS
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header + Search */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold font-serif text-gray-800">
            Product Management
          </h2>

          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

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

        {/* EDIT PRODUCT FORM */}
        {editingProduct && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mb-8 mx-auto space-y-4"
          >
            <h3 className="text-xl font-bold">Edit Product</h3>

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price ($)"
              value={form.price}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              type="number"
              name="countInStock"
              placeholder="Stock Quantity"
              value={form.countInStock}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              rows={3}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 w-full text-white p-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        )}

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 capitalize gap-6">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No products found
            </p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col"
              >
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />

                <h3 className="font-bold text-xl font-serif">{product.name}</h3>
                <p className="text-gray-700 text-lg font-semibold font-mono">₦{Number(product.price || 0).toLocaleString()}</p>
                <p className="text-lg text-gray-500 font-serif">{product.category}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 font-serif fony-bold text-xl text-white p-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-serif fony-bold text-xl p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
