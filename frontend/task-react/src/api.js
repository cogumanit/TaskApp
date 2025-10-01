const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5121';

export const api = {
  // GET
  async getTasks() {
    try {
      const response = await fetch(`${BASE_URL}/api/Tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to load tasks. Please try again.');
    }
  },

  // CREATE
  async createTask(taskData) {
    try {
      const response = await fetch(`${BASE_URL}/api/Tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task. Please try again.');
    }
  },

  // UPDATE
  async updateTask(id, taskData) {
    try {
      const response = await fetch(`${BASE_URL}/api/Tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task. Please try again.');
    }
  },

  // DELETE
  async deleteTask(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/Tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task. Please try again.');
    }
  },
};
