
// import { Link, useNavigate } from "react-router-dom";

// function AdminDashboard() {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   const menu = [
//     { name: "Products", path: "/admin/products" },
//     { name: "Staff", path: "/admin/staff" },
//     { name: "Suppliers", path: "/admin/suppliers" },
//     { name: "Returns", path: "/admin/returns" },
//     { name: "Sales Reports", path: "/admin/reports" },
//   ];

//   return (
//     <div className="container-fluid p-3 p-md-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h2 className="text-success">Pudava POS</h2>
//           <p className="text-muted mb-0">Admin Dashboard</p>
//         </div>

//         <button className="btn btn-outline-danger" onClick={logout}>
//           Logout
//         </button>
//       </div>

//       <div className="row g-3 mb-4">
//         {[
//           ["Today's Sales", "₹0"],
//           ["Total Products", "0"],
//           ["Total Staff", "0"],
//           ["Today's Bills", "0"],
//         ].map(([title, value]) => (
//           <div className="col-6 col-lg-3" key={title}>
//             <div className="card shadow-sm border-0 p-3 h-100">
//               <p className="text-muted mb-2">{title}</p>
//               <h3 className="text-success">{value}</h3>
//             </div>
//           </div>
//         ))}
//       </div>

//       <h4 className="mb-3">Management</h4>

//       <div className="row g-3">
//         {menu.map((item) => (
//           <div className="col-12 col-sm-6 col-lg-4" key={item.path}>
//             <Link
//               to={item.path}
//               className="card shadow-sm p-4 text-decoration-none text-dark h-100"
//             >
//               <h5>{item.name}</h5>
//               <span className="text-success">Manage →</span>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;



// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// function AdminDashboard() {
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     todaySales: 0,
//     totalProducts: 0,
//     totalStaff: 0,
//     todayBills: 0,
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const BASE_URL = "http://localhost:3000";

//   const menu = [
//     { name: "Products", path: "/admin/products" },
//     { name: "Staff", path: "/admin/staff" },
//     { name: "Suppliers", path: "/admin/suppliers" },
//     { name: "Returns", path: "/admin/returns" },
//     { name: "Sales Reports", path: "/admin/reports" },
//   ];

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const token = localStorage.getItem("token");

//         const headers = {
//           Authorization: `Bearer ${token}`,
//         };

//         // Fetch products and sales
//         const [productsResponse, salesResponse] =
//           await Promise.all([
//             axios.get(`${BASE_URL}/api/products`, { headers }),
//             axios.get(`${BASE_URL}/api/sales`, { headers }),
//           ]);

//         const productsData = productsResponse.data;
//         const salesData = salesResponse.data;

//         const products = Array.isArray(productsData)
//           ? productsData
//           : productsData.products || [];

//         const sales = Array.isArray(salesData)
//           ? salesData
//           : salesData.sales || [];

//         // Calculate today's sales and bills
//         const today = new Date().toDateString();

//         const todaySalesList = sales.filter(
//           (sale) =>
//             new Date(sale.createdAt).toDateString() === today
//         );

//         const todaySales = todaySalesList.reduce(
//           (total, sale) => total + Number(sale.total || 0),
//           0
//         );

//         // Fetch users to calculate staff count
//         // This endpoint must be created in the backend.
//         let totalStaff = 0;

//         try {
//           const usersResponse = await axios.get(
//             `${BASE_URL}/api/users`,
//             { headers }
//           );

//           const usersData = usersResponse.data;
//           const users = Array.isArray(usersData)
//             ? usersData
//             : usersData.users || [];

//           totalStaff = users.filter(
//             (user) => user.role === "staff"
//           ).length;
//         } catch (userError) {
//           console.warn(
//             "Staff count API is not available yet.",
//             userError.response?.data || userError.message
//           );
//         }

//         setStats({
//           todaySales,
//           totalProducts: products.length,
//           totalStaff,
//           todayBills: todaySalesList.length,
//         });
//       } catch (err) {
//         setError(
//           err.response?.data?.message ||
//             "Unable to load dashboard data. Please check your login."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const cards = [
//     {
//       title: "Today's Sales",
//       value: `₹${stats.todaySales.toLocaleString("en-IN", {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       })}`,
//     },
//     {
//       title: "Total Products",
//       value: stats.totalProducts,
//     },
//     {
//       title: "Total Staff",
//       value: stats.totalStaff,
//     },
//     {
//       title: "Today's Bills",
//       value: stats.todayBills,
//     },
//   ];

