const API_BASE_URL = '';

const api = {
  async request(endpoint, method = 'GET', data = null, needsAuth = false) {
    const headers = {};

    if (data) {
      headers['Content-Type'] = 'application/json';
    }

    if (needsAuth) {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { method, headers };
    if (data) config.body = JSON.stringify(data);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async uploadFile(endpoint, file, fieldName = 'file', needsAuth = true) {
    const formData = new FormData();
    formData.append(fieldName, file);

    const headers = {};
    if (needsAuth) {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }
};
