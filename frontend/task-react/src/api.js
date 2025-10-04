const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5121";

export const api = {
  // --- AUTH ---
  async login(credentials) {
    const response = await fetch(`${BASE_URL}/api/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error("Login failed");
    return await response.json(); // returns { token, user }
  },

  async register(userData) {
    const response = await fetch(`${BASE_URL}/api/Auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Registration failed");
    return await response.json();
  },

  // --- TASKS ---
  async getTasks(token) {
    const response = await fetch(`${BASE_URL}/api/Tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return await response.json();
  },

  async createTask(taskData, token) {
    const response = await fetch(`${BASE_URL}/api/Tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return await response.json();
  },

  async updateTask(id, taskData, token) {
    const response = await fetch(`${BASE_URL}/api/Tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("Failed to update task");
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  },

  async deleteTask(id, token) {
    const response = await fetch(`${BASE_URL}/api/Tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete task");
    return { success: true };
  },
};
