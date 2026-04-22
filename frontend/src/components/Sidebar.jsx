import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
          <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
          <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
          <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
        </svg>
      ),
    },
    {
      path: "/jobs",
      label: "My Jobs",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      path: "/profile",
      label: "Profile",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <div style={{
      width: "220px",
      background: theme.sidebarBg,
      borderRight: `0.5px solid ${theme.sidebarBorder}`,
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "fixed",
      left: 0, top: 0,
      fontFamily: "-apple-system, sans-serif",
      transition: "background 0.2s, border-color 0.2s"
    }}>
      <div style={{
        padding: "20px 16px 16px",
        borderBottom: `0.5px solid ${theme.sidebarBorder}`
      }}>
        <div style={{ fontSize: "15px", fontWeight: "600", color: theme.text }}>
          JobAssist
        </div>
        <div style={{ fontSize: "11px", color: theme.textMuted, marginTop: "2px" }}>
          AI-powered job tracker
        </div>
      </div>

      <nav style={{ padding: "12px 8px", flex: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 10px",
                borderRadius: "8px",
                marginBottom: "2px",
                textDecoration: "none",
                background: isActive ? theme.activeNavBg : "transparent",
                color: isActive ? theme.accent : theme.textMuted,
                transition: "background 0.15s",
              }}
            >
              <span style={{ color: isActive ? theme.accent : theme.textMuted }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: "13px",
                fontWeight: isActive ? "500" : "400"
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "12px", borderTop: `0.5px solid ${theme.sidebarBorder}` }}>
        <button
  onClick={theme.toggle}
  title={theme.isDark ? "Switch to light mode" : "Switch to dark mode"}
  style={{
    width: "32px", height: "32px",
    borderRadius: "8px",
    background: "transparent",
    border: `0.5px solid ${theme.border}`,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
    color: theme.textMuted
  }}
>
  {theme.isDark ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )}
</button>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "8px 10px",
            background: "transparent",
            border: `0.5px solid ${theme.border}`,
            borderRadius: "8px",
            color: theme.textMuted,
            fontSize: "12px",
            cursor: "pointer",
            marginBottom: "10px",
            textAlign: "left"
          }}
        >
          Sign out
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px", height: "28px",
            borderRadius: "50%",
            background: "#a78bfa33",
            display: "flex", alignItems: "center",
            justifyContent: "center",
            fontSize: "11px", fontWeight: "600",
            color: theme.accent, flexShrink: 0
          }}>
            {initials}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{
              fontSize: "12px", color: theme.textSecondary,
              whiteSpace: "nowrap", overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {user?.name}
            </div>
            <div style={{
              fontSize: "11px", color: theme.textMuted,
              whiteSpace: "nowrap", overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {user?.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;