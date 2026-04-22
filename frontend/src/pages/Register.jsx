import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    background: theme.input,
    border: `0.5px solid ${theme.inputBorder}`,
    borderRadius: "8px", color: theme.text,
    fontSize: "14px", outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      display: "flex",
      fontFamily: "-apple-system, sans-serif",
      transition: "background 0.2s"
    }}>
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px"
      }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "32px"
            }}>
              <div style={{
                width: "36px", height: "36px",
                background: "#a78bfa",
                borderRadius: "10px",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                fontSize: "18px", fontWeight: "700",
                color: "#fff"
              }}>J</div>
              <span style={{
                fontSize: "16px", fontWeight: "600",
                color: theme.text
              }}>JobAssist</span>
            </div>

            <h1 style={{
              fontSize: "26px", fontWeight: "600",
              color: theme.text, margin: "0 0 8px"
            }}>
              Create your account
            </h1>
            <p style={{ fontSize: "14px", color: theme.textMuted, margin: 0 }}>
              Start tracking your job applications for free
            </p>
          </div>

          {error && (
            <div style={{
              background: "#2e1a1a",
              border: "0.5px solid #f8717133",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "20px",
              fontSize: "13px", color: "#f87171"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block", fontSize: "13px",
                color: theme.textMuted, marginBottom: "6px",
                fontWeight: "500"
              }}>
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Arvind Nataraj"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block", fontSize: "13px",
                color: theme.textMuted, marginBottom: "6px",
                fontWeight: "500"
              }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block", fontSize: "13px",
                color: theme.textMuted, marginBottom: "6px",
                fontWeight: "500"
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
              <p style={{
                fontSize: "11px", color: theme.textMuted,
                marginTop: "4px"
              }}>
                At least 8 characters recommended
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                background: loading ? "#7c5cbf" : "#a78bfa",
                border: "none", borderRadius: "8px",
                color: "#fff", fontSize: "14px",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s"
              }}
            >
              {loading ? "Creating account..." : "Create free account"}
            </button>
          </form>

          <div style={{
            display: "flex", alignItems: "center",
            gap: "12px", margin: "24px 0"
          }}>
            <div style={{ flex: 1, height: "0.5px", background: theme.border }} />
            <span style={{ fontSize: "12px", color: theme.textMuted }}>or</span>
            <div style={{ flex: 1, height: "0.5px", background: theme.border }} />
          </div>

          <p style={{
            textAlign: "center", fontSize: "13px",
            color: theme.textMuted, margin: 0
          }}>
            Already have an account?{" "}
            <Link to="/login" style={{
              color: theme.accent, textDecoration: "none",
              fontWeight: "500"
            }}>
              Sign in
            </Link>
          </p>

          <div style={{
            marginTop: "32px",
            display: "flex", justifyContent: "center"
          }}>
            <button
              onClick={theme.toggle}
              style={{
                background: "transparent",
                border: `0.5px solid ${theme.border}`,
                borderRadius: "20px",
                padding: "6px 14px",
                color: theme.textMuted,
                fontSize: "12px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px"
              }}
            >
              {theme.isDark ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
              {theme.isDark ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      </div>

      <div style={{
        flex: 1,
        background: theme.isDark ? "#0a0a1a" : "#f0edff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
        borderLeft: `0.5px solid ${theme.border}`
      }}>
        <div>
          <div style={{
            fontSize: "28px", fontWeight: "600",
            color: theme.text, marginBottom: "16px",
            lineHeight: "1.3"
          }}>
            Your job search, supercharged with AI
          </div>
          <p style={{
            fontSize: "15px", color: theme.textMuted,
            lineHeight: "1.7", marginBottom: "32px"
          }}>
            Join developers using JobAssist to land their dream roles faster.
          </p>

          {[
            "Personalized cover letters in seconds",
            "Track every application in one place",
            "AI interview preparation chat",
            "Built by a developer, for developers",
          ].map((feature) => (
            <div key={feature} style={{
              display: "flex", alignItems: "center",
              gap: "10px", marginBottom: "12px"
            }}>
              <div style={{
                width: "18px", height: "18px",
                borderRadius: "50%",
                background: "#a78bfa22",
                display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0
              }}>
                <div style={{
                  width: "6px", height: "6px",
                  borderRadius: "50%", background: "#a78bfa"
                }} />
              </div>
              <span style={{ fontSize: "14px", color: theme.textSecondary }}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;