
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function Reports() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:3000/api/sales",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSales(response.data.sales || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load reports"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const date = new Date(sale.createdAt);

      if (fromDate && date < new Date(`${fromDate}T00:00:00`)) {
        return false;
      }

      if (toDate && date > new Date(`${toDate}T23:59:59.999`)) {
        return false;
      }

      return true;
    });
  }, [sales, fromDate, toDate]);

  const totalRevenue = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.total || 0),
    0
  );

  const paymentTotals = filteredSales.reduce(
    (totals, sale) => {
      const method = sale.paymentMethod || "Other";
      totals[method] = (totals[method] || 0) + Number(sale.total || 0);
      return totals;
    },
    {}
  );

  const totalItemsSold = filteredSales.reduce(
    (sum, sale) =>
      sum +
      (sale.items || []).reduce(
        (itemSum, item) => itemSum + Number(item.quantity || 0),
        0
      ),
    0
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const exportCSV = () => {
    const headers = [
      "Bill Number",
      "Date",
      "Payment Method",
      "Items",
      "Total",
    ];

    const rows = filteredSales.map((sale) => [
      sale.billNumber,
      new Date(sale.createdAt).toLocaleString("en-IN"),
      sale.paymentMethod,
      (sale.items || []).reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      ),
      sale.total,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "pudava-sales-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Sales Reports</h2>
          <p className="text-secondary mb-0">
            View and analyze your textile shop sales
          </p>
        </div>

        <button
          className="btn btn-success"
          onClick={exportCSV}
          disabled={loading || filteredSales.length === 0}
        >
          Export CSV
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Filter by Date</h5>

          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">Loading reports...</div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-secondary mb-2">Total Revenue</p>
                  <h3 className="fw-bold text-success">
                    {formatCurrency(totalRevenue)}
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-secondary mb-2">Total Bills</p>
                  <h3 className="fw-bold">{filteredSales.length}</h3>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-secondary mb-2">Items Sold</p>
                  <h3 className="fw-bold">{totalItemsSold}</h3>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-secondary mb-2">Average Bill</p>
                  <h3 className="fw-bold">
                    {formatCurrency(
                      filteredSales.length
                        ? totalRevenue / filteredSales.length
                        : 0
                    )}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Payment Summary</h5>

              <div className="row g-3">
                {["Cash", "UPI", "Card"].map((method) => (
                  <div className="col-md-4" key={method}>
                    <div className="border rounded p-3">
                      <p className="text-secondary mb-1">{method}</p>
                      <h5 className="fw-bold mb-0">
                        {formatCurrency(paymentTotals[method] || 0)}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Sales Details</h5>

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Bill No.</th>
                      <th>Date</th>
                      <th>Payment</th>
                      <th>Items</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSales.map((sale) => (
                      <tr key={sale._id}>
                        <td className="fw-semibold">
                          {sale.billNumber}
                        </td>
                        <td>
                          {new Date(sale.createdAt).toLocaleString("en-IN")}
                        </td>
                        <td>{sale.paymentMethod}</td>
                        <td>
                          {(sale.items || []).reduce(
                            (sum, item) =>
                              sum + Number(item.quantity || 0),
                            0
                          )}
                        </td>
                        <td className="text-end fw-semibold">
                          {formatCurrency(Number(sale.total || 0))}
                        </td>
                      </tr>
                    ))}

                    {filteredSales.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center text-secondary py-4"
                        >
                          No sales found for this date range
                        </td>
                      </tr>
                    )}
                  </tbody>

                  {filteredSales.length > 0 && (
                    <tfoot>
                      <tr>
                        <th colSpan="4" className="text-end">
                          Total Revenue
                        </th>
                        <th className="text-end">
                          {formatCurrency(totalRevenue)}
                        </th>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;
