// import axios from "axios";

// const BASE_URL = "https://eposbackend-2026.onrender.com";

// const getAuthConfig = () => ({
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });

// // Add product
// export const addProductApi = (data) =>
//   axios.post(`${BASE_URL}/products`, data, getAuthConfig());

// // Get all products
// export const getProductsApi = () =>
//   axios.get(`${BASE_URL}/products`, getAuthConfig());

// // Update product
// export const updateProductApi = (id, data) =>
//   axios.put(`${BASE_URL}/products/${id}`, data, getAuthConfig());

// // Delete product
// export const deleteProductApi = (id) =>
//   axios.delete(`${BASE_URL}/products/${id}`, getAuthConfig());



import axios from "axios";

const BASE_URL = "https://eposbackend-2026.onrender.com/api";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});


// Login
export const loginApi = (data) =>
  axios.post(`${BASE_URL}/auth/login`, data);

// Signup
export const signupApi = (data) =>
  axios.post(`${BASE_URL}/auth/signup`, data);

// // Create Staff (Admin only)
// export const createStaffApi = (data) =>
//   axios.post(`${BASE_URL}/auth/staff`, data, getAuthConfig());





// Add product
export const addProductApi = (data) =>
  axios.post(`${BASE_URL}/products`, data, getAuthConfig());

// Get all products
export const getProductsApi = () =>
  axios.get(`${BASE_URL}/products`, getAuthConfig());

// Get product by ID
export const getProductByIdApi = (id) =>
  axios.get(`${BASE_URL}/products/${id}`, getAuthConfig());

// Update product
export const updateProductApi = (id, data) =>
  axios.put(`${BASE_URL}/products/${id}`, data, getAuthConfig());

// Delete product
export const deleteProductApi = (id) =>
  axios.delete(`${BASE_URL}/products/${id}`, getAuthConfig());


// Get all purchases (Admin only)
export const getPurchasesApi = () =>
  axios.get(`${BASE_URL}/purchases`, getAuthConfig());

// Create purchase (Admin only)
export const createPurchaseApi = (data) =>
  axios.post(`${BASE_URL}/purchases`, data, getAuthConfig());


// sales realated

// Get all sales (Admin and Staff)
export const getSalesApi = () =>
  axios.get(`${BASE_URL}/sales`, getAuthConfig());

// Get sale by ID (Admin and Staff)
export const getSaleByIdApi = (id) =>
  axios.get(`${BASE_URL}/sales/${id}`, getAuthConfig());

// Create a sale (Admin and Staff)
export const createSaleApi = (data) =>
  axios.post(`${BASE_URL}/sales`, data, getAuthConfig());


// Get all returns (Admin only)
export const getReturnsApi = () =>
  axios.get(`${BASE_URL}/returns`, getAuthConfig());

// Create a return (Admin only)
export const createReturnApi = (data) =>
  axios.post(`${BASE_URL}/returns`, data, getAuthConfig());


// Get all staff (Admin only)
export const getStaffApi = () =>
  axios.get(`${BASE_URL}/staff`, getAuthConfig());

// Create staff (Admin only)
export const createStaffApi = (data) =>
  axios.post(`${BASE_URL}/staff`, data, getAuthConfig());



//supplier
// Get all suppliers (Admin only)
export const getSuppliersApi = () =>
  axios.get(`${BASE_URL}/suppliers`, getAuthConfig());

// Create supplier (Admin only)
export const createSupplierApi = (data) =>
  axios.post(`${BASE_URL}/suppliers`, data, getAuthConfig());

// Update supplier (Admin only)
export const updateSupplierApi = (id, data) =>
  axios.put(`${BASE_URL}/suppliers/${id}`, data, getAuthConfig());

// Delete supplier (Admin only)
export const deleteSupplierApi = (id) =>
  axios.delete(`${BASE_URL}/suppliers/${id}`, getAuthConfig());

