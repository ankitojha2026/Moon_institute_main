import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Calendar,
  Settings,
  BarChart3,
  Menu,
  X,
  Cake,
  LogOut
} from 'lucide-react';
import StudentForm from './StudentForm';
import StudentsManagement from './StudentsManagement';
import CoursesForm from './CoursesForm';
import CoursesManagement from './CoursesManagement';
import EventsForm from './EventsForm';
import EventsManagement from './EventsManagement';
import BirthdayPage from './BirthdayPage';
import StudentEnrolled from './StudentEnrolled';
import { studentAPI } from '../../services/api';
import { toast } from 'sonner';
import { logout } from '../../utils/auth';
import './AdminDashboard.css';
import ResultsManagement from './ResultsManagement';

const Sidebar = ({ isOpen, toggleSidebar, hasBirthdayToday, isCheckingBirthdays }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/student-form', icon: <Users size={20} />, label: 'Student Form' },
    { path: '/admin/students-management', icon: <Users size={20} />, label: 'Students Management' },
    { path: '/admin/student-enrolled', icon: <Users size={20} />, label: 'Student Enrolled' },
    { path: '/admin/courses-management', icon: <BookOpen size={20} />, label: 'Courses Management' },
    { path: '/admin/courses-form', icon: <BookOpen size={20} />, label: 'Add Course' },
    { path: '/admin/events-management', icon: <Calendar size={20} />, label: 'Events Management' },
    { path: '/admin/events-form', icon: <Calendar size={20} />, label: 'Add Event' },
    {path: '/admin/results-management', icon: <BarChart3 size={20} />, label: 'Results Management' },
    {
      path: '/admin/birthday',
      icon: <Cake size={20} />,
      label: 'Birthday Page',
      hasAnimation: hasBirthdayToday
    },
  ];

  const handleLogout = () => {
    // Clear localStorage using utility function
    logout();
    
    toast.success('Logged out successfully');
    
    // Navigate to login page
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className={
                item.hasAnimation || (isCheckingBirthdays && item.path === '/admin/birthday')
                  ? 'cake-enhanced-bounce'
                  : ''
              }>
                {item.icon}
              </div>
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Section - Fixed to Bottom */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [hasBirthdayToday, setHasBirthdayToday] = useState(false);
  const [isCheckingBirthdays, setIsCheckingBirthdays] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Check for birthdays today
  useEffect(() => {
    const checkBirthdays = async () => {
      try {
        setIsCheckingBirthdays(true);
        const response = await studentAPI.getAll();
        const allStudents = response.data || [];

        // Filter students whose birthday is today
        const todayBirthdayStudents = allStudents.filter(student => {
          if (!student.dateOfBirth) return false;

          const birthDate = new Date(student.dateOfBirth);
          const today = new Date();

          // Compare day and month (ignore year)
          return birthDate.getDate() === today.getDate() &&
                 birthDate.getMonth() === today.getMonth();
        });

        setHasBirthdayToday(todayBirthdayStudents.length > 0);
        console.log('Birthday check completed. Students with birthday today:', todayBirthdayStudents.length);
      } catch (error) {
        console.error('Error checking birthdays:', error);
        setHasBirthdayToday(false);
      } finally {
        setIsCheckingBirthdays(false);
      }
    };

    // Check immediately on component mount
    checkBirthdays();

    // Set up interval to check every 5 minutes
    const interval = setInterval(checkBirthdays, 5 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} hasBirthdayToday={hasBirthdayToday} isCheckingBirthdays={isCheckingBirthdays} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <Routes>
              {/* <Route path="/student-form" element={<StudentForm />} /> */}
              <Route path="/student-form" element={<StudentForm />} />
              <Route path="/students-management" element={<StudentsManagement />} /> {/* Added */}
              <Route path="/student-enrolled" element={<StudentEnrolled />} />
              <Route path="/courses-management" element={<CoursesManagement />} />
              <Route path="/courses-form" element={<CoursesForm />} />
              <Route path="/events-management" element={<EventsManagement />} />
              <Route path="/events-form" element={<EventsForm />} />
              <Route path="/results-management" element={<ResultsManagement /> }/>
              <Route path="/birthday" element={<BirthdayPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
