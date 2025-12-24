import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


/**
 * Home Component
 * - Fetches products from backend (MongoDB)
 * - Supports search & category filter
 * - Flash deals carousel
 * - Product grid
 * - Floating cart button
 */
export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [previewProduct, setPreviewProduct] = useState(null);
  const flashRef = useRef(null);
  const [flashIndex, setFlashIndex] = useState(0);
  const navigate = useNavigate();

  const heroBanners = [
    { id: 1, title: "Massive Discounts • Shop Best Sellers", subtitle: "Top gadgets, fashion and home essentials — limited time", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1400&auto=format&fit=crop" },
    { id: 2, title: "New Arrivals Daily", subtitle: "Fresh drops added every day — don't miss out", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400" },
    { id: 3, title: "Free Shipping Over ₦20,000", subtitle: "Fast delivery across the country", image: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ];


  useEffect(() => {
  const handleSearch = (e) => {
    setSearchTerm(e.detail);
  };
  window.addEventListener("searchChange", handleSearch);
  return () => window.removeEventListener("searchChange", handleSearch);
}, []);

  // Fetch products from backend
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      const data = res.data;

      const mapped = data.map((p) => ({
        id: p._id,
        title: p.title || p.name,
        price: p.price,
        image: p.image || p.imageUrl,
        category: p.category || "Uncategorized",
        rating: p.rating || 4.7,
        description: p.description || p.desc,
      }));

      setProducts(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  fetchProducts();
}, []);




  // Load cart from localStorage
  useEffect(() => setCart(JSON.parse(localStorage.getItem("cart")) || []), []);
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  // Auto-scroll flash deals
  useEffect(() => {
    const id = setInterval(() => {
      setFlashIndex((i) => (i + 1) % Math.max(4, products.length || 4));
      if (flashRef.current) {
        flashRef.current.scrollBy({ left: flashRef.current.clientWidth * 0.5, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(id);
  }, [products]);

  const addToCart = (product) => {
    const exist = cart.find((item) => item.id === product.id);
    const updatedCart = exist
      ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
  };

  const getImage = (p) => p?.image || "https://via.placeholder.com/600x400?text=No+Image";

  const filteredProducts = products.filter(
    (p) => (category === "All" || p.category === category) && p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <HeroCarousel slides={heroBanners}  />

        <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <PromoCard title="Free Shipping" desc="Over ₦20,000" emoji="🚚" />
          <PromoCard title="Daily Deals" desc="New offers" emoji="🔥" />
          <PromoCard title="Secure Payment" desc="100% Protected" emoji="🔒" />
          <PromoCard title="24/7 Support" desc="We got you" emoji="💬" />
        </section>

        {/* Flash Deals */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-serif font-semibold">Flash Deals</h3>
            <button
              className="text-lg text-indigo-600 capitalize font-sans"
              onClick={() => document.getElementById("products-grid").scrollIntoView({ behavior: "smooth" })}
            >
              See all
            </button>
          </div>

          <div ref={flashRef} className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {products.slice(0, 8).map((p) => (
              <div key={p.id} className="min-w-[180px] bg-white rounded-lg p-3 shadow-sm flex-shrink-0">
                <div className="w-full h-32 rounded-md overflow-hidden mb-2">
                  <img src={getImage(p)} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="text-sm font-medium line-clamp-2">{p.title}</div>
                <div className="mt-2 font-bold text-indigo-600">₦{Number(p.price).toLocaleString()}</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setPreviewProduct(p)} className="flex-1 py-1 text-xs bg-gray-100 rounded">Preview</button>
                  <button onClick={() => addToCart(p)} className="flex-1 py-1 text-xs bg-indigo-600 text-white rounded">Add</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section id="products-grid" className="mt-8">
          <h2 className="text-2xl font-sans font-bold mb-4">Trending Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition relative">
                <div className="w-full h-40 rounded-md overflow-hidden mb-3">
                  <img src={getImage(p)} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold text-sm line-clamp-2">{p.title}</h3>
                <div className="mt-2 flex items-baseline justify-between">
                  <div className="text-indigo-600 font-bold">₦{Number(p.price).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">⭐ {p.rating || "4.7"}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setPreviewProduct(p)} className="flex-1 py-2 bg-gray-100 rounded">Preview</button>
                  <button onClick={() => addToCart(p)} className="flex-1 py-2 bg-indigo-600 text-white rounded">Add</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Cart */}
      <button
        onClick={() => navigate("/cart")}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-3"
      >
        🛒 Cart
        <span className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">{cart.length}</span>
      </button>

      {/* Product Preview Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full overflow-auto relative">
            <button onClick={() => setPreviewProduct(null)} className="absolute top-3 right-3 text-gray-600 text-xl">✕</button>
            <div className="grid md:grid-cols-2 gap-4 p-6">
              <div className="w-full h-80 rounded overflow-hidden">
                <img src={getImage(previewProduct)} alt={previewProduct.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{previewProduct.title}</h2>
                <p className="text-indigo-600 font-bold text-xl mb-3">₦{Number(previewProduct.price).toLocaleString()}</p>
                <p className="text-gray-700 mb-4">{previewProduct.description}</p>
                <div className="flex gap-3">
                  <button onClick={() => { addToCart(previewProduct); setPreviewProduct(null); }} className="px-4 py-2 bg-indigo-600 text-white rounded">Add to cart</button>
                  <button onClick={() => setPreviewProduct(null)} className="px-4 py-2 border rounded">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function PromoCard({ title, desc, emoji }) {
  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
      <div className="w-12 h-12 rounded-md bg-indigo-50 flex items-center justify-center text-2xl">{emoji}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{desc}</div>
      </div>
    </div>
  );
}

function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="relative">
      <div className="h-56 md:h-80 lg:h-96 relative overflow-hidden rounded-xl">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-all duration-700 ${i === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"}`}
            aria-hidden={i !== index}
          >
            <img src={s.image} alt={s.title} className="w-full h-full object-cover brightness-90" />
            <div className="absolute left-6 top-6 md:top-12 md:left-12 text-white max-w-xl">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold">{s.title}</h2>
              <p className="mt-2 md:mt-4 text-sm md:text-lg">{s.subtitle}</p>
              <div className="mt-4">
                <a className="inline-block bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow" href="#products-grid">Shop now</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
}
