import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  BookOpen, 
  FileText, 
  LogOut, 
  Download
} from 'lucide-react';
import { toast } from 'sonner';

const StudentData = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if student is logged in
    const studentToken = localStorage.getItem('studentToken');
    const storedStudentData = localStorage.getItem('studentData');

    if (!studentToken || !storedStudentData) {
      toast.error('Please login to access student data');
      navigate('/student-login');
      return;
    }

    try {
      const student = JSON.parse(storedStudentData);
      setStudentData(student);
    } catch (error) {
      console.error('Error parsing student data:', error);
      toast.error('Error loading student data');
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



  const handleViewPDF = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      toast.error('PDF not available for this course');
    }
  };

  const handleViewResult = (resultUrl) => {
    if (resultUrl) {
      window.open(resultUrl, '_blank');
    } else {
      toast.error('Result not available');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No student data found</p>
          <button 
            onClick={() => navigate('/student-login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{studentData.studentName}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
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
                {/* Student Image */}
                <div className="mb-6">
                  {studentData.studentPhoto?.url ? (
                    <img
                      src={studentData.studentPhoto.url}
                      alt={studentData.studentName}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full mx-auto bg-blue-100 flex items-center justify-center">
                      <User className="w-16 h-16 text-blue-400" />
                    </div>
                  )}
                </div>

                {/* Student Info */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {studentData.studentName}
                </h2>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                    <span className="text-sm">
                      <span className="font-medium">Date of Birth:</span> {formatDate(studentData.dateOfBirth)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="w-4 h-4 mr-3 text-blue-500" />
                    <span className="text-sm">
                      <span className="font-medium">Course:</span> {studentData.course?.courseName || 'Not assigned'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                  Course Information
                </h3>
              </div>

                             {studentData.course ? (
                 <div className="space-y-6">
                   {/* Course Details in Single Row */}
                   <div className="bg-gray-50 rounded-lg p-6">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                         <div className="bg-blue-50 rounded-lg p-4">
                           <h4 className="font-medium text-blue-900 mb-1 text-sm">Course Name</h4>
                           <p className="text-blue-800 font-semibold">{studentData.course.courseName}</p>
                         </div>
                         
                         <div className="bg-green-50 rounded-lg p-4">
                           <h4 className="font-medium text-green-900 mb-1 text-sm">Course Fee</h4>
                           <p className="text-green-800 font-semibold">
                             ₹{studentData.coursePrice?.toLocaleString('en-IN') || 'Not available'}
                           </p>
                         </div>
                       </div>
                       
                                               <div className="flex items-center space-x-3">
                          {studentData.course.coursePdfUrl && (
                            <button
                              onClick={() => handleViewPDF(studentData.course.coursePdfUrl)}
                              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              View PDF
                            </button>
                          )}
                          
                          {studentData.result?.url && (
                            <button
                              onClick={() => handleViewResult(studentData.result.url)}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              View Result
                            </button>
                          )}
                        </div>
                     </div>
                   </div>
                 </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Course Assigned</h4>
                  <p className="text-gray-600">Please contact the administration to get assigned to a course.</p>
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