//   return (
//     <div className="container-fluid p-3 p-md-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h2 className="text-success">Pudava POS</h2>
//           <p className="text-muted mb-0">Admin Dashboard</p>
//         </div>

//         <button
//           className="btn btn-outline-danger"
//           onClick={logout}
//         >
//           Logout
//         </button>
//       </div>

//       {error && (
//         <div className="alert alert-danger">{error}</div>
//       )}

//       <div className="row g-3 mb-4">
//         {cards.map((card) => (
//           <div className="col-6 col-lg-3" key={card.title}>
//             <div className="card shadow-sm border-0 p-3 h-100">
//               <p className="text-muted mb-2">{card.title}</p>
//               <h3 className="text-success">
//                 {loading ? "Loading..." : card.value}
//               </h3>
//             </div>
//           </div>
//         ))}
//       </div>

//       <h4 className="mb-3">Management</h4>

//       <div className="row g-3">
//         {menu.map((item) => (
//           <div
//             className="col-12 col-sm-6 col-lg-4"
//             key={item.path}
//           >
//             <Link
//               to={item.path}
//               className="card shadow-sm p-4 text-decoration-none text-dark h-100"
//             >
//               <h5>{item.name}</h5>
//               <span className="text-success">Manage →</span>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;



// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import InventoryAlerts from "../component/InventoryAlerts";
// import axios from "axios";

// function AdminDashboard() {
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     todaySales: 0,
//     totalProducts: 0,
//     totalStaff: 0,
//     todayBills: 0,
//   });

//   const [recentSales, setRecentSales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const BASE_URL = "http://localhost:3000";

//   const menu = [
//     { name: "Products", path: "/admin/products" },
//     { name: "Staff", path: "/admin/staff" },
//     { name: "Suppliers", path: "/admin/suppliers" },
//     { name: "Returns", path: "/admin/returns" },
//     { name: "Sales History", path: "/sales-history" },
//     { name: "Sales Reports", path: "/admin/reports" },
//   ];

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const token = localStorage.getItem("token");

//         if (!token) {
//           setError("Please login to view the dashboard.");
//           return;
//         }

//         const headers = {
//           Authorization: `Bearer ${token}`,
//         };

//         // Fetch products and sales
//         const [productsResponse, salesResponse] =
//           await Promise.all([
//             axios.get(`${BASE_URL}/api/products`, { headers }),
//             axios.get(`${BASE_URL}/api/sales`, { headers }),
//           ]);

//         const productsData = productsResponse.data;
//         const salesData = salesResponse.data;

//         const products = Array.isArray(productsData)
//           ? productsData
//           : productsData.products || [];

//         const sales = Array.isArray(salesData)
//           ? salesData
//           : salesData.sales || [];

//         // Calculate today's sales and bills
//         const today = new Date().toDateString();

//         const todaySalesList = sales.filter(
//           (sale) =>
//             new Date(sale.createdAt).toDateString() === today
//         );

//         const todaySales = todaySalesList.reduce(
//           (total, sale) => total + Number(sale.total || 0),
//           0
//         );

//         // Latest 5 sales
//         const sortedSales = [...sales].sort(
//           (a, b) =>
//             new Date(b.createdAt) - new Date(a.createdAt)
//         );

//         setRecentSales(sortedSales.slice(0, 5));

//         // Fetch staff count if users API exists
//         let totalStaff = 0;

//         try {
//           const usersResponse = await axios.get(
//             `${BASE_URL}/api/users`,
//             { headers }
//           );

//           const usersData = usersResponse.data;
//           const users = Array.isArray(usersData)
//             ? usersData
//             : usersData.users || [];

//           totalStaff = users.filter(
//             (user) => user.role === "staff"
//           ).length;
//         } catch (staffError) {
//           console.warn(
//             "Staff API is not available yet:",
//             staffError.response?.data || staffError.message
//           );
//         }

