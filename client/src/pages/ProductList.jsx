import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProductList() {
    const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://ramazone.onrender.com/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (id) => {
    try {
      await axios.post("https://ramazone.onrender.com/api/cart", {
        product_id: id,
        quantity: 1,
      });
      alert("Added to cart");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Products</h2>

      {products.map((product) => (
        <div
  key={product.id}
  onClick={() => navigate(`/product/${product.id}`)}
  style={{ border: "1px solid black", margin: "10px", padding: "10px", cursor: "pointer" }}
>
          <img src={product.image_url} alt="" width="100" />
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>
          <button
  onClick={(e) => {
    e.stopPropagation();
    addToCart(product.id);
  }}
>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
