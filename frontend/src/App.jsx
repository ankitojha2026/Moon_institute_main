import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Layout
import Layout from './components/Layout';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Courses from './pages/Courses';
import Events from './pages/Events';
import Contact from './pages/Contact';
import StudentLogin from './pages/StudentLogin';
import StudentData from './pages/StudentData';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminRedirect from './pages/AdminRedirect';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes with Header & Footer */}
          <Route path="/" element={<Layout> <Index /></Layout>} />
          <Route path="/about" element={<Layout> <About /></Layout>} />
          <Route path="/courses" element={<Layout> <Courses /></Layout>} />
          <Route path="/events" element={<Layout> <Events /></Layout>} />
          <Route path="/contact" element={<Layout> <Contact /></Layout>} />
          
          {/* Student Routes (No Header/Footer) */}
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-data" element={<StudentData />} />
          
          {/* Admin Routes (No Header/Footer) */}
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route with Header & Footer */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
        
        {/* Toast Notifications */}
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
