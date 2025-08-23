import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  BookOpen, 
  LogOut, 
  Download,
  BookCopy // New icon
} from 'lucide-react';
import { CiLocationArrow1 } from "react-icons/ci";
import { IoCallOutline, IoSchoolOutline } from 'react-icons/io5';
import { FaRegAddressCard } from 'react-icons/fa';
import { toast } from 'sonner';

const StudentData = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentToken = localStorage.getItem('studentToken');
    const storedStudentData = localStorage.getItem('studentData');

    if (!studentToken || !storedStudentData) {
      toast.error('Please login to access the dashboard.');
      navigate('/student-login');
      return;
    }

    try {
      const student = JSON.parse(storedStudentData);
      // Ensure 'enrolledCourses' is an array, even if it's not present
      student.enrolledCourses = student.enrolledCourses || [];
      setStudentData(student);
    } catch (error) {
      console.error('Error parsing student data:', error);
      toast.error('Error loading student data. Please log in again.');
      // Clear potentially corrupted data
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentData');
      navigate('/student-login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    toast.success('Logged out successfully');
    navigate('/student-login');
  };

  const handleViewPDF = (pdfPath) => {
    if (pdfPath) {
      // Assuming the path is relative, construct the full URL
      const pdfUrl = `http://localhost/moon/backend/uploads/course_pdfs/${pdfPath}`;
      window.open(pdfUrl, '_blank');
    } else {
      toast.error('PDF not available for this course.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper to format currency
  const formatPrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return 'N/A';
    return `₹${numPrice.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading...</p></div>;
  }

  if (!studentData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>No data found.</p></div>;
  }

  // --- UPDATED JSX/UI ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{studentData.student_name}</span>
              </span>
              <button onClick={handleLogout} className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Student Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="mb-6">
                  {studentData.studentPhotoUrl ? (
                    <img src={studentData.studentPhotoUrl} alt={studentData.student_name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-100" />
                  ) : (
                    <div className="w-32 h-32 rounded-full mx-auto bg-blue-100 flex items-center justify-center">
                      <User className="w-16 h-16 text-blue-400" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{studentData.student_name}</h2>
                <div className="space-y-3 text-left">
                  {/* Other details */}
                  <div className="flex items-center text-gray-600"><Calendar className="w-4 h-4 mr-3 text-blue-500" /><span className="text-sm"><span className="font-medium">DOB:</span> {formatDate(studentData.date_of_birth)}</span></div>
                  <div className="flex items-center text-gray-600"><FaRegAddressCard className="w-4 h-4 mr-3 text-blue-500" /><span className="text-sm"><span className="font-medium">Aadhar:</span> {studentData.aadhar_card_number}</span></div>
                  <div className="flex items-center text-gray-600"><IoCallOutline className="w-4 h-4 mr-3 text-blue-500" /><span className="text-sm"><span className="font-medium">Mobile:</span> {studentData.mobile_number}</span></div>
                  <div className="flex items-center text-gray-600"><IoSchoolOutline className="w-4 h-4 mr-3 text-blue-500" /><span className="text-sm"><span className="font-medium">School:</span> {studentData.school_name}</span></div>
                  
                  {/* UPDATED: Displaying all course names */}
                  <div className="flex items-start text-gray-600">
                    <BookCopy className="w-4 h-4 mr-3 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      <span className="font-medium">Enrolled Courses:</span> 
                      {studentData.enrolledCourses.length > 0 
                        ? studentData.enrolledCourses.map(course => course.course_name).join(', ') 
                        : 'Not assigned'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Details Card - COMPLETELY UPDATED */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" /> Course Information
                </h3>
              </div>
              
              {studentData.enrolledCourses && studentData.enrolledCourses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Fee</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentData.enrolledCourses.map((course) => (
                        <tr key={course.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{course.course_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{formatPrice(course.price)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleViewPDF(course.course_pdf_path)}
                              disabled={!course.course_pdf_path}
                              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              View PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Courses Enrolled</h4>
                  <p className="text-gray-600">You are not currently enrolled in any courses.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentData;
