
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const BASE_URL = "http://localhost:3000/api/staff";

  const getStaff = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStaffList(response.data.staff || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load staff"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStaff();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(BASE_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      await getStaff();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to create staff"
      );
    }
  };

  const filteredStaff = staffList.filter((staff) => {
    const text = search.toLowerCase();

    return (
      staff.name?.toLowerCase().includes(text) ||
      staff.email?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Staff Management</h2>
          <p className="text-secondary mb-0">
            Manage your textile shop staff accounts
          </p>
        </div>

        <span className="badge text-bg-success fs-6">
          Total Staff: {staffList.length}
        </span>
      </div>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <div className="row g-4">
        {/* Create Staff Form */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Add New Staff</h5>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Staff Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter staff name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  Create Staff Account
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Staff List */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap justify-content-between gap-3 mb-4">
                <h5 className="fw-bold mb-0">Staff List</h5>

                <input
                  type="search"
                  className="form-control"
                  style={{ maxWidth: "280px" }}
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {loading ? (
                <p className="text-center py-4">Loading staff...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStaff.map((staff, index) => (
                        <tr key={staff._id}>
                          <td>{index + 1}</td>
                          <td className="fw-semibold">
                            {staff.name}
                          </td>
                          <td>{staff.email}</td>
                          <td>
                            <span className="badge text-bg-primary">
                              {staff.role}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {filteredStaff.length === 0 && (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center text-secondary py-4"
                          >
                            No staff found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staff;
