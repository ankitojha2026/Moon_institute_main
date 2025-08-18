import React, { useState, useEffect } from 'react';
import { Calendar, Gift, Users, Cake, PartyPopper } from 'lucide-react';
import { studentAPI } from '../../services/api';

const BirthdayPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
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
      
      setStudents(todayBirthdayStudents);
      setError(null);
    } catch (err) {
      setError('Students fetch karne mein error: ' + err.message);
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getCurrentDateString = () => {
    return currentDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        <span className="ml-3 text-gray-600">Loading birthday students...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Cake className="mr-3 h-10 w-10 text-pink-600" />
          <h1 className="text-4xl font-bold text-gray-900">🎉 Birthday Celebrations 🎉</h1>
          <PartyPopper className="ml-3 h-10 w-10 text-purple-600" />
        </div>
        <p className="text-xl text-gray-600 mb-2">Today's Special Day</p>
        <p className="text-lg font-semibold text-pink-600">{getCurrentDateString()}</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Birthday Students */}
      {students.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center mb-6 shadow-lg">
            <Cake className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Birthdays Today</h3>
          <p className="text-gray-600 mb-4">
            No students have their birthday today. Check back tomorrow!
          </p>
          <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-gray-500">
              💡 Tip: You can view all students in the Students Management section
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Birthday Count */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Gift className="mr-3 h-8 w-8 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {students.length} Student{students.length > 1 ? 's' : ''} Celebrating Today!
              </h2>
            </div>
            <p className="text-gray-600">
              Let's make their day special! 🎂✨
            </p>
          </div>

          {/* Birthday Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded-xl shadow-lg border-2 border-pink-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Birthday Badge */}
                <div className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <Cake className="mr-1 h-4 w-4" />
                      Birthday!
                    </div>
                  </div>
                  
                  {/* Student Photo */}
                  <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-t-xl overflow-hidden">
                    {student.studentPhoto?.url ? (
                      <img
                        src={student.studentPhoto.url}
                        alt={student.studentName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Users className="h-16 w-16 text-pink-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {/* Student Name and Age */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {student.studentName}
                    </h3>
                    <div className="flex items-center justify-center text-pink-600 font-semibold">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>Turning {getAge(student.dateOfBirth)} today!</span>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium w-20">Course:</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {student.course?.courseName || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium w-20">Gender:</span>
                      <span className="capitalize">{student.gender}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium w-20">Cast:</span>
                      <span>{student.cast}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium w-20">School:</span>
                      <span className="truncate">{student.schoolName}</span>
                    </div>
                  </div>

                  {/* Birthday Message */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-center text-gray-700 font-medium">
                      🎂 Happy Birthday, {student.studentName}! 🎂
                    </p>
                    <p className="text-xs text-center text-gray-500 mt-1">
                      May your day be filled with joy and success!
                    </p>
                  </div> 
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default BirthdayPage;
