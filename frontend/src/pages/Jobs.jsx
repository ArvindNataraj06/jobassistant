import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { jobService } from "../services/api";

const statusColors = {
  saved: { bg: "#1e293b", color: "#60a5fa" },
  applied: { bg: "#1a2e1a", color: "#34d399" },
  interview: { bg: "#2e1a00", color: "#fbbf24" },
  rejected: { bg: "#2e1a1a", color: "#f87171" },
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    company: "", role: "", description: "", status: "saved"
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await jobService.createJob(form);
      setShowModal(false);
      setForm({ company: "", role: "", description: "", status: "saved" });
      fetchJobs();
    } catch (err) {
      console.error("Failed to create job", err);
    } finally {
      setSaving(false);
    }
  };

  const filteredJobs = filter === "all"
    ? jobs
    : jobs.filter((j) => j.status === filter);

  const filters = ["all", "saved", "applied", "interview", "rejected"];

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "#1a1a1a", border: "0.5px solid #2a2a2a",
    borderRadius: "8px", color: "#fff",
    fontSize: "14px", outline: "none",
    boxSizing: "border-box", fontFamily: "-apple-system, sans-serif"
  };

  const labelStyle = {
    display: "block", fontSize: "13px",
    color: "#888", marginBottom: "6px"
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#0f0f0f",
      fontFamily: "-apple-system, sans-serif"
    }}>
      <Sidebar />

      <div style={{ marginLeft: "220px", flex: 1, padding: "32px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: "24px"
        }}>
          <div>
            <h1 style={{
              fontSize: "22px", fontWeight: "600",
              color: "#fff", margin: "0 0 4px"
            }}>
              My Jobs
            </h1>
            <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>
              Manage and track all your applications
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "#a78bfa", border: "none",
              borderRadius: "8px", color: "#fff",
              padding: "9px 16px", fontSize: "13px",
              fontWeight: "500", cursor: "pointer"
            }}
          >
            + Add Job
          </button>
        </div>

        <div style={{
          display: "flex", gap: "6px", marginBottom: "20px"
        }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "0.5px solid",
                fontSize: "12px",
                fontWeight: "500",
                cursor: "pointer",
                textTransform: "capitalize",
                background: filter === f ? "#a78bfa" : "transparent",
                borderColor: filter === f ? "#a78bfa" : "#333",
                color: filter === f ? "#fff" : "#888",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ color: "#555", fontSize: "14px" }}>Loading...</div>
        ) : filteredJobs.length === 0 ? (
          <div style={{
            background: "#141414",
            border: "0.5px dashed #222",
            borderRadius: "10px",
            padding: "40px", textAlign: "center",
            color: "#555", fontSize: "14px"
          }}>
            No jobs with status "{filter}"
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              style={{
                background: "#141414",
                border: "0.5px solid #222",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                cursor: "pointer",
              }}
            >
              <div style={{
                width: "38px", height: "38px",
                borderRadius: "8px", background: "#1e1e1e",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                fontSize: "15px", fontWeight: "600",
                color: "#a78bfa", flexShrink: 0
              }}>
                {job.company[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "14px", fontWeight: "500", color: "#e5e5e5"
                }}>
                  {job.role}
                </div>
                <div style={{
                  fontSize: "12px", color: "#555", marginTop: "2px"
                }}>
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

      {showModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 50
        }}>
          <div style={{
            background: "#141414",
            border: "0.5px solid #222",
            borderRadius: "16px",
            padding: "32px",
            width: "100%", maxWidth: "480px"
          }}>
            <h2 style={{
              fontSize: "18px", fontWeight: "600",
              color: "#fff", margin: "0 0 24px"
            }}>
              Add new job
            </h2>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Company</label>
                <input
                  style={inputStyle}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="SAP, Bosch, Siemens..."
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Role</label>
                <input
                  style={inputStyle}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Junior Frontend Developer"
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Job description</label>
                <textarea
                  style={{ ...inputStyle, height: "100px", resize: "vertical" }}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Paste the job description here..."
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Status</label>
                <select
                  style={inputStyle}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, padding: "10px",
                    background: "transparent",
                    border: "0.5px solid #333",
                    borderRadius: "8px", color: "#888",
                    fontSize: "14px", cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1, padding: "10px",
                    background: saving ? "#7c5cbf" : "#a78bfa",
                    border: "none", borderRadius: "8px",
                    color: "#fff", fontSize: "14px",
                    fontWeight: "500", cursor: saving ? "not-allowed" : "pointer"
                  }}
                >
                  {saving ? "Saving..." : "Save job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;