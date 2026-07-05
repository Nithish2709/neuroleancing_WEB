const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const handle = async (res) => {
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        // Server returned HTML (404 page, proxy error, etc.) — not JSON
        throw new Error(`Server error (${res.status}): unexpected response format`);
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
    return data;
};

const json = { 'Content-Type': 'application/json' };

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginUser    = (body) => fetch(`${BASE}/auth/login`,    { method: 'POST', headers: json, credentials: 'include', body: JSON.stringify(body) }).then(handle);
export const registerUser = (body) => fetch(`${BASE}/auth/register`, { method: 'POST', headers: json, credentials: 'include', body: JSON.stringify(body) }).then(handle);
export const logoutUser   = ()     => fetch(`${BASE}/auth/logout`,   { method: 'POST', credentials: 'include' }).then(handle);
export const getMe        = ()     => fetch(`${BASE}/auth/me`,       { credentials: 'include' }).then(handle);

// ── Users ─────────────────────────────────────────────────────────────────────
export const getProfile     = ()       => fetch(`${BASE}/users/profile`,  { credentials: 'include' }).then(handle);
export const updateProfile  = (body)   => fetch(`${BASE}/users/profile`,  { method: 'PUT', headers: json, credentials: 'include', body: JSON.stringify(body) }).then(handle);
export const getFreelancers = ()       => fetch(`${BASE}/users/freelancers`, { credentials: 'include' }).then(handle);
export const getUserById    = (id)     => fetch(`${BASE}/users/${id}`,    { credentials: 'include' }).then(handle);

// ── Projects ──────────────────────────────────────────────────────────────────
export const getProjects         = ()           => fetch(`${BASE}/projects`,                                    { credentials: 'include' }).then(handle);
export const createProject       = (body)       => fetch(`${BASE}/projects`,                                    { method: 'POST',  headers: json, credentials: 'include', body: JSON.stringify(body) }).then(handle);
export const getProjectById      = (id)         => fetch(`${BASE}/projects/${encodeURIComponent(id)}`,          { credentials: 'include' }).then(handle);
export const updateProject       = (id, body)   => fetch(`${BASE}/projects/${encodeURIComponent(id)}`,          { method: 'PUT',   headers: json, credentials: 'include', body: JSON.stringify(body) }).then(handle);
export const deleteProject       = (id)         => fetch(`${BASE}/projects/${encodeURIComponent(id)}`,          { method: 'DELETE', credentials: 'include' }).then(handle);
export const updateProjectStatus = (id, status) => fetch(`${BASE}/projects/${id}/status`,                       { method: 'PATCH', headers: json, credentials: 'include', body: JSON.stringify({ status }) }).then(handle);
export const submitProposal      = (id, body)   => fetch(`${BASE}/projects/${id}/proposals`,                    { method: 'POST',  headers: json, credentials: 'include', body: JSON.stringify(body) }).then(handle);
export const acceptProposal      = (id, propId) => fetch(`${BASE}/projects/${encodeURIComponent(id)}/proposals/${encodeURIComponent(propId)}/accept`, { method: 'PUT', credentials: 'include' }).then(handle);
export const assignProject       = (id, body)   => fetch(`${BASE}/projects/${encodeURIComponent(id)}/assign`,   { method: 'PUT',   headers: json, credentials: 'include', body: JSON.stringify(body) }).then(handle);

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const getDashboardStats = () => fetch(`${BASE}/dashboard/stats`, { credentials: 'include' }).then(handle);

// ── Messages ──────────────────────────────────────────────────────────────────
export const getInbox        = ()          => fetch(`${BASE}/messages`,       { credentials: 'include' }).then(handle);
export const getConversation = (uid)       => fetch(`${BASE}/messages/${uid}`, { credentials: 'include' }).then(handle);
export const sendMessage     = (uid, body) => fetch(`${BASE}/messages/${uid}`, { method: 'POST', headers: json, credentials: 'include', body: JSON.stringify(body) }).then(handle);
