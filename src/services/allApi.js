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
