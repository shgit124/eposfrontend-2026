
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

function Billing() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [invoice, setInvoice] = useState(null);

  const BASE_URL = "https://eposbackend-2026.onrender.com/api";

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // Get products from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/products`,
        { headers: getHeaders() }
      );

      const data = response.data;
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load products"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search products by name or SKU
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      `${product.name} ${product.sku}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  // Add product to cart
  const addToCart = (product) => {
    setMessage("");

    if (product.stock < 1) {
      setMessage(`${product.name} is out of stock`);
      return;
    }

    setCart((previousCart) => {
      const existing = previousCart.find(
        (item) => item._id === product._id
      );

      if (existing) {
        if (existing.quantity >= product.stock) {
          setMessage("Available stock limit reached");
          return previousCart;
        }

        return previousCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  };

  // Change quantity
  const changeQuantity = (productId, quantity) => {
    const product = products.find((item) => item._id === productId);
    const newQuantity = Number(quantity);

    if (!product || !Number.isInteger(newQuantity) || newQuantity < 1) {
      return;
    }

    if (newQuantity > product.stock) {
      setMessage(`Only ${product.stock} items available`);
      return;
    }

    setMessage("");
    setCart((previousCart) =>
      previousCart.map((item) =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item._id !== productId)
    );
  };

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage("Please add products to the cart");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        `${BASE_URL}/api/sales`,
        {
          items: cart.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          paymentMethod,
        },
        { headers: getHeaders() }
      );

      setInvoice(response.data.sale);
      setCart([]);
      await fetchProducts();
      setMessage("Sale completed successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Checkout failed"
      );
      await fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  // Print invoice
  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="container-fluid py-4">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .invoice-print, .invoice-print * {
            visibility: visible;
          }

          .invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <div>
          <h2 className="fw-bold">Textile POS Billing</h2>
          <p className="text-muted mb-0">
            Search products and create customer bills
          </p>
        </div>
        <span className="badge text-bg-primary fs-6">
          {cart.length} product(s)
        </span>
      </div>

      {message && (
        <div className="alert alert-info no-print">
          {message}
        </div>
      )}

      {invoice && (
        <div className="card shadow-sm mb-4 invoice-print">
          <div className="card-body">
            <div className="text-center mb-4">
              <h2 className="fw-bold">TEXTILE STORE</h2>
              <p className="mb-1">Sales Invoice</p>
              <h5>{invoice.billNumber}</h5>
            </div>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(invoice.createdAt).toLocaleString()}
            </p>

            <p>
              <strong>Payment:</strong> {invoice.paymentMethod}
            </p>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.product || index}>
                      <td>{item.name}</td>
                      <td>{item.sku}</td>
                      <td>₹{item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td className="text-end">
                        ₹{item.lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="4" className="text-end">
                      Grand Total
                    </th>
                    <th className="text-end">
                      ₹{invoice.total.toFixed(2)}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className="text-center mt-4">
              Thank you for shopping with us!
            </p>

            <div className="text-center no-print">
              <button
                className="btn btn-dark me-2"
                onClick={printInvoice}
              >
                Print Receipt
              </button>

              <button
                className="btn btn-outline-primary"
                onClick={() => setInvoice(null)}
              >
                New Bill
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4 no-print">
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Products</h5>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by product name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <strong>{product.name}</strong>
                          <br />
                          <small className="text-muted">
                            {product.sku}
                          </small>
                        </td>
                        <td>₹{Number(product.price).toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            disabled={product.stock < 1}
                            onClick={() => addToCart(product)}
                          >
                            Add
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Shopping Cart</h5>

              {cart.length === 0 ? (
                <p className="text-muted">
                  No products added yet.
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="border-bottom py-3"
                  >
                    <div className="d-flex justify-content-between">
                      <strong>{item.name}</strong>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span>
                        ₹{Number(item.price).toFixed(2)} ×
                      </span>

                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        className="form-control form-control-sm"
                        style={{ width: "85px" }}
                        value={item.quantity}
                        onChange={(e) =>
                          changeQuantity(item._id, e.target.value)
                        }
                      />

                      <strong>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                ))
              )}

              <div className="mt-4">
                <label className="form-label fw-semibold">
                  Payment Method
                </label>

                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <h5>Grand Total</h5>
                <h4 className="text-success fw-bold">
                  ₹{total.toFixed(2)}
                </h4>
              </div>

              <button
                className="btn btn-success w-100 mt-3"
                disabled={loading || cart.length === 0}
                onClick={handleCheckout}
              >
                {loading ? "Processing..." : "Complete Sale"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billing;
