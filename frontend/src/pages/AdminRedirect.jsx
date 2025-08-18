import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const AdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      try {
        if (isAuthenticated()) {
          // User is authenticated, redirect to student form
          navigate('/admin/student-form', { replace: true });
        } else {
          // User is not authenticated, redirect to login
          navigate('/admin/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // On error, redirect to login
        navigate('/admin/login', { replace: true });
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    </div>
  );
};

export default AdminRedirect;
