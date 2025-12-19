import React from "react";

const ProductCard = ({ product }) => {
  const handleAddToCart = () => {
    // Get current cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item is already in the cart
    const existingItem = existingCart.find((item) => item.id === product.id);

    let updatedCart;

    if (existingItem) {
      // If item already exists, increase its quantity
      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // If item doesn't exist, add it with quantity 1
      updatedCart = [...existingCart, { ...product, quantity: 1 }];
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    alert(`${product.title} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img
        src={product.imageUrl}
        alt={product.title}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-green-600 font-bold mt-1">₦{product.price}</p>

      <button
        onClick={handleAddToCart}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
