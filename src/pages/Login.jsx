
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     setError("");

//     let role = "";

//     // Temporary demo credentials only
//     if (
//       email === "admin@pudava.com" &&
//       password === "demo123"
//     ) {
//       role = "admin";
//     } else if (
//       email === "staff@pudava.com" &&
//       password === "demo123"
//     ) {
//       role = "staff";
//     } else {
//       setError("Invalid email or password");
//       return;
//     }

//     const user = { email, role };

//     localStorage.setItem("user", JSON.stringify(user));

//     if (role === "admin") {
//       navigate("/admin");
//     } else {
//       navigate("/billing");
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center min-vh-100">
//       <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>
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

//           <button className="btn btn-success w-100" type="submit">
//             Login
//           </button>
//         </form>

//         <hr />

//         <small className="text-muted">
//           Demo admin: admin@pudava.com
//           <br />
//           Demo staff: staff@pudava.com
//           <br />
//           Password for both: demo123
//         </small>
//       </div>
//     </div>
//   );
// }

// export default Login;



import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
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
        setError("Invalid user role");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
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
            <p className="text-danger">{error}</p>
          )}

          <button
            className="btn btn-success w-100"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
