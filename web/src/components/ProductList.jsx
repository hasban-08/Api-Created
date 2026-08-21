import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";


const API_URL = "https://api-created-js53.vercel.app/products";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", quantity: "" });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get(API_URL);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ name: "", price: "", quantity: "" });
    setShowForm(false);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: product.price, quantity: product.quantity });
    setEditId(product.id);
    setShowForm(true);
  };

  const confirmDelete = (id) => setDeleteId(id);

  const handleDelete = async () => {
    await axios.delete(`${API_URL}/${deleteId}`);
    setDeleteId(null);
    fetchProducts();
  };

  return (
    <div>
      <div className="header">
        <h2>Products</h2>
        <button
          className="add-btn"
          onClick={() => {
            setEditId(null);
            setForm({ name: "", price: "", quantity: "" });
            setShowForm(true);
          }}
        >
          + Add Product
        </button>
      </div>

      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <div className="card-icons">
              <div className="icon-btn" onClick={() => handleEdit(p)}>
                <FaEdit className="icon-edit" size={14} />
              </div>
              <div className="icon-btn" onClick={() => confirmDelete(p.id)}>
                <FaTrash className="icon-delete" size={14} />
              </div>
            </div>

            <h3>{p.name}</h3>
            <p className="product-price">Rs {p.price}</p>
            <p>Qty: {p.quantity}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="overlay">
          <div className="modal">
            <h3>{editId ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
              <input type="text" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
              <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-submit">{editId ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="overlay">
          <div className="modal">
            <h3>Delete Product?</h3>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-delete" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;