//         setStats({
//           todaySales,
//           totalProducts: products.length,
//           totalStaff,
//           todayBills: todaySalesList.length,
//         });
//       } catch (err) {
//         setError(
//           err.response?.data?.message ||
//             "Failed to load dashboard data."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const formatCurrency = (amount) =>
//     `₹${Number(amount).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;

//   const cards = [
//     {
//       title: "Today's Sales",
//       value: formatCurrency(stats.todaySales),
//       icon: "₹",
//       color: "success",
//     },
//     {
//       title: "Total Products",
//       value: stats.totalProducts,
//       icon: "📦",
//       color: "primary",
//     },
//     {
//       title: "Total Staff",
//       value: stats.totalStaff,
//       icon: "👥",
//       color: "info",
//     },
//     {
//       title: "Today's Bills",
//       value: stats.todayBills,
//       icon: "🧾",
//       color: "warning",
//     },
//   ];

//   return (
//     <div className="container-fluid p-3 p-md-4 bg-light min-vh-100">
//       {/* Header */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
//         <div>
//           <h2 className="text-success fw-bold mb-1">
//             Pudava POS
//           </h2>
//           <p className="text-muted mb-0">
//             Admin Dashboard
//           </p>
//         </div>

//         <button
//           className="btn btn-outline-danger"
//           onClick={logout}
//         >
//           Logout
//         </button>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       )}

//       {/* Dashboard Cards */}
//       <div className="row g-3 mb-4">
//         {cards.map((card) => (
//           <div
//             className="col-6 col-lg-3"
//             key={card.title}
//           >
//             <div className="card shadow-sm border-0 h-100">
//               <div className="card-body p-3 p-md-4">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <span className="text-muted">
//                     {card.title}
//                   </span>
//                   <span className="fs-4">
//                     {card.icon}
//                   </span>
//                 </div>

//                 <h3 className={`text-${card.color} fw-bold mb-0`}>
//                   {loading ? "..." : card.value}
//                 </h3>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Management */}
//       <div className="mb-4">
//         <h4 className="fw-bold mb-3">Management</h4>

//            <div className="mb-4">
//         <InventoryAlerts />
//       </div>

//         <div className="row g-3">
//           {menu.map((item) => (
//             <div
//               className="col-12 col-sm-6 col-lg-4"
//               key={item.path}
//             >
//               <Link
//                 to={item.path}
//                 className="card shadow-sm border-0 p-4 text-decoration-none text-dark h-100"
//               >
//                 <h5 className="fw-semibold">
//                   {item.name}
//                 </h5>
//                 <span className="text-success">
//                   Manage →
//                 </span>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Recent Sales History */}
//       <div className="card shadow-sm border-0">
//         <div className="card-body p-3 p-md-4">
//           <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
//             <div>
//               <h4 className="fw-bold mb-1">
//                 Sales History
//               </h4>
//               <p className="text-muted mb-0">
//                 Latest 5 bills
//               </p>
//             </div>

//             <button
//               className="btn btn-outline-success btn-sm"
//               onClick={() => window.location.reload()}
//             >
//               Refresh
//             </button>
//           </div>

//           <div className="table-responsive">
//             <table className="table table-hover align-middle">
//               <thead className="table-light">
//                 <tr>
//                   <th>Bill Number</th>
//                   <th>Date</th>
//                   <th>Payment</th>
//                   <th className="text-end">Amount</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td
//                       colSpan="4"
//                       className="text-center py-4"
//                     >
//                       Loading sales...
//                     </td>
//                   </tr>
//                 ) : recentSales.length > 0 ? (
//                   recentSales.map((sale) => (
//                     <tr key={sale._id}>
//                       <td className="fw-semibold">
//                         {sale.billNumber}
//                       </td>

//                       <td>
//                         {new Date(
//                           sale.createdAt
//                         ).toLocaleString()}
//                       </td>

//                       <td>
//                         <span className="badge text-bg-light border">
//                           {sale.paymentMethod}
//                         </span>
//                       </td>

//                       <td className="text-end fw-semibold">
//                         {formatCurrency(sale.total)}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="4"
//                       className="text-center text-muted py-4"
//                     >
//                       No sales found. Complete a bill to see it here.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="text-end">
//             <Link
//               to="/sales-history"
//               className="btn btn-success btn-sm"
//             >
//               View All Sales →
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;




// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import InventoryAlerts from "../component/InventoryAlerts";

