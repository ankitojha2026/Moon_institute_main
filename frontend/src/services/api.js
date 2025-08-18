const API_BASE_URL = 'https://moon-institute-courses-1.onrender.com/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // If there are validation errors, include them in the error message
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map(err => err.msg).join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Student API functions
export const studentAPI = {
  // Create new student
  create: async (studentData) => {
    return apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  // Get all students
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/students?${queryString}`);
  },

  // Get student by ID
  getById: async (id) => {
    return apiRequest(`/students/${id}`);
  },

  // Update student
  update: async (id, studentData) => {
    return apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },

  // Delete student
  delete: async (id) => {
    return apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
  },

  // Student login
  login: async (loginData) => {
    return apiRequest('/students/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  },
};

// Course API functions
export const courseAPI = {
  // Create new course
  create: async (courseData) => {
    return apiRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  // Get all courses
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/courses?${queryString}`);
  },

  // Get course by ID
  getById: async (id) => {
    return apiRequest(`/courses/${id}`);
  },

  // Update course
  update: async (id, courseData) => {
    return apiRequest(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  // Delete course
  delete: async (id) => {
    return apiRequest(`/courses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Event API functions
export const eventAPI = {
  // Create new event
  create: async (eventData) => {
    return apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // Get all events
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/events?${queryString}`);
  },

  // Get upcoming events
  getUpcoming: async (limit = 5) => {
    return apiRequest(`/events/upcoming?limit=${limit}`);
  },

  // Get event by ID
  getById: async (id) => {
    return apiRequest(`/events/${id}`);
  },

  // Update event
  update: async (id, eventData) => {
    return apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  // Delete event
  delete: async (id) => {
    return apiRequest(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// Contact API functions
export const contactAPI = {
  // Submit contact form
  submit: async (contactData) => {
    return apiRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  // Get all contacts (admin)
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/contacts?${queryString}`);
  },

  // Get contact by ID
  getById: async (id) => {
    return apiRequest(`/contacts/${id}`);
  },

  // Update contact status
  update: async (id, contactData) => {
    return apiRequest(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    });
  },

  // Delete contact
  delete: async (id) => {
    return apiRequest(`/contacts/${id}`, {
      method: 'DELETE',
    });
  },

  // Get contact statistics
  getStats: async () => {
    return apiRequest('/contacts/stats/summary');
  },
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/health');
};

export default {
  studentAPI,
  courseAPI,
  eventAPI,
  contactAPI,
  healthCheck,
};
