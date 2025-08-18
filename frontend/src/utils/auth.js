// Authentication utility functions

export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      return false;
    }

    const user = JSON.parse(userData);
    
    // Check if user data is valid
    if (!user || !user.loginTime) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return false;
    }

    const tokenExpiry = user.loginTime + (24 * 60 * 60 * 1000); // 1 day
    const currentTime = Date.now();

    if (currentTime > tokenExpiry) {
      // Token expired, clear storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return false;
  }
};

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('adminUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const getToken = () => {
  return localStorage.getItem('adminToken');
};

export const getTokenExpiry = () => {
  try {
    const userData = localStorage.getItem('adminUser');
    if (!userData) return null;

    const user = JSON.parse(userData);
    return user.loginTime + (24 * 60 * 60 * 1000); // 1 day
  } catch (error) {
    console.error('Error getting token expiry:', error);
    return null;
  }
};

export const isTokenExpired = () => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;

  return Date.now() > expiry;
};
