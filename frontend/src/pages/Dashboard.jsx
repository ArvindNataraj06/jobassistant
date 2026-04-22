import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { jobService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const statusColors = {
  saved: { bg: "#1e293b", color: "#60a5fa" },
  applied: { bg: "#1a2e1a", color: "#34d399" },
  interview: { bg: "#2e1a00", color: "#fbbf24" },
  rejected: { bg: "#2e1a1a", color: "#f87171" },
};

const Dashboard = () => {

   const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getJobs();
        setJobs(response.data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "applied").length,
    interview: jobs.filter((j) => j.status === "interview").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };

  const recentJobs = jobs.slice(0, 5);

  return (
    <div style={{
  display: "flex", minHeight: "100vh",
  background: theme.bg, // was hardcoded #0f0f0f
  fontFamily: "-apple-system, sans-serif"
}}>
      <Sidebar />

      <div style={{ marginLeft: "220px", flex: 1, padding: "32px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{
            fontSize: "22px", fontWeight: "600",
            color: "#fff", margin: "0 0 4px"
          }}>
            Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>
            Welcome back, {user?.name?.split(" ")[0]}!
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "32px"
        }}>
          {[
            { label: "Total jobs", value: stats.total, color: "#a78bfa" },
            { label: "Applied", value: stats.applied, color: "#34d399" },
            { label: "Interview", value: stats.interview, color: "#fbbf24" },
            { label: "Rejected", value: stats.rejected, color: "#f87171" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "#141414",
              border: "0.5px solid #222",
              borderRadius: "10px",
              padding: "16px"
            }}>
              <div style={{
                fontSize: "28px", fontWeight: "600",
                color: stat.color
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px"
        }}>
          <div style={{
            fontSize: "11px", fontWeight: "500",
            color: "#444", textTransform: "uppercase",
            letterSpacing: "0.08em"
          }}>
            Recent jobs
          </div>
          <button
            onClick={() => navigate("/jobs")}
            style={{
              background: "transparent", border: "none",
              color: "#a78bfa", fontSize: "12px",
              cursor: "pointer"
            }}
          >
            View all →
          </button>
        </div>

        {loading ? (
          <div style={{ color: "#555", fontSize: "14px" }}>Loading...</div>
        ) : jobs.length === 0 ? (
          <div style={{
            background: "#141414",
            border: "0.5px dashed #222",
            borderRadius: "10px",
            padding: "40px",
            textAlign: "center"
          }}>
            <div style={{ color: "#555", fontSize: "14px", marginBottom: "12px" }}>
              No jobs yet
            </div>
            <button
              onClick={() => navigate("/jobs")}
              style={{
                // background: "#a78bfa",
                // border: "none", borderRadius: "8px",
                // color: "#fff", padding: "8px 16px",
                background: theme.cardBg, // was #141414
border: `0.5px solid ${theme.border}`, // was #222
color: theme.text, // for text elements
                fontSize: "13px", cursor: "pointer"
              }}
            >
              Add your first job
            </button>
          </div>
        ) : (
          recentJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              style={{
                background: "#141414",
                border: "0.5px solid #222",
                borderRadius: "10px",
                padding: "14px 16px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                cursor: "pointer",
              }}
            >
              <div style={{
                width: "36px", height: "36px",
                borderRadius: "8px",
                background: "#1e1e1e",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                fontSize: "14px", fontWeight: "600",
                color: "#a78bfa", flexShrink: 0
              }}>
                {job.company[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "13px", fontWeight: "500", color: "#e5e5e5"
                }}>
                  {job.role}
                </div>
                <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>
                  {job.company}
                </div>
              </div>
              <span style={{
                fontSize: "11px", fontWeight: "500",
                padding: "3px 10px", borderRadius: "20px",
                background: statusColors[job.status]?.bg || "#1e1e1e",
                color: statusColors[job.status]?.color || "#888"
              }}>
                {job.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;