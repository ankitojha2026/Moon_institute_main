import React, { useState, useEffect } from 'react';
import { BookOpen, Edit, Trash2, Plus, Search, Filter, DollarSign, ExternalLink } from 'lucide-react';
import { courseAPI } from '../../services/api';
import { toast } from 'sonner';

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrice, setFilterPrice] = useState('all');

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAll();
      setCourses(response.data || []);
      setError(null);
    } catch (err) {
      setError('Courses fetch karne mein error: ' + err.message);
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await courseAPI.delete(courseId);
      toast.success('Course deleted successfully!');
      fetchCourses(); // Refresh the list
    } catch (err) {
      toast.error('Error deleting course: ' + err.message);
      console.error('Error deleting course:', err);
    }
  };

  const handleEdit = (course) => {
    // Navigate to CoursesForm with course data
    window.location.href = `/admin/courses-form?edit=true&id=${course._id}`;
  };

  const handleAddNew = () => {
    window.location.href = '/admin/courses-form';
  };

  const handleViewPdf = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      toast.error('PDF URL not available');
    }
  };

  // Filter and search courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courseName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterPrice === 'all' || 
                         (filterPrice === 'low' && course.price <= 5000) ||
                         (filterPrice === 'medium' && course.price > 5000 && course.price <= 15000) ||
                         (filterPrice === 'high' && course.price > 15000);
    
    return matchesSearch && matchesFilter;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Courses load ho rahe hain...</span>
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
              <BookOpen className="mr-3 h-8 w-8 text-blue-600" />
              Courses Management
            </h1>
            <p className="text-gray-600 mt-2">Manage all your courses here</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Course
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
                placeholder="Search courses by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Prices</option>
              <option value="low">Low (≤ ₹5,000)</option>
              <option value="medium">Medium (₹5,001 - ₹15,000)</option>
                             <option value="high">High (&gt; ₹15,000)</option>
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

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterPrice !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new course.'
            }
          </p>
          {!searchTerm && filterPrice === 'all' && (
            <div className="mt-6">
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add New Course
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Course Header with Price Badge */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {course.courseName}
                  </h3>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {formatPrice(course.price)}
                  </div>
                </div>
                {/* Course Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span className="font-medium">{formatPrice(course.price)}</span>
                  </div>
                  {course.coursePdfUrl && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <button
                        onClick={() => handleViewPdf(course.coursePdfUrl)}
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        View Course PDF
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    title="Edit Course"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    title="Delete Course"
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
      {filteredCourses.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredCourses.length} of {courses.length} courses
            </span>
            <span>
              Total Value: {formatPrice(courses.reduce((sum, course) => sum + course.price, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesManagement;
