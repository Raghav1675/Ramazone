import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`https://ramazone.onrender.com/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    await axios.post("https://ramazone.onrender.com/api/cart", {
      product_id: id,
      quantity: 1,
    });
    alert("Added to cart");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <img src={product.image_url} alt="" width="200" />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h3>₹{product.price}</h3>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductDetail;
