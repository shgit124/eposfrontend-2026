
import React, { useEffect, useState } from "react";
import axios from "axios";

function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "https://eposbackend-2026.onrender.com"

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${BASE_URL}/api/sales`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSales(
        Array.isArray(response.data)
          ? response.data
          : response.data.sales || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load sales history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const filteredSales = sales.filter((sale) =>
    `${sale.billNumber} ${sale.paymentMethod}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalSales = sales.reduce(
    (sum, sale) => sum + Number(sale.total || 0),
    0
  );

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

          .invoice-print,
          .invoice-print * {
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
          <h2 className="fw-bold">Sales History</h2>
          <p className="text-muted mb-0">
            View previous bills and sales details
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchSales}
        >
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger no-print">{error}</div>}

      <div className="row g-3 mb-4 no-print">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <p className="text-muted mb-1">Total Bills</p>
              <h3 className="fw-bold">{sales.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <p className="text-muted mb-1">Total Sales</p>
              <h3 className="fw-bold text-success">
                ₹{totalSales.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <p className="text-muted mb-1">Today's Bills</p>
              <h3 className="fw-bold">
                {
                  sales.filter(
                    (sale) =>
                      new Date(sale.createdAt).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </h3>
            </div>
          </div>
        </div>
      </div>

      {selectedSale ? (
        <div className="card shadow-sm invoice-print">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-4 no-print">
              <h4>Invoice Details</h4>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedSale(null)}
              >
                Back to Sales
              </button>
            </div>

            <div className="text-center mb-4">
              <h2 className="fw-bold">TEXTILE STORE</h2>
              <p>Sales Invoice</p>
              <h5>{selectedSale.billNumber}</h5>
            </div>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedSale.createdAt).toLocaleString()}
            </p>

            <p>
              <strong>Payment Method:</strong>{" "}
              {selectedSale.paymentMethod}
            </p>

            <p>
              <strong>Sold By:</strong>{" "}
              {selectedSale.soldBy?.name ||
                selectedSale.soldBy?.email ||
                "Staff"}
            </p>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedSale.items?.map((item, index) => (
                    <tr key={item.product || index}>
                      <td>{item.name}</td>
                      <td>{item.sku}</td>
                      <td>₹{Number(item.price).toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td className="text-end">
                        ₹{Number(item.lineTotal).toFixed(2)}
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
                      ₹{Number(selectedSale.total).toFixed(2)}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className="text-center mt-4">
              Thank you for shopping with us!
            </p>

            <div className="text-center no-print">
              <button className="btn btn-dark" onClick={printInvoice}>
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm no-print">
          <div className="card-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search bill number or payment method..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {loading ? (
              <p>Loading sales...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Bill Number</th>
                      <th>Date</th>
                      <th>Payment</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSales.map((sale) => (
                      <tr key={sale._id}>
                        <td className="fw-semibold">
                          {sale.billNumber}
                        </td>
                        <td>
                          {new Date(sale.createdAt).toLocaleString()}
                        </td>
                        <td>{sale.paymentMethod}</td>
                        <td className="fw-semibold">
                          ₹{Number(sale.total).toFixed(2)}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => setSelectedSale(sale)}
                          >
                            View Invoice
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredSales.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No sales found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesHistory;
