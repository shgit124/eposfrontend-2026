
import React, { useEffect, useState } from "react";
import axios from "axios";

function InventoryAlerts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const LOW_STOCK_LIMIT = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:3000/api/products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        const productList = Array.isArray(data)
          ? data
          : data.products || [];

        setProducts(productList);
      } catch (err) {
        setError("Unable to load inventory. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const outOfStock = products.filter(
    (product) => Number(product.stock) === 0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= LOW_STOCK_LIMIT
  );

  if (loading) {
    return <p>Loading inventory...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="container-fluid mt-4">
      <h4 className="mb-3">Inventory Alerts</h4>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-danger shadow-sm">
            <div className="card-body">
              <h6 className="text-danger">Out of Stock</h6>
              <h2>{outOfStock.length}</h2>
              <p className="mb-0">Products with zero stock</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-warning shadow-sm">
            <div className="card-body">
              <h6 className="text-warning">Low Stock</h6>
              <h2>{lowStock.length}</h2>
              <p className="mb-0">
                Products with 1 to {LOW_STOCK_LIMIT} items
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <strong>Products Requiring Attention</strong>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {products
                .filter(
                  (product) =>
                    Number(product.stock) <= LOW_STOCK_LIMIT
                )
                .sort(
                  (a, b) =>
                    Number(a.stock) - Number(b.stock)
                )
                .map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.stock}</td>
                    <td>
                      {Number(product.stock) === 0 ? (
                        <span className="badge bg-danger">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          Low Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

              {products.filter(
                (product) =>
                  Number(product.stock) <= LOW_STOCK_LIMIT
              ).length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    All products have sufficient stock.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryAlerts;
