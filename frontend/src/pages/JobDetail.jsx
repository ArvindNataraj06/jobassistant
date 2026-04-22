import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { jobService, aiService } from "../services/api";

const statusColors = {
  saved: { bg: "#1e293b", color: "#60a5fa" },
  applied: { bg: "#1a2e1a", color: "#34d399" },
  interview: { bg: "#2e1a00", color: "#fbbf24" },
  rejected: { bg: "#2e1a1a", color: "#f87171" },
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [generatingCover, setGeneratingCover] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchJob();
    fetchChatHistory();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchJob = async () => {
    try {
      const response = await jobService.getJob(id);
      setJob(response.data);
    } catch (err) {
      console.error("Failed to fetch job", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await aiService.getChatHistory(id);
      setMessages(response.data);
    } catch (err) {
      console.error("Failed to fetch chat history", err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await jobService.updateJob(id, { status: newStatus });
      setJob({ ...job, status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await jobService.deleteJob(id);
      navigate("/jobs");
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const message = input.trim();
    setInput("");
    setSending(true);
    try {
      const response = await aiService.chat(id, message);
      setMessages((prev) => [
        ...prev,
        response.data.user_message,
        response.data.assistant_message,
      ]);
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setGeneratingCover(true);
    setActiveTab("cover");
    try {
      const response = await aiService.generateCoverLetter(id);
      setCoverLetter(response.data.cover_letter);
    } catch (err) {
      console.error("Failed to generate cover letter", err);
    } finally {
      setGeneratingCover(false);
    }
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    alert("Copied to clipboard!");
  };

  if (loading) return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#0f0f0f", alignItems: "center",
      justifyContent: "center", color: "#555",
      fontFamily: "-apple-system, sans-serif"
    }}>
      Loading...
    </div>
  );

  if (!job) return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#0f0f0f", alignItems: "center",
      justifyContent: "center", color: "#555",
      fontFamily: "-apple-system, sans-serif"
    }}>
      Job not found
    </div>
  );

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#0f0f0f",
      fontFamily: "-apple-system, sans-serif"
    }}>
      <Sidebar />

      <div style={{
        marginLeft: "220px", flex: 1,
        display: "flex", height: "100vh", overflow: "hidden"
      }}>
        <div style={{
          width: "340px", borderRight: "0.5px solid #222",
          padding: "28px 24px", overflowY: "auto",
          flexShrink: 0
        }}>
          <button
            onClick={() => navigate("/jobs")}
            style={{
              background: "transparent", border: "none",
              color: "#555", fontSize: "13px",
              cursor: "pointer", marginBottom: "20px",
              padding: 0
            }}
          >
            ← Back to jobs
          </button>

          <div style={{
            width: "48px", height: "48px",
            borderRadius: "10px", background: "#1e1e1e",
            display: "flex", alignItems: "center",
            justifyContent: "center",
            fontSize: "20px", fontWeight: "600",
            color: "#a78bfa", marginBottom: "14px"
          }}>
            {job.company[0].toUpperCase()}
          </div>

          <h1 style={{
            fontSize: "18px", fontWeight: "600",
            color: "#fff", margin: "0 0 4px"
          }}>
            {job.role}
          </h1>
          <p style={{ fontSize: "14px", color: "#555", margin: "0 0 20px" }}>
            {job.company}
          </p>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              fontSize: "11px", color: "#444",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              display: "block", marginBottom: "8px"
            }}>
              Status
            </label>
            <select
              value={job.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              style={{
                width: "100%", padding: "8px 12px",
                background: statusColors[job.status]?.bg || "#1e1e1e",
                border: "0.5px solid #333",
                borderRadius: "8px",
                color: statusColors[job.status]?.color || "#888",
                fontSize: "13px", fontWeight: "500",
                cursor: "pointer", outline: "none"
              }}
            >
              <option value="saved">Saved</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {job.description && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                fontSize: "11px", color: "#444",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block", marginBottom: "8px"
              }}>
                Job description
              </label>
              <p style={{
                fontSize: "13px", color: "#666",
                lineHeight: "1.6", margin: 0
              }}>
                {job.description}
              </p>
            </div>
          )}

          <button
            onClick={handleGenerateCoverLetter}
            disabled={generatingCover}
            style={{
              width: "100%", padding: "10px",
              background: generatingCover ? "#7c5cbf" : "#a78bfa",
              border: "none", borderRadius: "8px",
              color: "#fff", fontSize: "13px",
              fontWeight: "500", cursor: generatingCover ? "not-allowed" : "pointer",
              marginBottom: "10px"
            }}
          >
            {generatingCover ? "Generating..." : "Generate cover letter"}
          </button>

          <button
            onClick={handleDeleteJob}
            style={{
              width: "100%", padding: "10px",
              background: "transparent",
              border: "0.5px solid #2e1a1a",
              borderRadius: "8px", color: "#f87171",
              fontSize: "13px", cursor: "pointer"
            }}
          >
            Delete job
          </button>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{
            display: "flex", gap: "0",
            borderBottom: "0.5px solid #222",
            padding: "0 24px"
          }}>
            {["chat", "cover"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "16px 20px",
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab
                    ? "2px solid #a78bfa" : "2px solid transparent",
                  color: activeTab === tab ? "#a78bfa" : "#555",
                  fontSize: "13px", fontWeight: "500",
                  cursor: "pointer", textTransform: "capitalize"
                }}
              >
                {tab === "chat" ? "AI Chat" : "Cover Letter"}
              </button>
            ))}
          </div>

          {activeTab === "chat" && (
            <div style={{
              flex: 1, display: "flex",
              flexDirection: "column", overflow: "hidden"
            }}>
              <div style={{
                flex: 1, overflowY: "auto",
                padding: "24px"
              }}>
                {messages.length === 0 ? (
                  <div style={{
                    textAlign: "center", color: "#555",
                    fontSize: "14px", marginTop: "40px"
                  }}>
                    <div style={{
                      width: "40px", height: "40px",
                      background: "#a78bfa22",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                      fontSize: "18px", color: "#a78bfa"
                    }}>
                      AI
                    </div>
                    Ask me anything about this job — interview prep, cover letter tips, salary negotiation!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        justifyContent: msg.role === "user"
                          ? "flex-end" : "flex-start",
                        marginBottom: "12px"
                      }}
                    >
                      <div style={{
                        maxWidth: "70%",
                        padding: "10px 14px",
                        borderRadius: msg.role === "user"
                          ? "12px 12px 2px 12px"
                          : "12px 12px 12px 2px",
                        background: msg.role === "user"
                          ? "#a78bfa" : "#1a1a1a",
                        border: msg.role === "user"
                          ? "none" : "0.5px solid #222",
                        color: "#fff",
                        fontSize: "13px",
                        lineHeight: "1.6"
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                {sending && (
                  <div style={{
                    display: "flex", justifyContent: "flex-start",
                    marginBottom: "12px"
                  }}>
                    <div style={{
                      padding: "10px 14px",
                      borderRadius: "12px 12px 12px 2px",
                      background: "#1a1a1a",
                      border: "0.5px solid #222",
                      color: "#555", fontSize: "13px"
                    }}>
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: "16px 24px",
                  borderTop: "0.5px solid #222",
                  display: "flex", gap: "10px"
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about interview prep, salary, company culture..."
                  style={{
                    flex: 1, padding: "10px 14px",
                    background: "#1a1a1a",
                    border: "0.5px solid #2a2a2a",
                    borderRadius: "8px", color: "#fff",
                    fontSize: "13px", outline: "none",
                    fontFamily: "-apple-system, sans-serif"
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  style={{
                    padding: "10px 18px",
                    background: sending || !input.trim()
                      ? "#333" : "#a78bfa",
                    border: "none", borderRadius: "8px",
                    color: "#fff", fontSize: "13px",
                    fontWeight: "500",
                    cursor: sending || !input.trim()
                      ? "not-allowed" : "pointer"
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {activeTab === "cover" && (
            <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
              {!coverLetter && !generatingCover && (
                <div style={{
                  textAlign: "center", color: "#555",
                  fontSize: "14px", marginTop: "40px"
                }}>
                  Click "Generate cover letter" to create a personalized letter for this role.
                </div>
              )}
              {generatingCover && (
                <div style={{
                  textAlign: "center", color: "#a78bfa",
                  fontSize: "14px", marginTop: "40px"
                }}>
                  Generating your cover letter...
                </div>
              )}
              {coverLetter && (
                <div>
                  <div style={{
                    display: "flex", justifyContent: "flex-end",
                    marginBottom: "16px", gap: "10px"
                  }}>
                    <button
                      onClick={handleCopyLetter}
                      style={{
                        padding: "7px 14px",
                        background: "transparent",
                        border: "0.5px solid #333",
                        borderRadius: "8px", color: "#888",
                        fontSize: "12px", cursor: "pointer"
                      }}
                    >
                      Copy
                    </button>
                    <button
                      onClick={handleGenerateCoverLetter}
                      style={{
                        padding: "7px 14px",
                        background: "#a78bfa",
                        border: "none",
                        borderRadius: "8px", color: "#fff",
                        fontSize: "12px", cursor: "pointer"
                      }}
                    >
                      Regenerate
                    </button>
                  </div>
                  <div style={{
                    background: "#141414",
                    border: "0.5px solid #222",
                    borderRadius: "10px",
                    padding: "24px",
                    fontSize: "14px", color: "#ccc",
                    lineHeight: "1.8",
                    whiteSpace: "pre-wrap"
                  }}>
                    {coverLetter}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;