import React, { useState, useEffect } from 'react';
import { BookOpen, DollarSign, Upload, Save, ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { courseAPI } from '../../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CoursesForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const isEditMode = searchParams.get('edit') === 'true';
    const courseId = searchParams.get('id');
    
    // State updated to handle a file object for the PDF
    const [formData, setFormData] = useState({
        courseName: '',
        price: '',
        coursePdf: null // Changed from coursePdfUrl to coursePdf (file object)
    });
    
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState('');
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
            const course = await courseAPI.getById(courseId); // PHP returns a direct object
            
            setFormData({
                courseName: course.courseName || '',
                price: course.price?.toString() || '',
                coursePdf: null // File input cannot be pre-filled
            });

            // Set the preview URL for the existing PDF
            if(course.coursePdfUrl) {
                setPdfPreviewUrl(course.coursePdfUrl);
            }

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
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) { setErrors(prev => ({ ...prev, [name]: '' })); }
    };
    
    // New function to handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, coursePdf: file }));
            setPdfPreviewUrl(URL.createObjectURL(file)); // Create a temporary URL for local preview
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.courseName.trim()) newErrors.courseName = 'Course name is required';
        if (!formData.price) newErrors.price = 'Price is required';
        // Validate if a new file is added when creating
        if (!isEditMode && !formData.coursePdf) {
            newErrors.coursePdf = 'A course PDF file is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                setLoading(true);
                
                // Directly pass the formData state. The api.js will handle it.
                if (isEditMode && courseId) {
                    await courseAPI.update(courseId, formData);
                    toast.success('Course updated successfully!');
                } else {
                    await courseAPI.create(formData);
                    toast.success('Course created successfully!');
                }
                
                navigate('/admin/courses-management');
            } catch (error) {
                console.error('Error saving course:', error);
                toast.error(`Error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    // ... (Loading spinner JSX is fine)

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Course' : 'Add New Course'}</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Course Name & Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Course Name Input */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <BookOpen className="w-4 h-4 mr-2" /> Course Name *
                            </label>
                            <input
                                type="text" name="courseName" value={formData.courseName}
                                onChange={handleInputChange} placeholder="Enter course name"
                                className={`w-full px-3 py-2 border rounded-lg ${errors.courseName ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.courseName && <p className="text-red-500 text-sm mt-1">{errors.courseName}</p>}
                        </div>
                        {/* Price Input */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="w-4 h-4 mr-2" /> Price *
                            </label>
                            <input
                                type="number" name="price" value={formData.price}
                                onChange={handleInputChange} placeholder="Enter course price"
                                className={`w-full px-3 py-2 border rounded-lg ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>
                    </div>

                    {/* Course PDF File Upload */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Upload className="w-4 h-4 mr-2" /> Course PDF *
                        </label>
                        <input
                            type="file" name="coursePdf"
                            onChange={handleFileChange} accept=".pdf"
                            className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${errors.coursePdf ? 'border-red-500' : ''}`}
                        />
                        {errors.coursePdf && <p className="text-red-500 text-sm mt-1">{errors.coursePdf}</p>}
                        {pdfPreviewUrl && (
                            <div className="mt-2">
                                <a href={pdfPreviewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                    <ExternalLink className="w-4 h-4 mr-1"/>
                                    {isEditMode ? "View Current PDF" : "Preview Selected PDF"}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button type="submit" disabled={loading} className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg flex items-center">
                             {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                             {isEditMode ? 'Update Course' : 'Add Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CoursesForm;
