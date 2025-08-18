import { useState, useEffect } from 'react';
import { Cake, Gift, Heart, Loader2 } from 'lucide-react';
import { studentAPI } from '../../services/api';

const BirthdaySection = () => {
  const [birthdayStudents, setBirthdayStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch birthday students
  useEffect(() => {
    const fetchBirthdayStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all students
        const response = await studentAPI.getAll();
        
        if (response.success) {
          const students = response.data;
          
          // Get today's date
          const today = new Date();
          const currentMonth = today.getMonth() + 1; // 1-12
          const currentDay = today.getDate();
          
          // Filter students whose birthday is today
          const todaysBirthdays = students.filter(student => {
            if (!student.dateOfBirth) return false;
            
            const birthDate = new Date(student.dateOfBirth);
            const birthMonth = birthDate.getMonth() + 1; // 1-12
            const birthDay = birthDate.getDate();
            
            return birthMonth === currentMonth && birthDay === currentDay;
          });
          
          setBirthdayStudents(todaysBirthdays);
        } else {
          setError('Failed to fetch students');
        }
      } catch (err) {
        console.error('Error fetching birthday students:', err);
        setError('Failed to load birthday data');
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdayStudents();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || birthdayStudents.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % birthdayStudents.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, birthdayStudents.length]);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format date for display
  const formatBirthday = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    
    const date = new Date(dateOfBirth);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long'
    });
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-pink-100">
              <div className="flex justify-center mb-6">
                <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
              </div>
              <p className="text-lg text-gray-600">Loading birthday celebrations...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-pink-100">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-4 rounded-full">
                  <Cake className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                🎂 Birthday Celebrations at Moon Institute 🎂
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We love celebrating our students' special days! Every birthday is a reminder of the wonderful journey of learning and growth.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">Unable to load birthday data. Please try again later.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default birthday banner when no birthdays today
  if (birthdayStudents.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-pink-100">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-4 rounded-full">
                  <Cake className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                🎂 Birthday Celebrations at Moon Institute 🎂
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                We love celebrating our students' special days! Every birthday is a reminder of the wonderful journey of learning and growth.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="bg-pink-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Gift className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Special Wishes</h3>
                  <p className="text-sm text-gray-600">Personalized birthday messages</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Warm Celebrations</h3>
                  <p className="text-sm text-gray-600">Making every birthday memorable</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Cake className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Sweet Moments</h3>
                  <p className="text-sm text-gray-600">Creating joyful memories</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                <p className="text-gray-700 font-medium">
                  "Every student's birthday is a celebration of their unique journey and potential. 
                  We're proud to be part of their growth story! 🎉"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Birthday celebration for students whose birthday is today
  return (
    <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              🎂 Today's Birthday Stars! 🎂
            </h2>
            <p className="text-lg text-gray-600">
              Let's celebrate our amazing students on their special day!
            </p>
          </div>

          <div className="relative">
            {/* Birthday Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-pink-100 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-200 to-pink-200 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Student Image */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {birthdayStudents[currentIndex].studentPhoto?.url ? (
                        <img 
                          src={birthdayStudents[currentIndex].studentPhoto.url} 
                          alt={birthdayStudents[currentIndex].studentName}
                          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-pink-200 shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 border-4 border-pink-200 shadow-lg flex items-center justify-center">
                          <span className="text-4xl md:text-5xl text-pink-600 font-bold">
                            {birthdayStudents[currentIndex].studentName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold animate-pulse">
                        🎂
                      </div>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        {birthdayStudents[currentIndex].studentName}
                      </h3>
                      <div className="flex items-center justify-center md:justify-start gap-4 text-gray-600">
                        <span className="bg-blue-100 px-3 py-1 rounded-full text-sm font-medium">
                          {birthdayStudents[currentIndex].course?.courseName || 'Course Not Assigned'}
                        </span>
                        <span className="bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                          Age: {calculateAge(birthdayStudents[currentIndex].dateOfBirth)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200">
                      <p className="text-lg text-gray-700 font-medium">
                        "Happy Birthday! May your special day be filled with joy, laughter, and wonderful surprises! 🎉"
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-center md:justify-start gap-2 text-pink-600">
                      <Heart className="w-5 h-5 fill-current" />
                      <span className="font-medium">Happy Birthday from Moon Institute Family!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots indicator */}
            {birthdayStudents.length > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {birthdayStudents.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-pink-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Birthday counter */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              {birthdayStudents.length === 1 
                ? "1 student celebrating their birthday today!" 
                : `${birthdayStudents.length} students celebrating their birthdays today!`
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BirthdaySection;
