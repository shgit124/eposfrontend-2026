
import { useEffect, useState } from "react";
import axios from "axios";

function Returns() {
  const [sales, setSales] = useState([]);
  const [returns, setReturns] = useState([]);
  const [selectedSaleId, setSelectedSaleId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const baseURL = "https://eposbackend-2026.onrender.com/api";

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const getId = (value) =>
    typeof value === "object" && value !== null
      ? value._id?.toString()
      : value?.toString();

  const fetchData = async () => {
    try {
      setLoading(true);

      const [salesResponse, returnsResponse] = await Promise.all([
        axios.get(`${baseURL}/sales`, { headers }),
        axios.get(`${baseURL}/returns`, { headers }),
      ]);

      setSales(salesResponse.data.sales || []);
      setReturns(returnsResponse.data.returns || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load return data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedSale = sales.find(
    (sale) => sale._id === selectedSaleId
  );

  const saleItems = selectedSale?.items || [];

  const getAlreadyReturned = (sale, item) => {
    const itemProductId = getId(item.product);

    return returns
      .filter(
        (entry) =>
          getId(entry.sale) === sale._id &&
          getId(entry.product) === itemProductId
      )
      .reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);
  };

  const selectedItem = saleItems.find(
    (item) => getId(item.product) === productId
  );

  const alreadyReturned =
    selectedSale && selectedItem
      ? getAlreadyReturned(selectedSale, selectedItem)
      : 0;

  const remainingQuantity = selectedItem
    ? selectedItem.quantity - alreadyReturned
    : 0;

  const refundAmount = selectedItem
    ? Number(selectedItem.price) * Number(quantity)
    : 0;

  const handleSaleChange = (e) => {
    setSelectedSaleId(e.target.value);
    setProductId("");
    setQuantity(1);
    setMessage("");
  };

  const handleProductChange = (e) => {
    setProductId(e.target.value);
    setQuantity(1);
    setMessage("");
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedSale || !selectedItem) {
      setMessage("Please select a bill and product");
      return;
    }

    if (
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1 ||
      Number(quantity) > remainingQuantity
    ) {
      setMessage("Please enter a valid return quantity");
      return;
    }

    try {
      setSaving(true);

      const response = await axios.post(
        `${baseURL}/returns`,
        {
          billNumber: selectedSale.billNumber,
          productId,
          quantity: Number(quantity),
          reason,
        },
        { headers }
      );

      setMessage(response.data.message);
      setProductId("");
      setQuantity(1);
      setReason("");

      await fetchData();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Return failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));

  const totalRefund = returns.reduce(
    (sum, entry) => sum + Number(entry.refundAmount || 0),
    0
  );

  if (loading) {
    return <div className="container p-5">Loading returns...</div>;
  }

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Product Returns</h2>
          <p className="text-secondary mb-0">
            Process returned products and restore inventory
          </p>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="text-secondary small">Total Refunds Recorded</div>
            <h4 className="text-danger fw-bold mb-0">
              {formatCurrency(totalRefund)}
            </h4>
          </div>
        </div>
      </div>

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Process a Return</h5>

              <form onSubmit={handleReturn}>
                <div className="mb-3">
                  <label className="form-label">Select Bill</label>
                  <select
                    className="form-select"
                    value={selectedSaleId}
                    onChange={handleSaleChange}
                    required
                  >
                    <option value="">Choose bill number</option>
                    {sales.map((sale) => (
                      <option key={sale._id} value={sale._id}>
                        {sale.billNumber} — {new Date(
                          sale.createdAt
                        ).toLocaleDateString("en-IN")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Product</label>
                  <select
                    className="form-select"
                    value={productId}
                    onChange={handleProductChange}
                    required
                    disabled={!selectedSale}
                  >
                    <option value="">Choose product</option>
                    {saleItems.map((item, index) => {
                      const id = getId(item.product);
                      const remaining =
                        item.quantity -
                        getAlreadyReturned(selectedSale, item);

                      return (
                        <option
                          key={`${id}-${index}`}
                          value={id}
                          disabled={remaining <= 0}
                        >
                          {item.name} — {remaining} available to return
                        </option>
                      );
                    })}
                  </select>
                </div>

                {selectedItem && (
                  <div className="alert alert-light border">
                    <div>
                      Original quantity: {selectedItem.quantity}
                    </div>
                    <div>Already returned: {alreadyReturned}</div>
                    <div>Available to return: {remainingQuantity}</div>
                    <div>
                      Unit price: {formatCurrency(selectedItem.price)}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Return Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max={remainingQuantity || 1}
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    disabled={!selectedItem || remainingQuantity <= 0}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Reason</label>
                  <select
                    className="form-select"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="">Select reason (optional)</option>
                    <option value="Wrong size">Wrong size</option>
                    <option value="Defective product">Defective product</option>
                    <option value="Customer changed mind">Customer changed mind</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="border rounded p-3 mb-3">
                  <span className="text-secondary">Refund amount</span>
                  <h4 className="fw-bold mb-0">
                    {formatCurrency(refundAmount)}
                  </h4>
                </div>

                <button
                  type="submit"
                  className="btn btn-danger w-100"
                  disabled={
                    saving ||
                    !selectedItem ||
                    remainingQuantity <= 0 ||
                    Number(quantity) < 1 ||
                    Number(quantity) > remainingQuantity
                  }
                >
                  {saving ? "Processing..." : "Confirm Return"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Return History</h5>

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Bill</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Refund</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {returns.map((entry) => (
                      <tr key={entry._id}>
                        <td>{entry.billNumber}</td>
                        <td>{entry.productName}</td>
                        <td>{entry.quantity}</td>
                        <td className="text-danger fw-semibold">
                          {formatCurrency(entry.refundAmount)}
                        </td>
                        <td>
                          {new Date(entry.createdAt).toLocaleDateString(
                            "en-IN"
                          )}
                        </td>
                      </tr>
                    ))}

                    {returns.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center text-secondary py-4"
                        >
                          No returns recorded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Returns;
