import React, { useState, useEffect } from 'react';
import { Users, Edit, Trash2, Plus, Search, Filter, Phone, Calendar, BookOpen, Eye, X } from 'lucide-react';
import { studentAPI } from '../../services/api'; // api.js updated honi chahiye
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
            // PHP API returns data in 'records' property
            setStudents(response.records || []);
            setError(null);
        } catch (err) {
            setError('Students fetch karne mein error: ' + err.message);
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (studentId) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                // Pass the correct ID to the delete function
                await studentAPI.delete(studentId);
                toast.success('Student deleted successfully!');
                fetchStudents(); // Refresh the list
            } catch (err) {
                toast.error('Error deleting student: ' + err.message);
                console.error('Error deleting student:', err);
            }
        }
    };

    const handleEdit = (studentId) => {
        // Navigate with the correct ID
        navigate(`/admin/student-form?edit=true&id=${studentId}`);
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

    // Filter and search students (Updated for PHP data structure)
    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.mobileNumber?.includes(searchTerm);
        
        // The `course` field from PHP is a simple string
        const matchesCourseFilter = filterCourse === 'all' || student.course === filterCourse;
        
        const matchesGenderFilter = filterGender === 'all' || student.gender === filterGender;
        
        return matchesSearch && matchesCourseFilter && matchesGenderFilter;
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };
    
    // Get unique courses for the filter dropdown
    const uniqueCourses = [...new Set(students.map(student => student.course).filter(Boolean))];

    // ... (Loading JSX is fine)
    
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Users className="mr-3 h-8 w-8 text-blue-600" />
                        Students Management
                    </h1>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center"
                >
                    <Plus className="mr-2 h-5 w-5" /> Add New Student
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text" placeholder="Search by name or mobile..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                        value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="all">All Courses</option>
                        {uniqueCourses.map(course => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>
                    <select
                        value={filterGender} onChange={(e) => setFilterGender(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="all">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* Error Message */}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">{error}</div>}

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <div key={student.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                            <div className="relative h-48 bg-gray-100 rounded-t-lg">
                                {/* Use studentPhotoUrl from PHP API */}
                                {student.studentPhotoUrl ? (
                                    <img src={student.studentPhotoUrl} alt={student.studentName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full"><Users className="h-12 w-12 text-gray-400" /></div>
                                )}
                                <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    {student.course || 'N/A'}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{student.studentName}</h3>
                                <div className="space-y-2 mb-4 text-sm text-gray-600">
                                    <div className="flex items-center"><Phone className="mr-2 h-4 w-4" /> {student.mobileNumber}</div>
                                    <div className="flex items-center capitalize"><Users className="mr-2 h-4 w-4" /> {student.gender}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleViewDetails(student)} className="flex-1 bg-green-100 text-green-800 hover:bg-green-200 p-2 rounded-lg text-sm flex items-center justify-center"><Eye className="h-4 w-4" /></button>
                                    <button onClick={() => handleEdit(student.id)} className="flex-1 bg-blue-100 text-blue-800 hover:bg-blue-200 p-2 rounded-lg text-sm flex items-center justify-center"><Edit className="h-4 w-4" /></button>
                                    <button onClick={() => handleDelete(student.id)} className="flex-1 bg-red-100 text-red-800 hover:bg-red-200 p-2 rounded-lg text-sm flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center py-12 text-gray-500">No students found matching your criteria.</p>
                )}
            </div>

            {/* Student Details Modal */}
            {showDetails && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Student Details</h2>
                            <button onClick={closeDetails} className="text-gray-500 hover:text-gray-800">✕</button>
                        </div>
                        <div className="flex flex-col items-center mb-4">
                            <img src={selectedStudent.studentPhotoUrl || 'https://via.placeholder.com/150'} alt={selectedStudent.studentName} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                            <h3 className="text-lg font-semibold mt-2">{selectedStudent.studentName}</h3>
                            <p className="text-sm text-gray-500">{selectedStudent.course}</p>
                        </div>
                        <div className="space-y-3 text-sm">
                            <p><strong>Father's Name:</strong> {selectedStudent.fatherName}</p>
                            <p><strong>Mobile:</strong> {selectedStudent.mobileNumber}</p>
                            <p><strong>Gender:</strong> <span className="capitalize">{selectedStudent.gender}</span></p>
                            <p><strong>Address:</strong> {selectedStudent.fullAddress}</p>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={closeDetails} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsManagement;
