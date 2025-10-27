const API_URL = 'http://localhost:5000/api/users';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const userService = {
  // Get all users (READ)
  getUsers: async (page = 1, limit = 10) => {
    const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Create user (CREATE)
  createUser: async (userData) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Update user (UPDATE)
  updateUser: async (id, userData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Delete user (DELETE)
  deleteUser: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};