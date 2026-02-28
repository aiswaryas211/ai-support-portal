import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { roleRedirect } from "../utils/roleRedirect";
import { useState } from "react";
import "../styles/login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      roleRedirect(res.data.user.role, navigate);
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      {/* BACK TO HOME */}
      <Link to="/" className="back-home">
        ← Back to Home
      </Link>

      <div className="login-card modern">
        <h1 className="login-heading">Welcome...</h1>
        <p className="login-subtitle">Please enter your details</p>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <label>Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />

          {/* PASSWORD */}
          <label>Password</label>
          <div className="password-field">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </span>
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        {/* REGISTER CTA */}
        <p className="register-text">
          New account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;