// const BASE_URL = "http://localhost:3000";

// function AdminDashboard() {
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     todaySales: 0,
//     totalProducts: 0,
//     totalStaff: 0,
//     todayBills: 0,
//   });

//   const [recentSales, setRecentSales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const menu = [
//     { name: "Products", path: "/admin/products", icon: "📦" },
//     { name: "Staff", path: "/admin/staff", icon: "👥" },
//     { name: "Suppliers", path: "/admin/suppliers", icon: "🚚" },
//     {
//       name: "Purchase Management",
//       path: "/admin/purchases",
//       icon: "🛒",
//     },
//     { name: "Returns", path: "/admin/returns", icon: "↩️" },
//     { name: "Sales History", path: "/sales-history", icon: "🧾" },
//     { name: "Sales Reports", path: "/admin/reports", icon: "📊" },
//   ];

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const token = localStorage.getItem("token");

//         if (!token) {
//           navigate("/");
//           return;
//         }

//         const headers = {
//           Authorization: `Bearer ${token}`,
//         };

//         const [productsResponse, salesResponse] = await Promise.all([
//           axios.get(`${BASE_URL}/api/products`, { headers }),
//           axios.get(`${BASE_URL}/api/sales`, { headers }),
//         ]);

//         const productsData = productsResponse.data;
//         const salesData = salesResponse.data;

//         const products = Array.isArray(productsData)
//           ? productsData
//           : productsData.products || [];

//         const sales = Array.isArray(salesData)
//           ? salesData
//           : salesData.sales || [];

//         // Calculate today's sales and bill count
//         const today = new Date().toDateString();

//         const todaySalesList = sales.filter(
//           (sale) =>
//             new Date(sale.createdAt).toDateString() === today
//         );

//         const todaySales = todaySalesList.reduce(
//           (total, sale) => total + Number(sale.total || 0),
//           0
//         );

//         // Get latest five sales
//         const sortedSales = [...sales].sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() -
//             new Date(a.createdAt).getTime()
//         );

//         setRecentSales(sortedSales.slice(0, 5));

//         // Get staff count from the existing staff API
//         let totalStaff = 0;

//         try {
//           const staffResponse = await axios.get(
//             `${BASE_URL}/api/staff`,
//             { headers }
//           );

//           const staffData = staffResponse.data;

//           const staff = Array.isArray(staffData)
//             ? staffData
//             : staffData.staff || staffData.users || [];

//           totalStaff = staff.length;
//         } catch (staffError) {
//           console.warn(
//             "Unable to fetch staff count:",
//             staffError.response?.data || staffError.message
//           );
//         }

//         setStats({
//           todaySales,
//           totalProducts: products.length,
//           totalStaff,
//           todayBills: todaySalesList.length,
//         });
//       } catch (err) {
//         setError(
//           err.response?.data?.message ||
//             "Failed to load dashboard data. Please check your login and backend."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [navigate]);

//   const formatCurrency = (amount) =>
//     `₹${Number(amount || 0).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;

//   const cards = [
//     {
//       title: "Today's Sales",
//       value: formatCurrency(stats.todaySales),
//       icon: "₹",
//       color: "success",
//     },
//     {
//       title: "Total Products",
//       value: stats.totalProducts,
//       icon: "📦",
//       color: "primary",
//     },
//     {
//       title: "Total Staff",
//       value: stats.totalStaff,
//       icon: "👥",
//       color: "info",
//     },
//     {
//       title: "Today's Bills",
//       value: stats.todayBills,
//       icon: "🧾",
//       color: "warning",
//     },
//   ];

//   return (
//     <div className="container-fluid p-3 p-md-4 bg-light min-vh-100">
//       {/* Header */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
//         <div>
//           <h2 className="text-success fw-bold mb-1">
//             Pudava POS
//           </h2>
//           <p className="text-muted mb-0">
//             Admin Dashboard
//           </p>
//         </div>

//         <button
//           type="button"
//           className="btn btn-outline-danger"
//           onClick={logout}
//         >
//           Logout
//         </button>
//       </div>

//       {/* Error message */}
//       {error && (
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       )}

