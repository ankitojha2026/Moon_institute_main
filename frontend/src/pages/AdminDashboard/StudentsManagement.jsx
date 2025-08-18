import React, { useState, useEffect } from 'react';
import { Users, Edit, Trash2, Plus, Search, Filter, Phone, Calendar, BookOpen, Eye, X } from 'lucide-react';
import { studentAPI } from '../../services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const StudentsManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll();
      setStudents(response.data || []);
      setError(null);
    } catch (err) {
      setError('Students fetch karne mein error: ' + err.message);
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    try {
      await studentAPI.delete(studentId);
      toast.success('Student deleted successfully!');
      fetchStudents(); // Refresh the list
    } catch (err) {
      toast.error('Error deleting student: ' + err.message);
      console.error('Error deleting student:', err);
    }
  };

const handleEdit = (student) => {
    // Navigate to StudentForm with student data
    navigate(`/admin/student-form?edit=true&id=${student._id}`);
};

const handleAddNew = () => {
    navigate('/admin/student-form');
};

const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetails(true);
};

const closeDetails = () => {
    setShowDetails(false);
    setSelectedStudent(null);
};

  // Filter and search students
const filteredStudents = students.filter(student => {
    const matchesSearch = 
        student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mobileNumber?.includes(searchTerm) ||
        student.aadharCardNumber?.includes(searchTerm);
    
    const matchesCourseFilter = filterCourse === 'all' || 
                                student.course?._id === filterCourse ||
                                student.course?.courseName === filterCourse;
    
    const matchesGenderFilter = filterGender === 'all' || 
                                student.gender === filterGender;
    
    return matchesSearch && matchesCourseFilter && matchesGenderFilter;
});

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

  // Get unique courses for filter
  const uniqueCourses = [...new Set(students.map(student => student.course?.courseName).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Students load ho rahe hain...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="mr-3 h-8 w-8 text-blue-600" />
              Students Management
            </h1>
            <p className="text-gray-600 mt-2">Manage all your students here</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Student
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, mobile, or Aadhar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterCourse !== 'all' || filterGender !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding a new student.'
            }
          </p>
          {!searchTerm && filterCourse === 'all' && filterGender === 'all' && (
            <div className="mt-6">
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add New Student
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Student Photo */}
              <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                {student.studentPhoto?.url ? (
                  <img
                    src={student.studentPhoto.url}
                    alt={student.studentName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {/* Course Badge */}
                <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-medium">
                  {student.course?.courseName || 'N/A'}
                </div>
              </div>

              <div className="p-6">
                {/* Student Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {student.studentName}
                </h3>

                {/* Student Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="mr-2 h-4 w-4" />
                    <span>{student.mobileNumber}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formatDate(student.dateOfBirth)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span className="font-medium">{formatPrice(student.coursePrice)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="capitalize">{student.gender}</span> • {student.cast}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(student)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(student)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    title="Edit Student"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    title="Delete Student"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredStudents.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredStudents.length} of {students.length} students
            </span>
            <span>
              Total Value: {formatPrice(students.reduce((sum, student) => sum + parseInt(student.coursePrice || 0), 0))}
            </span>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showDetails && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
                <button
                  onClick={closeDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Photo */}
                <div className="md:col-span-2">
                  <div className="flex justify-center">
                    {selectedStudent.studentPhoto?.url ? (
                      <img
                        src={selectedStudent.studentPhoto.url}
                        alt={selectedStudent.studentName}
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedStudent.studentName}</div>
                    <div><span className="font-medium">Father's Name:</span> {selectedStudent.fatherName}</div>
                    <div><span className="font-medium">Gender:</span> <span className="capitalize">{selectedStudent.gender}</span></div>
                    <div><span className="font-medium">Date of Birth:</span> {formatDate(selectedStudent.dateOfBirth)}</div>
                    <div><span className="font-medium">Cast:</span> {selectedStudent.cast}</div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Mobile:</span> {selectedStudent.mobileNumber}</div>
                    <div><span className="font-medium">Aadhar:</span> {selectedStudent.aadharCardNumber}</div>
                    <div><span className="font-medium">School:</span> {selectedStudent.schoolName}</div>
                  </div>
                </div>

                {/* Course Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Course Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Course:</span> {selectedStudent.course?.courseName || 'N/A'}</div>
                    <div><span className="font-medium">Price:</span> {formatPrice(selectedStudent.coursePrice)}</div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Address</h3>
                  <div className="text-sm">
                    <span className="font-medium">Full Address:</span>
                    <p className="mt-1 text-gray-600">{selectedStudent.fullAddress}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => handleEdit(selectedStudent)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  title="Edit Student"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={closeDetails}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsManagement;
