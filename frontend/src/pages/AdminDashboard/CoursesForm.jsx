import React, { useState, useEffect } from 'react';
import { BookOpen, DollarSign, Link, Plus, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { courseAPI } from '../../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CoursesForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isEditMode = searchParams.get('edit') === 'true';
  const courseId = searchParams.get('id');
  const [formData, setFormData] = useState({
    courseName: '',
    price: '',
    coursePdfUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load course data if in edit mode
  useEffect(() => {
    if (isEditMode && courseId) {
      loadCourseData();
    }
  }, [isEditMode, courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getById(courseId);
      const course = response.data;
      
      setFormData({
        courseName: course.courseName || '',
        price: course.price?.toString() || '',
        coursePdfUrl: course.coursePdfUrl || ''
      });
    } catch (error) {
      console.error('Error loading course data:', error);
      toast.error('Error loading course data: ' + error.message);
      navigate('/admin/courses-management');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };



  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseName.trim()) newErrors.courseName = 'Course name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.coursePdfUrl.trim()) newErrors.coursePdfUrl = 'Course PDF URL is required';
    
    // Validate URL format
    if (formData.coursePdfUrl && !isValidUrl(formData.coursePdfUrl)) {
      newErrors.coursePdfUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        
        // Prepare data for API
        const courseData = {
          ...formData
        };

        let response;
        if (isEditMode && courseId) {
          // Update existing course
          response = await courseAPI.update(courseId, courseData);
          console.log('Course updated successfully:', response);
          toast.success('Course updated successfully!');
        } else {
          // Create new course
          response = await courseAPI.create(courseData);
          console.log('Course created successfully:', response);
          toast.success('Course data submitted successfully!');
        }
        
        // Navigate back to courses management
        navigate('/admin/courses-management');
      } catch (error) {
        console.error('Error saving course:', error);
        toast.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Course data load ho raha hai...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
        {/* Header with back button */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/admin/courses-management')}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </button>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            {isEditMode ? 'Edit Course' : 'Add New Course'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update the course details below' : 'Fill in the course details below'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 mr-2" />
                Course Name *
              </label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.courseName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter course name"
              />
              {errors.courseName && <p className="text-red-500 text-sm mt-1">{errors.courseName}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 mr-2" />
                Price *
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter course price (e.g., ₹25,000)"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Course PDF URL */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Link className="w-4 h-4 mr-2" />
              Course PDF URL *
            </label>
            <input
              type="url"
              name="coursePdfUrl"
              value={formData.coursePdfUrl}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.coursePdfUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter PDF URL (e.g., https://example.com/course.pdf)"
            />
            {errors.coursePdfUrl && <p className="text-red-500 text-sm mt-1">{errors.coursePdfUrl}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  {isEditMode ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {isEditMode ? 'Update Course' : 'Add Course'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoursesForm;
