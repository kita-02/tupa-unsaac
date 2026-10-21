const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api` : "/api";

const token = () => localStorage.getItem("token");

async function req(path, { method = "GET", body, formData } = {}) {
  const headers = {};
  if (token()) headers.Authorization = `Bearer ${token()}`;
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API}${path}`, { method, headers, body: formData || (body ? JSON.stringify(body) : undefined) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

export const api = {
  login: (email, password) => req("/auth/login", { method: "POST", body: { email, password } }),
  register: (data) => req("/auth/register", { method: "POST", body: data }),
  procedures: (search) => req(`/procedures${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  procedure: (id) => req(`/procedures/${id}`),
  myRequests: () => req("/requests"),
  request: (id) => req(`/requests/${id}`),
  createRequest: (data) => req("/requests", { method: "POST", body: data }),
  updateStatus: (id, state, observations) => req(`/requests/${id}/status`, { method: "PATCH", body: { state, observations } }),
  uploadDoc: (id, file) => {
    const fd = new FormData();
    fd.append("file", file);
    return req(`/requests/${id}/documents`, { method: "POST", formData: fd });
  },
  notifications: () => req("/notifications"),
  unreadCount: () => req("/notifications/unread/count"),
  readNotification: (id) => req(`/notifications/${id}/read`, { method: "PATCH" }),
  readAll: () => req("/notifications/read-all", { method: "PATCH" }),
  stats: () => req("/reports/stats"),
  adminProcedures: () => req("/procedures/all"),
  createProcedure: (data) => req("/procedures", { method: "POST", body: data }),
  updateProcedure: (id, data) => req(`/procedures/${id}`, { method: "PUT", body: data }),
  deleteProcedure: (id) => req(`/procedures/${id}`, { method: "DELETE" }),
  csvUrl: `${API}/reports/export`,
};
