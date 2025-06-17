const API_BASE = process.env.REACT_APP_API_URL;

export const fetchClients = async (queryParams) => {
    const response = await fetch(`${API_BASE}/client?${queryParams}`);
    const data = await response.json();
    return data;
};

export const fetchClientsFull = async (queryParams) => {
    const response = await fetch(`${API_BASE}/clientfull?${queryParams}`);
    const data = await response.json();
    return data;
};

export const fetchClientById = async (userId) => {
    const response = await fetch(`${API_BASE}/id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error("Failed to fetch client by ID");
    return response.json();
};

export const fetchClientsByCompanyId = async (queryParams) => {
    const response = await fetch(`${API_BASE}/clientbycompany?${queryParams}`);
    const data = await response.json();
    return data;
};

export const fetchClientsByDate = async (startDate, endDate) => {
    const response = await fetch(`${API_BASE}/datetime`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
    });
    const data = await response.json();
    return data;
};

export const deleteClient = async (userId) => {
    const response = await fetch(`${API_BASE}/delete`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    return data;
};

export const updateClientStatus = async (userId, status, oldStatus) => {
    const response = await fetch(`${API_BASE}/client/id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status, oldStatus }),
    });
    if (!response.ok) throw new Error("Failed to update client status");
    return response.json();
};

