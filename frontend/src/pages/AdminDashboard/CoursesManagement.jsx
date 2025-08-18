import React, { useState, useEffect } from 'react';
import { BookOpen, Edit, Trash2, Plus, Search, ExternalLink } from 'lucide-react';
import { courseAPI } from '../../services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for navigation

const CoursesManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await courseAPI.getAll();
            // PHP returns data in 'records' property
            setCourses(response.records || []);
            console.log('Courses fetched successfully:', response.records);

        } catch (err) {
            toast.error('Courses fetch karne mein error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await courseAPI.delete(courseId);
                toast.success('Course deleted successfully!');
                fetchCourses(); // Refresh the list
            } catch (err) {
                toast.error('Error deleting course: ' + err.message);
            }
        }
    };

    // Use useNavigate for cleaner navigation
    const handleEdit = (courseId) => {
        navigate(`/admin/courses-form?edit=true&id=${courseId}`);
    };

    const handleAddNew = () => {
        navigate('/admin/courses-form');
    };

    const filteredCourses = courses.filter(course =>
        course.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
    };

    // ... (Loading JSX is fine)

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
                <button onClick={handleAddNew} className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center">
                    <Plus className="mr-2 h-5 w-5" /> Add New Course
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text" placeholder="Search courses..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
            </div>
            
            {/* Courses Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PDF</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <tr key={course.id}> {/* Changed from _id to id */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.courseName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(course.price)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {course.coursePdfUrl ? (
                                            <a href={course.coursePdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                <ExternalLink className="h-5 w-5"/>
                                            </a>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(course.id)} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <Edit className="h-5 w-5"/>
                                        </button>
                                        <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="h-5 w-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center py-10">No courses found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CoursesManagement;
