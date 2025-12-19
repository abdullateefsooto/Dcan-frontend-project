import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import {
  FaUsers,
  FaShoppingCart,
  FaBoxOpen,
  FaDollarSign,
  FaSearch,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const adminName = user?.name || "Admin";

  const formatNaira = (amount) => "₦" + Number(amount).toLocaleString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes, userRes] = await Promise.all([
          axios.get("/products"),
          axios.get("/orders"),
          axios.get("/users"),
        ]);

        setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
        setOrders(Array.isArray(orderRes.data) ? orderRes.data : []);
        setUsers(Array.isArray(userRes.data) ? userRes.data : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totals = useMemo(() => {
    const totalSales = orders.reduce(
      (sum, o) => sum + Number(o.totalPrice || 0),
      0
    );
    return {
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalSales,
    };
  }, [users, products, orders]);

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const topProducts = useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      (order.orderItems || []).forEach((it) => {
        const id = it.product?._id || it.productId || it.product;
        const name = it.name || it.product?.name || "Unknown";
        const qty = Number(it.qty || 0);
        const price = Number(it.price || 0);
        if (!map.has(id)) map.set(id, { name, qty: 0, revenue: 0 });
        const entry = map.get(id);
        entry.qty += qty;
        entry.revenue += qty * price;
      });
    });
    return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  const categoryPerformance = useMemo(() => {
    const productCategory = new Map();
    products.forEach((p) =>
      productCategory.set(p._id, p.category || "Uncategorized")
    );

    const map = new Map();
    orders.forEach((order) => {
      (order.orderItems || []).forEach((it) => {
        const id = it.product?._id || it.productId || it.product;
        const qty = Number(it.qty || 0);
        const price = Number(it.price || 0);
        const cat = productCategory.get(id) || "Uncategorized";
        if (!map.has(cat)) map.set(cat, { category: cat, revenue: 0 });
        map.get(cat).revenue += qty * price;
      });
    });

    return [...map.values()];
  }, [products, orders]);

  const COLORS = ["#4F46E5", "#06B6D4", "#F59E0B", "#EF4444", "#10B981"];

  if (loading)
    return (
      <div className="flex">
        <Sidebar />
        <div className="ml-64 p-8">Loading dashboard...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex">
        <Sidebar />
        <div className="ml-64 p-8 text-red-600">{error}</div>
      </div>
    );

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 w-full bg-gray-100 min-h-screen pb-10">
        {/* HEADER */}
        <div className="p-6 flex flex-col md:flex-row md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold font-serif capitalize">Welcome back, {adminName} 👋</h2>
            <p className="text-gray-500 text-lg font-mono">Store overview</p>
          </div>

          <div className="relative w-full md:w-[420px]">
            <FaSearch className="relative left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border shadow-sm"
            />
          </div>
        </div>

        {/* STATS */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4  gap-6">
          <StatCard icon={<FaDollarSign />} label="Total Sales" value={formatNaira(totals.totalSales)} />
          <StatCard icon={<FaUsers />} label="Total Users" value={totals.totalUsers} />
          <StatCard icon={<FaShoppingCart />} label="Total Orders" value={totals.totalOrders} />
          <StatCard icon={<FaBoxOpen />} label="Total Products" value={totals.totalProducts} />
        </div>

        {/* CHARTS */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded shadow p-5 lg:col-span-2">
            <h3 className="font-semibold font-serif mb-2">Top Products</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="qty" fill="#4F46E5" />
                <Bar dataKey="revenue" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded shadow p-5">
            <h3 className="font-semibold font-serif trxt mb-3">Category Performance</h3>
            <ResponsiveContainer width="100%" className="font-serif" height={230}>
              <PieChart>
                <Pie
                  data={categoryPerformance.map((c) => ({ name: c.category, value: c.revenue }))}
                  dataKey="value"
                  innerRadius={40}
                  outerRadius={70}
                  label
                >
                  {categoryPerformance.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PRODUCTS TABLE WITH IMAGES */}
        <div className="p-6">
          <div className="bg-white rounded shadow p-5">
            <h3 className="font-semibold font-serif text-xl mb-4">Products</h3>

            <table className="w-full text-sm  text-lg">
              <thead className="bg-gray-100 font-serif">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-center">Category</th>
                  <th className="p-3 text-center">Price</th>
                  <th className="p-3 text-center">Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="border-b">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={p.image || "https://via.placeholder.com/60"}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="font-serif capitalize">{p.name}</span>
                    </td>
                    <td className="p-3 text-center font-serif capitalize">{p.category}</td>
                    <td className="p-3 text-center font-sans">{formatNaira(p.price)}</td>
                    <td className="p-3 text-center font-sans">{p.countInStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// STAT CARD
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded shadow p-5 flex gap-4">
    <div className="p-3 bg-indigo-50 rounded text-indigo-600 text-xl">
      {icon}
    </div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
);
