
import React, { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    name: "",
    sku: "",
    category: "",
    size: "",
    color: "",
    price: "",
    stock: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const BASE_URL = "https://eposbackend-2026.onrender.com/api/products";

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Get all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL, getConfig());
      setProducts(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (
        !payload.name.trim() ||
        !payload.sku.trim() ||
        !payload.category.trim() ||
        formData.price === "" ||
        formData.stock === ""
      ) {
        alert("Please fill all required fields");
        return;
      }

      if (editingId) {
        await axios.put(
          `${BASE_URL}/${editingId}`,
          payload,
          getConfig()
        );
        alert("Product updated successfully");
      } else {
        await axios.post(BASE_URL, payload, getConfig());
        alert("Product added successfully");
      }

      setFormData(initialForm);
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save product");
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      size: product.size || "",
      color: product.color || "",
      price: String(product.price),
      stock: String(product.stock),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/${id}`, getConfig());
      alert("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Product Management</h2>

      {/* Add / Edit Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white">
          {editingId ? "Edit Product" : "Add New Product"}
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Product Name *</label>
                <input
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">SKU *</label>
                <input
                  className="form-control"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Category *</label>
                <input
                  className="form-control"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Saree, Shirt, Dress..."
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Size</label>
                <input
                  className="form-control"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Color</label>
                <input
                  className="form-control"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Price *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Stock *</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="form-control"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Product List */}
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Product List</h5>

          <button
            className="btn btn-outline-primary btn-sm"
            onClick={fetchProducts}
          >
            Refresh
          </button>
        </div>

        <div className="card-body">
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-muted mb-0">No products found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product, index) => (
                    <tr key={product._id}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{product.category}</td>
                      <td>{product.size || "-"}</td>
                      <td>{product.color || "-"}</td>
                      <td>₹{product.price}</td>
                      <td>{product.stock}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
