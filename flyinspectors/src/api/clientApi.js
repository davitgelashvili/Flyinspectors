import adminFetch from './adminFetch'
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const fetchClients = async (queryParams) => {
    const response = await adminFetch(`${API_BASE}/client?${queryParams}`);
    const data = await response.json();
    return data;
};

export const fetchClientsFull = async (queryParams) => {
    const response = await adminFetch(`${API_BASE}/clientfull?${queryParams}`);
    const data = await response.json();
    return data;
};

export const fetchClientById = async (userId) => {
    const response = await adminFetch(`${API_BASE}/client/${encodeURIComponent(userId)}`);
    if (!response.ok) throw new Error("Failed to fetch client by ID");
    return response.json();
};

export const fetchClientsByCompanyId = async (queryParams) => {
    const response = await adminFetch(`${API_BASE}/clientbycompany?${queryParams}`);
    const data = await response.json();
    return data;
};

export const fetchClientsByDate = async (startDate, endDate) => {
    const response = await adminFetch(`${API_BASE}/datetime`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
    });
    const data = await response.json();
    return data;
};

export const deleteClient = async (userId) => {
    const response = await adminFetch(`${API_BASE}/delete`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    return data;
};

export const updateClientStatus = async (userId, status, oldStatus) => {
    const response = await adminFetch(`${API_BASE}/client/id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status, oldStatus }),
    });
    if (!response.ok) throw new Error("Failed to update client status");
    return response.json();
};

