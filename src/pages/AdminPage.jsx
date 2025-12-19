import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function AdminPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/"); // redirect non-admin users
    }
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id)); 
        setProducts(products.filter(p => p.id !== id));
    
  };

  const editProduct = async (id) => {
    const newTitle = prompt("Enter new title:");
    if (!newTitle) return;
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, { title: newTitle });
    setProducts(products.map(p => p.id === id ? { ...p, title: newTitle } : p));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard Product</h1>
      <div className="grid grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <img src={product.imageUrl} alt={product.title} className="w-full h-40 object-cover mb-2" />
            <h3 className="font-bold">{product.title}</h3>
            <p>₦{Number(product.price || 0).toLocaleString()}</p>
            <p className="text-gray-600">{product.description}</p>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => editProduct(product.id)}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Edit
              </button>
              <button 
                onClick={() => deleteProduct(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