//       {/* Dashboard statistics */}
//       <div className="row g-3 mb-4">
//         {cards.map((card) => (
//           <div
//             className="col-6 col-lg-3"
//             key={card.title}
//           >
//             <div className="card shadow-sm border-0 h-100">
//               <div className="card-body p-3 p-md-4">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <span className="text-muted">
//                     {card.title}
//                   </span>
//                   <span className="fs-4">
//                     {card.icon}
//                   </span>
//                 </div>

//                 <h3 className={`text-${card.color} fw-bold mb-0`}>
//                   {loading ? "Loading..." : card.value}
//                 </h3>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Inventory alerts */}
//       <div className="mb-4">
//         <InventoryAlerts />
//       </div>

//       {/* Management menu */}
//       <div className="mb-4">
//         <h4 className="fw-bold mb-3">
//           Management
//         </h4>

//         <div className="row g-3">
//           {menu.map((item) => (
//             <div
//               className="col-12 col-sm-6 col-lg-4"
//               key={item.path}
//             >
//               <Link
//                 to={item.path}
//                 className="card shadow-sm border-0 p-4 text-decoration-none text-dark h-100"
//                 style={{
//                   transition: "transform 0.2s ease",
//                 }}
//               >
//                 <div className="d-flex align-items-center gap-3 mb-3">
//                   <span className="fs-2">
//                     {item.icon}
//                   </span>

//                   <h5 className="fw-semibold mb-0">
//                     {item.name}
//                   </h5>
//                 </div>

//                 <span className="text-success fw-semibold">
//                   Manage →
//                 </span>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Recent sales */}
//       <div className="card shadow-sm border-0">
//         <div className="card-body p-3 p-md-4">
//           <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
//             <div>
//               <h4 className="fw-bold mb-1">
//                 Recent Sales
//               </h4>
//               <p className="text-muted mb-0">
//                 Latest five bills
//               </p>
//             </div>

//             <button
//               type="button"
//               className="btn btn-outline-success btn-sm"
//               onClick={() => window.location.reload()}
//             >
//               Refresh
//             </button>
//           </div>

//           <div className="table-responsive">
//             <table className="table table-hover align-middle">
//               <thead className="table-light">
//                 <tr>
//                   <th>Bill Number</th>
//                   <th>Date</th>
//                   <th>Payment</th>
//                   <th className="text-end">Amount</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="4" className="text-center py-4">
//                       Loading sales...
//                     </td>
//                   </tr>
//                 ) : recentSales.length > 0 ? (
//                   recentSales.map((sale) => (
//                     <tr key={sale._id}>
//                       <td className="fw-semibold">
//                         {sale.billNumber || "-"}
//                       </td>

//                       <td>
//                         {sale.createdAt
//                           ? new Date(sale.createdAt).toLocaleString()
//                           : "-"}
//                       </td>

//                       <td>
//                         <span className="badge text-bg-light border">
//                           {sale.paymentMethod || "-"}
//                         </span>
//                       </td>

//                       <td className="text-end fw-semibold">
//                         {formatCurrency(sale.total)}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="4"
//                       className="text-center text-muted py-4"
//                     >
//                       No sales found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="text-end">
//             <Link
//               to="/sales-history"
//               className="btn btn-success btn-sm"
//             >
//               View All Sales →
//             </Link>


            
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;



import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InventoryAlerts from "../component/InventoryAlerts";

