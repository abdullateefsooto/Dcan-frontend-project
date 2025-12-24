import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

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

  const token = localStorage.getItem("token");

  // 🔹 FETCH PRODUCTS
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
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

  // 🔹 HANDLE FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🔹 UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setLoading(true);
    setMessage("");

    try {
      await api.put(`/products/${editingProduct._id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Product updated successfully!");
      setEditingProduct(null);
      setForm({
        name: "",
        price: "",
        category: "",
        description: "",
        countInStock: 1,
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 DELETE PRODUCT
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Product deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete product");
    }
  };

  // 🔹 EDIT PRODUCT
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

  // 🔹 FILTER PRODUCTS
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold font-serif text-gray-800">
            Product Management
          </h2>

          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg w-72"
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

        {/* EDIT FORM */}
        {editingProduct && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mb-8 mx-auto space-y-4"
          >
            <h3 className="text-xl font-bold">Edit Product</h3>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Product Name"
              required
            />

            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Price"
              required
            />

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Category"
              required
            />

            <input
              name="countInStock"
              type="number"
              value={form.countInStock}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Stock Quantity"
              required
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="Description"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 w-full text-white p-3 rounded-lg"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        )}

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 capitalize">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No products found
            </p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />

                <h3 className="font-bold text-xl">{product.name}</h3>
                <p className="font-semibold">
                  ₦{Number(product.price).toLocaleString()}
                </p>
                <p className="text-gray-500">{product.category}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-yellow-500 text-white p-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 bg-red-500 text-white p-2 rounded"
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
