
import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3000/api";

function Purchases() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [supplierId, setSupplierId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [items, setItems] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchData = async () => {
    try {
      setError("");

      const [supplierRes, productRes, purchaseRes] = await Promise.all([
        fetch(`${BASE_URL}/suppliers`, { headers: authHeaders }),
        fetch(`${BASE_URL}/products`, { headers: authHeaders }),
        fetch(`${BASE_URL}/purchases`, { headers: authHeaders }),
      ]);

      const supplierData = await supplierRes.json();
      const productData = await productRes.json();
      const purchaseData = await purchaseRes.json();

      if (!supplierRes.ok) {
        throw new Error(supplierData.message || "Failed to load suppliers");
      }

      if (!productRes.ok) {
        throw new Error(productData.message || "Failed to load products");
      }

      if (!purchaseRes.ok) {
        throw new Error(purchaseData.message || "Failed to load purchases");
      }

      setSuppliers(
        Array.isArray(supplierData)
          ? supplierData
          : supplierData.suppliers || []
      );

      setProducts(
        Array.isArray(productData)
          ? productData
          : productData.products || []
      );

      setPurchases(
        Array.isArray(purchaseData)
          ? purchaseData
          : purchaseData.purchases || []
      );
    } catch (err) {
      setError(err.message || "Unable to load data");
    }
  };

  useEffect(() => {
    fetchData();
    // Load data when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProductChange = (productId) => {
    setSelectedProduct(productId);

    const product = products.find((p) => p._id === productId);

    // Default to the product's selling price as an editable starting value.
    // Change this if your product model has a separate cost price.
    setPurchasePrice(product ? String(product.price) : "");
  };

  const addItem = () => {
    setError("");
    setMessage("");

    if (!selectedProduct) {
      setError("Please select a product");
      return;
    }

    const qty = Number(quantity);
    const price = Number(purchasePrice);

    if (!Number.isInteger(qty) || qty < 1) {
      setError("Quantity must be a whole number greater than zero");
      return;
    }

    if (
      purchasePrice.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError("Enter a valid purchase price");
      return;
    }

    const product = products.find((p) => p._id === selectedProduct);

    if (!product) {
      setError("Selected product not found");
      return;
    }

    setItems((current) => {
      const existing = current.find(
        (item) => item.product === product._id
      );

      if (existing) {
        return current.map((item) =>
          item.product === product._id
            ? {
                ...item,
                quantity: item.quantity + qty,
                purchasePrice: price,
                lineTotal: (item.quantity + qty) * price,
              }
            : item
        );
      }

      return [
        ...current,
        {
          product: product._id,
          name: product.name,
          sku: product.sku,
          quantity: qty,
          purchasePrice: price,
          lineTotal: qty * price,
        },
      ];
    });

    setSelectedProduct("");
    setQuantity("1");
    setPurchasePrice("");
  };

  const removeItem = (productId) => {
    setItems((current) =>
      current.filter((item) => item.product !== productId)
    );
  };

  const totalAmount = items.reduce(
    (total, item) => total + item.quantity * item.purchasePrice,
    0
  );

  const handleSavePurchase = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!supplierId) {
      setError("Please select a supplier");
      return;
    }

    if (items.length === 0) {
      setError("Please add at least one product");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/purchases`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          supplier: supplierId,
          items: items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            purchasePrice: item.purchasePrice,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save purchase");
      }

      setMessage("Purchase saved successfully! Stock has been updated.");
      setSupplierId("");
      setItems([]);
      setSelectedProduct("");
      setQuantity("1");
      setPurchasePrice("");

      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to save purchase");
    } finally {
      setLoading(false);
    }
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const supplierName =
      typeof purchase.supplier === "object"
        ? purchase.supplier?.name || ""
        : "";

    const billNumber = purchase._id || "";
    const searchText = search.toLowerCase();

    return (
      supplierName.toLowerCase().includes(searchText) ||
      billNumber.toLowerCase().includes(searchText)
    );
  });

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "-";

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Purchase Management</h2>
          <p className="text-muted mb-0">
            Record supplier purchases and manage stock
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={fetchData}
        >
          Refresh Data
        </button>
      </div>

      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">Create Purchase</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSavePurchase}>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Supplier *
                </label>

                <select
                  className="form-select"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  required
                >
                  <option value="">Select supplier</option>

                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name} - {supplier.phone}
                    </option>
                  ))}
                </select>

                {suppliers.length === 0 && (
                  <small className="text-muted">
                    Add a supplier before creating a purchase.
                  </small>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Product *
                </label>

                <select
                  className="form-select"
                  value={selectedProduct}
                  onChange={(e) => handleProductChange(e.target.value)}
                >
                  <option value="">Select product</option>

                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} ({product.sku}) — Stock: {product.stock}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-5">
                <label className="form-label fw-semibold">
                  Quantity *
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="col-md-5">
                <label className="form-label fw-semibold">
                  Purchase Price per Item (₹) *
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="Enter purchase price"
                />
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={addItem}
                >
                  Add Item
                </button>
              </div>
            </div>

            <div className="table-responsive mb-3">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                    <th>Unit Purchase Price</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No products added yet
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.product}>
                        <td>{item.name}</td>
                        <td>{item.sku}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.purchasePrice.toFixed(2)}</td>
                        <td>₹{item.lineTotal.toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeItem(item.product)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h4 className="mb-0">
                Total: ₹{totalAmount.toFixed(2)}
              </h4>

              <button
                type="submit"
                className="btn btn-success px-4"
                disabled={loading || items.length === 0 || !supplierId}
              >
                {loading ? "Saving..." : "Save Purchase"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">Purchase History</h5>

          <input
            type="search"
            className="form-control"
            style={{ maxWidth: "300px" }}
            placeholder="Search supplier or purchase ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Purchase ID</th>
                  <th>Supplier</th>
                  <th>Products</th>
                  <th>Total Amount</th>
                  <th>Created By</th>
                </tr>
              </thead>

              <tbody>
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No purchases found
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((purchase) => (
                    <tr key={purchase._id}>
                      <td>{formatDate(purchase.createdAt)}</td>
                      <td>
                        <small>{purchase._id}</small>
                      </td>
                      <td>
                        {purchase.supplier?.name || "Supplier unavailable"}
                      </td>
                      <td>
                        {purchase.items?.map((item, index) => (
                          <div key={`${purchase._id}-${index}`}>
                            {item.name} × {item.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="fw-semibold">
                        ₹{Number(purchase.totalAmount || 0).toFixed(2)}
                      </td>
                      <td>{purchase.purchasedBy?.name || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Purchases;
