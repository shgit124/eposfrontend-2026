



// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await axios.post(
//         "https://eposbackend-2026.onrender.com/api/auth/login"
      
//         { email, password }
//       );

//       const { token, user } = response.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       if (user.role === "admin") {
//         navigate("/admin");
//       } else if (user.role === "staff") {
//         navigate("/billing");
//       } else {
//         setError("Invalid user role");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Login failed. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center min-vh-100">
//       <div
//         className="card shadow p-4 w-100"
//         style={{ maxWidth: "400px" }}
//       >
//         <h2 className="text-center text-success mb-2">
//           Pudava POS
//         </h2>

//         <p className="text-center text-muted">
//           Textile Shop Billing System
//         </p>

//         <form onSubmit={handleLogin}>
//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {error && (
//             <p className="text-danger">{error}</p>
//           )}

//           <button
//             className="btn btn-success w-100"
//             type="submit"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;

// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         "https://eposbackend-2026.onrender.com/api/auth/login",
//         { email, password }
//       );

//       const { token, user } = response.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       if (user.role === "admin") {
//         navigate("/admin");
//       } else if (user.role === "staff") {
//         navigate("/billing");
//       } else {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setError("Invalid user role");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Login failed. Please check your connection and credentials."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center min-vh-100">
//       <div
//         className="card shadow p-4 w-100"
//         style={{ maxWidth: "400px" }}
//       >
//         <h2 className="text-center text-success mb-2">
//           Pudava POS
//         </h2>

//         <p className="text-center text-muted">
//           Textile Shop Billing System
//         </p>

//         <form onSubmit={handleLogin}>
//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {error && (
//             <p className="text-danger" role="alert">
//               {error}
//             </p>
//           )}

//           <button
//             className="btn btn-success w-100"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login


import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://eposbackend-2026.onrender.com/api/auth/login",
        { email, password }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "staff") {
        navigate("/billing");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("Invalid user role");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your connection and credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow p-4 w-100"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center text-success mb-2">
          Pudava POS
        </h2>

        <p className="text-center text-muted">
          Textile Shop Billing System
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          

          {error && (
            <p className="text-danger" role="alert">
              {error}
            </p>
          )}

          <button
            className="btn btn-success w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

     {/* Demo Login Design */}
{/* Demo Login Details */}
<div className="alert alert-info mb-3">
  <h6 className="fw-bold text-center mb-3">
    Demo Login Credentials
  </h6>

  <div className="border rounded p-2 mb-2 bg-white">
    <h6 className="text-success fw-bold">
      Admin Login
    </h6>
    <p className="mb-1">
      Email: <strong>admin@gmail.com</strong>
    </p>
    <p className="mb-0">
      Password: <strong>Admin@123</strong>
    </p>
  </div>

  <div className="border rounded p-2 bg-white">
    <h6 className="text-primary fw-bold">
      Staff Login
    </h6>
    <p className="mb-1">
      User ID: <strong>staff@pudava.com</strong>
    </p>
    <p className="mb-0">
      Password: <strong>staff123</strong>
    </p>
  </div>
</div>


        </form>
       

        <div>
        
        </div>
      </div>
    </div>
  );
}

export default Login
