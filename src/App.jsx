// import { useState } from 'react'
// import {  Routes, Route, Navigate } from "react-router-dom";

// import './App.css'

// import Login from "./pages/Login";
// import AdminDashboard from "./pages/AdminDashboard";
// import BillingDashboard from "./pages/BillingDashboard";
// import PrivateRoute from './component/PrivateRoute';
// import Products from "./pages/Products";
// import Staff from "./pages/Staff";
// import Suppliers from "./pages/Suppliers";
// import Returns from "./pages/Returns";
// import Reports from "./pages/Reports";
// import Billing from './pages/Billing';
// import SalesHistory from "./pages/SalesHistory";


// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>


//   <Routes>
//         <Route path="/" element={<Login />} />
//          <Route element={<PrivateRoute allowedRole="admin" />}></Route>
          

//         {/* Admin portal */}
//         <Route
//           path="/admin"
//           element={<AdminDashboard />}
//         />
//         <Route path="/admin/products" element={<Products />} />
//         <Route path="/admin/staff" element={<Staff />} />
//         <Route path="/admin/suppliers" element={<Suppliers />} />
//         <Route path="/admin/returns" element={<Returns />} />
//         <Route path="/admin/reports" element={<Reports />} />
//         <Route path="/sales-history" element={<SalesHistory />} />

//         {/* Billing portal */}
//         <Route path="/billing" element={<BillingDashboard />} />
//         <Route path="/billing/new" element={<Billing />} />

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>

//     </>
//   )
// }

// export default App




import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import BillingDashboard from "./pages/BillingDashboard";
import PrivateRoute from "./component/PrivateRoute";

import Products from "./pages/Products";
import Staff from "./pages/Staff";
import Suppliers from "./pages/Suppliers";
import Returns from "./pages/Returns";
import Reports from "./pages/Reports";
import Billing from "./pages/Billing";
import SalesHistory from "./pages/SalesHistory";
import Purchases from "./pages/Purchases";
import PurchaseReport from "./pages/PurchaseReport";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Admin pages */}
      <Route
        element={<PrivateRoute allowedRole="admin" />}
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/staff" element={<Staff />} />
        <Route path="/admin/suppliers" element={<Suppliers />} />
        <Route path="/admin/returns" element={<Returns />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/sales-history" element={<SalesHistory />} />
        <Route path="/admin/purchases" element={<Purchases />} />
        <Route
  path="/admin/purchase-report"
  element={<PurchaseReport />}
/>
      </Route>

      {/* Staff pages */}
      <Route
        element={<PrivateRoute allowedRole="staff" />}
      >
        <Route path="/billing" element={<BillingDashboard />} />
        <Route path="/billing/new" element={<Billing />} />
      </Route>

      {/* Unknown route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
