import axios from "axios";

const BASE_URL = "http://localhost:8000";

const api = axios.create({  // Create an Axios instance with the base URL and default headers points to our port 8000 
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => { // this runs before every API call automatically. it grabs the JWT token from localStorage and adds it to the headers of the request. This way, we don't have to manually add the token to every API call.
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(  //for every response, if the backend returns 401 it automatically clear the stored token and redirects to loign 
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = { // clean grp for each backend endpoint.
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

export const jobService = {
  getJobs: () => api.get("/jobs/"),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post("/jobs/", data),
  updateJob: (id, data) => api.patch(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

export const aiService = {
  generateCoverLetter: (jobId) =>
    api.post(`/ai/cover-letter/${jobId}`),
  chat: (jobId, message) =>
    api.post(`/ai/chat/${jobId}`, { content: message }),
  getChatHistory: (jobId) => api.get(`/ai/chat/${jobId}`),
};

export default api;