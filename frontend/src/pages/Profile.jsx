import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { profileService } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    current_role: "",
    skills: "",
    experience: "",
    education: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile();
        const p = response.data;
        setForm({
          current_role: p.current_role || "",
          skills: p.skills || "",
          experience: p.experience || "",
          education: p.education || "",
          bio: p.bio || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileService.updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "#1a1a1a", border: "0.5px solid #2a2a2a",
    borderRadius: "8px", color: "#fff",
    fontSize: "14px", outline: "none",
    boxSizing: "border-box",
    fontFamily: "-apple-system, sans-serif"
  };

  const labelStyle = {
    display: "block", fontSize: "13px",
    color: "#888", marginBottom: "6px"
  };

  const hintStyle = {
    fontSize: "11px", color: "#444",
    marginTop: "4px"
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#0f0f0f",
      fontFamily: "-apple-system, sans-serif"
    }}>
      <Sidebar />

      <div style={{ marginLeft: "220px", flex: 1, padding: "32px", maxWidth: "680px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{
            fontSize: "22px", fontWeight: "600",
            color: "#fff", margin: "0 0 4px"
          }}>
            Profile
          </h1>
          <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>
            Your info is used to personalize AI-generated cover letters
          </p>
        </div>

        <div style={{
          background: "#141414",
          border: "0.5px solid #222",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>
          <div style={{
            width: "48px", height: "48px",
            borderRadius: "50%",
            background: "#a78bfa33",
            display: "flex", alignItems: "center",
            justifyContent: "center",
            fontSize: "18px", fontWeight: "600",
            color: "#a78bfa", flexShrink: 0
          }}>
            {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "500", color: "#fff" }}>
              {user?.name}
            </div>
            <div style={{ fontSize: "13px", color: "#555" }}>
              {user?.email}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ color: "#555", fontSize: "14px" }}>Loading...</div>
        ) : (
          <form onSubmit={handleSave}>
            <div style={{
              background: "#141414",
              border: "0.5px solid #222",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "16px"
            }}>
              <div style={{
                fontSize: "13px", fontWeight: "500",
                color: "#888", marginBottom: "18px",
                textTransform: "uppercase",
                letterSpacing: "0.08em"
              }}>
                Basic info
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Current role</label>
                <input
                  style={inputStyle}
                  value={form.current_role}
                  onChange={(e) => setForm({ ...form, current_role: e.target.value })}
                  placeholder="Master's Student in Applied Computer Science"
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Bio</label>
                <textarea
                  style={{ ...inputStyle, height: "80px", resize: "vertical" }}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Brief summary about yourself..."
                />
              </div>
            </div>

            <div style={{
              background: "#141414",
              border: "0.5px solid #222",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "16px"
            }}>
              <div style={{
                fontSize: "13px", fontWeight: "500",
                color: "#888", marginBottom: "18px",
                textTransform: "uppercase",
                letterSpacing: "0.08em"
              }}>
                Skills & experience
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Skills</label>
                <input
                  style={inputStyle}
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React.js, Python, FastAPI, PostgreSQL, Docker, CI/CD"
                />
                <p style={hintStyle}>Separate skills with commas</p>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Experience</label>
                <textarea
                  style={{ ...inputStyle, height: "120px", resize: "vertical" }}
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="Software Developer Intern at DeepInsightsX Berlin (Sept 2025 - Present) — Built AI-driven frontend web apps using React.js..."
                />
                <p style={hintStyle}>Describe your work experience — the AI uses this to personalize cover letters</p>
              </div>

              <div>
                <label style={labelStyle}>Education</label>
                <textarea
                  style={{ ...inputStyle, height: "80px", resize: "vertical" }}
                  value={form.education}
                  onChange={(e) => setForm({ ...form, education: e.target.value })}
                  placeholder="Master's in Applied Computer Science, SRH University Heidelberg (2024-present)&#10;B.E. in Information Science, Don Bosco Institute of Technology (2019-2023)"
                />
              </div>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "10px 24px",
                  background: saving ? "#7c5cbf" : "#a78bfa",
                  border: "none", borderRadius: "8px",
                  color: "#fff", fontSize: "14px",
                  fontWeight: "500",
                  cursor: saving ? "not-allowed" : "pointer"
                }}
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
              {saved && (
                <span style={{ fontSize: "13px", color: "#34d399" }}>
                  Profile saved!
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;