const BASE_URL = "http://localhost:3000";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    todaySales: 0,
    totalProducts: 0,
    totalStaff: 0,
    todayBills: 0,
  });

  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dashboard management menu
  const menu = [
    {
      name: "Products",
      path: "/admin/products",
      icon: "📦",
    },
    {
      name: "Staff",
      path: "/admin/staff",
      icon: "👥",
    },
    {
      name: "Suppliers",
      path: "/admin/suppliers",
      icon: "🚚",
    },
    {
      name: "Purchase Management",
      path: "/admin/purchases",
      icon: "🛒",
    },
    {
      name: "Purchase Reports",
      path: "/admin/purchase-report",
      icon: "📈",
    },
    {
      name: "Returns",
      path: "/admin/returns",
      icon: "↩️",
    },
    {
      name: "Sales History",
      path: "/sales-history",
      icon: "🧾",
    },
    {
      name: "Sales Reports",
      path: "/admin/reports",
      icon: "📊",
    },
  ];

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch products and sales
        const [productsResponse, salesResponse] =
          await Promise.all([
            axios.get(`${BASE_URL}/api/products`, { headers }),
            axios.get(`${BASE_URL}/api/sales`, { headers }),
          ]);

        const productsData = productsResponse.data;
        const salesData = salesResponse.data;

        const products = Array.isArray(productsData)
          ? productsData
          : productsData.products || [];

        const sales = Array.isArray(salesData)
          ? salesData
          : salesData.sales || [];

        // Calculate today's sales and bill count
        const today = new Date().toDateString();

        const todaySalesList = sales.filter(
          (sale) =>
            new Date(sale.createdAt).toDateString() === today
        );

        const todaySales = todaySalesList.reduce(
          (total, sale) =>
            total + Number(sale.total || 0),
          0
        );

        // Get latest five sales
        const sortedSales = [...sales].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setRecentSales(sortedSales.slice(0, 5));

        // Fetch staff count
        let totalStaff = 0;

        try {
          const staffResponse = await axios.get(
            `${BASE_URL}/api/staff`,
            { headers }
          );

          const staffData = staffResponse.data;

          const staff = Array.isArray(staffData)
            ? staffData
            : staffData.staff || staffData.users || [];

          totalStaff = staff.length;
        } catch (staffError) {
          console.warn(
            "Unable to fetch staff count:",
            staffError.response?.data || staffError.message
          );
        }

        setStats({
          todaySales,
          totalProducts: products.length,
          totalStaff,
          todayBills: todaySalesList.length,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data. Please check your login and backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Currency formatter
  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Statistics cards
  const cards = [
    {
      title: "Today's Sales",
      value: formatCurrency(stats.todaySales),
      icon: "₹",
      color: "success",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "primary",
    },
    {
      title: "Total Staff",
      value: stats.totalStaff,
      icon: "👥",
      color: "info",
    },
    {
      title: "Today's Bills",
      value: stats.todayBills,
      icon: "🧾",
      color: "warning",
    },
  ];

  return (
    <div className="container-fluid p-3 p-md-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="text-success fw-bold mb-1">
            Pudava POS
          </h2>
          <p className="text-muted mb-0">
            Admin Dashboard
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Dashboard statistics */}
      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div
            className="col-6 col-lg-3"
            key={card.title}
          >
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">
                    {card.title}
                  </span>

                  <span className="fs-4">
                    {card.icon}
                  </span>
                </div>

                <h3 className={`text-${card.color} fw-bold mb-0`}>
                  {loading ? "Loading..." : card.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory alerts */}
      <div className="mb-4">
        <InventoryAlerts />
      </div>

      {/* Management menu */}
      <div className="mb-4">
        <h4 className="fw-bold mb-3">
          Management
        </h4>

        <div className="row g-3">
          {menu.map((item) => (
            <div
              className="col-12 col-sm-6 col-lg-4"
              key={item.path}
            >
              <Link
                to={item.path}
                className="card shadow-sm border-0 p-4 text-decoration-none text-dark h-100"
                style={{
                  transition: "transform 0.2s ease",
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="fs-2">
                    {item.icon}
                  </span>

                  <h5 className="fw-semibold mb-0">
                    {item.name}
                  </h5>
                </div>

                <span className="text-success fw-semibold">
                  Manage →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent sales */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h4 className="fw-bold mb-1">
                Recent Sales
              </h4>

              <p className="text-muted mb-0">
                Latest five bills
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-success btn-sm"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Bill Number</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-4"
                    >
                      Loading sales...
                    </td>
                  </tr>
                ) : recentSales.length > 0 ? (
                  recentSales.map((sale) => (
                    <tr key={sale._id}>
                      <td className="fw-semibold">
                        {sale.billNumber || "-"}
                      </td>

                      <td>
                        {sale.createdAt
                          ? new Date(
                              sale.createdAt
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td>
                        <span className="badge text-bg-light border">
                          {sale.paymentMethod || "-"}
                        </span>
                      </td>

                      <td className="text-end fw-semibold">
                        {formatCurrency(sale.total)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-muted py-4"
                    >
                      No sales found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="text-end">
            <Link
              to="/sales-history"
              className="btn btn-success btn-sm"
            >
              View All Sales →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

