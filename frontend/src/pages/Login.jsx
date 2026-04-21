import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, sans-serif"
    }}>
      <div style={{
        background: "#141414",
        border: "0.5px solid #222",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            width: "40px", height: "40px",
            background: "#a78bfa22",
            borderRadius: "10px",
            display: "flex", alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px"
          }}>
            <span style={{ fontSize: "20px", color: "#a78bfa" }}>J</span>
          </div>
          <h1 style={{
            fontSize: "22px", fontWeight: "600",
            color: "#fff", margin: "0 0 6px"
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>
            Sign in to your JobAssist account
          </p>
        </div>

        {error && (
          <div style={{
            background: "#2e1a1a",
            border: "0.5px solid #f8717133",
            borderRadius: "8px",
            padding: "10px 14px",
            marginBottom: "20px",
            fontSize: "13px",
            color: "#f87171"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block", fontSize: "13px",
              color: "#888", marginBottom: "6px"
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="arvind@gmail.com"
              required
              style={{
                width: "100%", padding: "10px 14px",
                background: "#1a1a1a", border: "0.5px solid #2a2a2a",
                borderRadius: "8px", color: "#fff",
                fontSize: "14px", outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block", fontSize: "13px",
              color: "#888", marginBottom: "6px"
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%", padding: "10px 14px",
                background: "#1a1a1a", border: "0.5px solid #2a2a2a",
                borderRadius: "8px", color: "#fff",
                fontSize: "14px", outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "11px",
              background: loading ? "#7c5cbf" : "#a78bfa",
              border: "none", borderRadius: "8px",
              color: "#fff", fontSize: "14px",
              fontWeight: "500", cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={{
          textAlign: "center", fontSize: "13px",
          color: "#555", marginTop: "24px"
        }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#a78bfa", textDecoration: "none" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;