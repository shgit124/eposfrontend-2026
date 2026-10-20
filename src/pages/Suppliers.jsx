
import React, { useEffect, useState } from "react";
import axios from "axios";

function Suppliers() {


const API_URL =
  "https://eposbackend-2026.onrender.com/api/suppliers";

  const emptyForm = {
    name: "",
    phone: "",
    email: "",
    address: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, getConfig());

      setSuppliers(
        Array.isArray(response.data)
          ? response.data
          : response.data.suppliers || []
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to load suppliers. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add or update supplier
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Supplier name and phone are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editId) {
        await axios.put(
          `${API_URL}/${editId}`,
          formData,
          getConfig()
        );

        alert("Supplier updated successfully.");
      } else {
        await axios.post(
          API_URL,
          formData,
          getConfig()
        );

        alert("Supplier added successfully.");
      }

      setFormData(emptyForm);
      setEditId(null);

      await fetchSuppliers();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to save supplier."
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit supplier
  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
    });

    setEditId(supplier._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete supplier
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await axios.delete(
        `${API_URL}/${id}`,
        getConfig()
      );

      alert("Supplier deleted successfully.");

      if (editId === id) {
        setEditId(null);
        setFormData(emptyForm);
      }

      await fetchSuppliers();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to delete supplier."
      );
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditId(null);
    setFormData(emptyForm);
  };

  // Search by name, phone or email
  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchText = search.toLowerCase();

    return (
      supplier.name?.toLowerCase().includes(searchText) ||
      supplier.phone?.toLowerCase().includes(searchText) ||
      supplier.email?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100">
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Supplier Management</h2>
        <p className="text-muted mb-0">
          Add and manage your textile suppliers.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Supplier Form */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="fw-bold mb-0">
            {editId ? "Edit Supplier" : "Add New Supplier"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Supplier Name *
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Enter supplier name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Phone Number *
                </label>

                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Address
                </label>

                <textarea
                  className="form-control"
                  name="address"
                  placeholder="Enter supplier address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                />
              </div>

              <div className="col-12 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editId
                    ? "Update Supplier"
                    : "Add Supplier"}
                </button>

                {editId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Supplier List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <h5 className="fw-bold mb-0">
            Suppliers ({filteredSuppliers.length})
          </h5>

          <input
            type="search"
            className="form-control"
            style={{ maxWidth: "320px" }}
            placeholder="Search name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Supplier Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading suppliers...
                  </td>
                </tr>
              ) : filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier, index) => (
                  <tr key={supplier._id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">
                      {supplier.name}
                    </td>
                    <td>{supplier.phone}</td>
                    <td>{supplier.email || "-"}</td>
                    <td>{supplier.address || "-"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(supplier)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDelete(supplier._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-muted py-4"
                  >
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer bg-white text-end">
          <button
            type="button"
            className="btn btn-outline-success btn-sm"
            onClick={fetchSuppliers}
          >
            Refresh Suppliers
          </button>
        </div>
      </div>
    </div>
  );
}

export default Suppliers;
