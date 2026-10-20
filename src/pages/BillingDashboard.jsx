
import { Link, useNavigate } from "react-router-dom";

function BillingDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-success">Pudava POS</h2>
          <p className="text-muted">Billing Dashboard</p>
        </div>

        <button className="btn btn-outline-danger" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="card shadow-sm border-0 p-4">
        <h4>Welcome, Billing Staff!</h4>
        <p className="text-muted">
          Search products, prepare customer bills and complete checkout.
        </p>

        <Link to="/billing/new" className="btn btn-success mt-2">
          <span className="me-2">+</span> Create New Bill
        </Link>
      </div>
    </div>
  );
}

export default BillingDashboard;
