// 1. API_BASE_URL ko local PHP server par point karein
const API_BASE_URL = 'http://localhost/moon/backend/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      // Default header, FormData ke liye isey override karenge
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // IMPORTANT: Agar body FormData hai, to Content-Type header ko browser ko set karne dein.
  if (config.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
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

// src/services/api.js

// ... (API_BASE_URL aur apiRequest function waise hi rahenge)

// Student API functions
export const studentAPI = {
  // Create new student (Updated to handle the courses array correctly)
  create: async (studentData) => {
    const formData = new FormData();

    // Loop through all keys in studentData
    for (const key in studentData) {
      if (key === 'selectedCourses') {
        // Agar key 'selectedCourses' hai, to array ke har item ko alag se append karo
        // PHP isko $_POST['selectedCourses'] mein ek array ki tarah receive karega
        studentData[key].forEach(courseId => {
          formData.append('selectedCourses[]', courseId);
        });
      } else {
        // Baaki sabhi keys ko waise hi append karo
        formData.append(key, studentData[key]);
      }
    }

    return apiRequest('/students/create.php', {
      method: 'POST',
      body: formData,
    });
  },

  // Get birthday feed
  getBirthdayFeed: async () => {
    return apiRequest('/students/birthday_feed.php');
  },

  // Get all students
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/students/read.php?${queryString}`);
  },

  // Get student by ID
  getById: async (id) => {
    return apiRequest(`/students/read_one.php?id=${id}`);
  },

  // Update student (Updated to handle the courses array correctly)
  update: async (id, studentData) => {
    const formData = new FormData();

    // Loop through all keys in studentData
    for (const key in studentData) {
      if (key === 'selectedCourses') {
        // Agar key 'selectedCourses' hai, to array ke har item ko alag se append karo
        studentData[key].forEach(courseId => {
          formData.append('selectedCourses[]', courseId);
        });
      } else {
        // Baaki sabhi keys ko waise hi append karo
        formData.append(key, studentData[key]);
      }
    }
    
    // Using POST for updates to reliably handle multipart/form-data
    return apiRequest(`/students/update.php?id=${id}`, {
      method: 'POST',
      body: formData,
    });
  },

  // ... (delete and login functions waise hi rahenge)
  delete: async (id) => {
    return apiRequest(`/students/delete.php`, {
      method: 'DELETE',
      body: JSON.stringify({ id: id }),
    });
  },

  login: async (loginData) => {
    return apiRequest('/students/login.php', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  },
};

// ... (baaki saare API objects jaise courseAPI, eventAPI, etc. waise hi rahenge)



// Course API functions
export const courseAPI = {
  // Create new course (Updated for FormData)
  create: async (courseData) => {
    const formData = new FormData();
    for (const key in courseData) {
      formData.append(key, courseData[key]);
    }
    return apiRequest('/courses/create.php', {
      method: 'POST',
      body: formData,
    });
  },

  // Get all courses
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/courses/read.php?${queryString}`);
  },

  // Get course by ID
  getById: async (id) => {
    return apiRequest(`/courses/read_one.php?id=${id}`);
  },

  // Update course (Updated for FormData and POST method)
  update: async (id, courseData) => {
    const formData = new FormData();
     for (const key in courseData) {
      formData.append(key, courseData[key]);
    }
    return apiRequest(`/courses/update.php?id=${id}`, {
      method: 'POST',
      body: formData,
    });
  },

  // Delete course (Updated to send ID in body)
  delete: async (id) => {
    return apiRequest(`/courses/delete.php`, {
      method: 'DELETE',
      body: JSON.stringify({ id: id }),
    });
  },
};

// --- BAAKI APIs KE LIYE PLACEHOLDERS ---
// (Aapko inke liye PHP files banani hongi, fir inko bhi upar diye gaye format mein update karna hoga)

export const eventAPI = {
  // TODO: Update endpoints to match your PHP file structure
  create: async (eventData) => apiRequest('/events/create.php', { method: 'POST', body: JSON.stringify(eventData) }),
  getAll: async () => apiRequest('/events/read.php'),
  // ... and so on for other event actions
};

export const contactAPI = {
  // GET all contacts (with search/filter)
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/contacts/read.php?${queryString}`);
  },

  // GET statistics
  getStats: async () => {
    return apiRequest('/contacts/stats.php');
  },

  // Update a contact's status
  update: async (contactId, updateData) => {
    return apiRequest('/contacts/update.php', {
      method: 'POST', // Using POST for broader compatibility
      body: JSON.stringify({ id: contactId, ...updateData }),
    });
  },

  // Delete a contact
  delete: async (contactId) => {
    return apiRequest('/contacts/delete.php', {
      method: 'DELETE',
      body: JSON.stringify({ id: contactId }),
    });
  },
  
  // Iski zaroorat aapko public contact form mein padegi
  submit: async (contactData) => {
    return apiRequest('/contacts/create.php', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  }
};

export const healthCheck = async () => {
  return apiRequest('/health.php');
};

export default {
  studentAPI,
  courseAPI,
  eventAPI,
  contactAPI,
  healthCheck,
};
