
import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const BASE_URL = `${
  import.meta.env.VITE_API_URL || "https://eposbackend-2026.onrender.com"
}/api`;

function PurchaseReport() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in as an admin to view purchase reports.");
        setPurchases([]);
        return;
      }

      const response = await fetch(`${BASE_URL}/purchases`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load purchase report");
      }

      const purchaseList = Array.isArray(data)
        ? data
        : data.purchases || [];

      setPurchases(purchaseList);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Create supplier options from the purchases returned by the API.
  const suppliers = useMemo(() => {
    const supplierMap = new Map();

    purchases.forEach((purchase) => {
      const supplier = purchase.supplier;

      if (supplier && typeof supplier === "object" && supplier._id) {
        supplierMap.set(supplier._id, {
          id: supplier._id,
          name: supplier.name || "Unnamed Supplier",
        });
      }
    });

    return Array.from(supplierMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [purchases]);

  // Apply date, supplier and text search filters.
  const filteredPurchases = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return purchases.filter((purchase) => {
      const purchaseDate = purchase.createdAt
        ? new Date(purchase.createdAt)
        : null;

      if (!purchaseDate || Number.isNaN(purchaseDate.getTime())) {
        return false;
      }

      if (startDate) {
        const start = new Date(`${startDate}T00:00:00`);
        if (purchaseDate < start) return false;
      }

      if (endDate) {
        const end = new Date(`${endDate}T23:59:59.999`);
        if (purchaseDate > end) return false;
      }

      const supplierId =
        purchase.supplier && typeof purchase.supplier === "object"
          ? purchase.supplier._id
          : purchase.supplier;

      if (supplierFilter && supplierId !== supplierFilter) {
        return false;
      }

      if (searchText) {
        const supplierName =
          typeof purchase.supplier === "object"
            ? purchase.supplier?.name || ""
            : "";

        const billNumber = purchase.billNumber || purchase._id || "";

        const productDetails = (purchase.items || [])
          .map((item) => `${item.name || ""} ${item.sku || ""}`)
          .join(" ");

        const searchableText =
          `${billNumber} ${supplierName} ${productDetails}`.toLowerCase();

        if (!searchableText.includes(searchText)) return false;
      }

      return true;
    });
  }, [purchases, startDate, endDate, supplierFilter, search]);

  // Calculate summary cards from the filtered results.
  const totalPurchaseBills = filteredPurchases.length;

  const totalPurchaseAmount = filteredPurchases.reduce(
    (total, purchase) => total + Number(purchase.totalAmount || 0),
    0
  );

  const totalItemsPurchased = filteredPurchases.reduce(
    (total, purchase) =>
      total +
      (purchase.items || []).reduce(
        (itemTotal, item) => itemTotal + Number(item.quantity || 0),
        0
      ),
    0
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSupplierFilter("");
    setSearch("");
  };

  // Escape CSV fields and protect against spreadsheet formula injection.
  const csvCell = (value) => {
    let text = String(value ?? "");

    if (/^[\s]*[=+\-@]/.test(text)) {
      text = `'${text}`;
    }

    return `"${text.replace(/"/g, '""')}"`;
  };

  const exportCSV = () => {
    if (filteredPurchases.length === 0) {
      alert("No purchase records to export.");
      return;
    }

    const rows = [
      [
        "Purchase Date",
        "Purchase ID",
        "Supplier",
        "Product",
        "SKU",
        "Quantity",
        "Purchase Price",
        "Line Total",
        "Purchase Total",
        "Purchased By",
      ],
    ];

    filteredPurchases.forEach((purchase) => {
      const supplierName =
        typeof purchase.supplier === "object"
          ? purchase.supplier?.name || "Unknown Supplier"
          : "Unknown Supplier";

      const purchasedBy =
        typeof purchase.purchasedBy === "object"
          ? purchase.purchasedBy?.name ||
            purchase.purchasedBy?.email ||
            ""
          : "";

      const items = purchase.items || [];

      if (items.length === 0) {
        rows.push([
          formatDate(purchase.createdAt),
          purchase.billNumber || purchase._id,
          supplierName,
          "",
          "",
          0,
          0,
          0,
          purchase.totalAmount || 0,
          purchasedBy,
        ]);
      } else {
        items.forEach((item) => {
          rows.push([
            formatDate(purchase.createdAt),
            purchase.billNumber || purchase._id,
            supplierName,
            item.name || item.product?.name || "",
            item.sku || item.product?.sku || "",
            item.quantity || 0,
            item.purchasePrice || 0,
            item.lineTotal ??
              Number(item.quantity || 0) * Number(item.purchasePrice || 0),
            purchase.totalAmount || 0,
            purchasedBy,
          ]);
        });
      }
    });

    const csvContent =
      "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "pudava-purchase-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100">
      {/* Page heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Purchase Report</h2>
          <p className="text-secondary mb-0">
            Review supplier purchases, stock purchases and purchase expenses.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={fetchPurchases}
            disabled={loading}
          >
            Refresh
          </button>

          <button
            className="btn btn-success"
            onClick={exportCSV}
            disabled={loading || filteredPurchases.length === 0}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-secondary mb-2">Total Purchase Bills</p>
              <h3 className="fw-bold mb-0">{totalPurchaseBills}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-secondary mb-2">Total Purchase Amount</p>
              <h3 className="fw-bold text-success mb-0">
                {formatCurrency(totalPurchaseAmount)}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-secondary mb-2">Total Items Purchased</p>
              <h3 className="fw-bold text-primary mb-0">
                {totalItemsPurchased}
              </h3>
              <small className="text-secondary">
                Total units across filtered purchases
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Filter Purchases</h5>

          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label">Supplier</label>
              <select
                className="form-select"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Purchase ID, supplier, product, SKU"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={resetFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Purchase details */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h5 className="fw-bold mb-0">Purchase History</h5>
            <span className="badge text-bg-secondary">
              {filteredPurchases.length} records
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status" />
              <p className="mt-2 mb-0">Loading purchase report...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger mb-0">
              {error}
              <div className="mt-2">
                <button className="btn btn-sm btn-outline-danger" onClick={fetchPurchases}>
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="alert alert-info mb-0">
              No purchases found for the selected filters.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Date</th>
                    <th>Purchase ID</th>
                    <th>Supplier</th>
                    <th>Products</th>
                    <th>Items</th>
                    <th className="text-end">Purchase Amount</th>
                    <th>Purchased By</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPurchases.map((purchase) => {
                    const supplierName =
                      typeof purchase.supplier === "object"
                        ? purchase.supplier?.name || "Unknown Supplier"
                        : "Unknown Supplier";

                    const purchasedBy =
                      typeof purchase.purchasedBy === "object"
                        ? purchase.purchasedBy?.name ||
                          purchase.purchasedBy?.email ||
                          "-"
                        : "-";

                    const items = purchase.items || [];

                    const itemCount = items.reduce(
                      (sum, item) => sum + Number(item.quantity || 0),
                      0
                    );

                    return (
                      <tr key={purchase._id}>
                        <td className="text-nowrap">
                          {formatDate(purchase.createdAt)}
                        </td>

                        <td>
                          <small className="fw-semibold">
                            {purchase.billNumber || purchase._id}
                          </small>
                        </td>

                        <td>{supplierName}</td>

                        <td style={{ minWidth: "220px" }}>
                          {items.length === 0 ? (
                            "-"
                          ) : (
                            <ul className="mb-0 ps-3">
                              {items.map((item, index) => (
                                <li key={item._id || `${item.sku}-${index}`}>
                                  {item.name || item.product?.name || "Product"}
                                  <small className="text-secondary">
                                    {" "}
                                    ({item.sku || item.product?.sku || "No SKU"})
                                  </small>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>

                        <td className="text-center">{itemCount}</td>

                        <td className="text-end fw-semibold text-success text-nowrap">
                          {formatCurrency(purchase.totalAmount)}
                        </td>

                        <td>{purchasedBy}</td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot>
                  <tr className="table-light fw-bold">
                    <td colSpan="4">Filtered Total</td>
                    <td className="text-center">{totalItemsPurchased}</td>
                    <td className="text-end text-success text-nowrap">
                      {formatCurrency(totalPurchaseAmount)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PurchaseReport;
