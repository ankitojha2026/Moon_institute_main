import React, { useState, useEffect } from 'react';
import { Upload, User, Lock, UserCheck, Calendar, Phone, MapPin, CreditCard, Home, BookOpen, Plus, Save, ArrowLeft, Loader2, Tag } from 'lucide-react';
import { studentAPI, courseAPI } from '../../services/api'; // Yeh aapki API service file hai
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StudentForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const isEditMode = searchParams.get('edit') === 'true';
    const studentId = searchParams.get('id');

    // Updated state to handle multiple courses
    const [formData, setFormData] = useState({
        studentPhoto: null,
        studentName: '',
        password: '',
        fatherName: '',
        gender: '',
        selectedCourses: [], // Array to store IDs of selected courses
        schoolName: '',
        mobileNumber: '',
        dateOfBirth: '',
        cast: '',
        aadharCardNumber: '',
        fullAddress: '',
        result: null
    });

    const [photoPreview, setPhotoPreview] = useState(null);
    const [resultPreview, setResultPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    // Fetch courses from API when component mounts
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await courseAPI.getAll();
                setCourses(response.records || []);
            } catch (err) {
                console.error('Error fetching courses:', err);
                toast.error("Failed to fetch courses.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Load existing student data if in edit mode
    useEffect(() => {
        const loadStudentData = async () => {
            if (isEditMode && studentId) {
                try {
                    setLoading(true);
                    const student = await studentAPI.getById(studentId);
                    const studentDate = student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '';
                    
                    setFormData({
                        studentPhoto: null,
                        studentName: student.studentName || '',
                        password: '', // Never pre-fill password for security
                        fatherName: student.fatherName || '',
                        gender: student.gender || '',
                        selectedCourses: student.enrolled_courses || [], // Expecting an array of course IDs from API
                        schoolName: student.schoolName || '',
                        mobileNumber: student.mobileNumber || '',
                        dateOfBirth: studentDate,
                        cast: student.cast || '',
                        aadharCardNumber: student.aadharCardNumber || '',
                        fullAddress: student.fullAddress || '',
                        result: null
                    });

                    if (student.studentPhotoUrl) setPhotoPreview(student.studentPhotoUrl);
                    if (student.resultUrl) setResultPreview(student.resultUrl);

                } catch (error) {
                    console.error('Error loading student data:', error);
                    toast.error('Error loading student data: ' + error.message);
                    navigate('/admin/students-management');
                } finally {
                    setLoading(false);
                }
            }
        };
        loadStudentData();
    }, [isEditMode, studentId, navigate]);

    // Calculate total price whenever selected courses or the main course list changes
    useEffect(() => {
        const calculateTotalPrice = () => {
            const total = formData.selectedCourses.reduce((sum, courseId) => {
                const course = courses.find(c => c.id === courseId);
                return sum + (course ? parseFloat(course.price) : 0);
            }, 0);
            setTotalPrice(total);
        };

        if (courses.length > 0) {
            calculateTotalPrice();
        }
    }, [formData.selectedCourses, courses]);
    
    const castOptions = ['OBC', 'SC', 'General', 'ST'];

    const formatPrice = (price) => {
        const numPrice = Number(price);
        return `₹${numPrice.toLocaleString('en-IN')}`;
    };

    // Generic handler for most text inputs and selects
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) { setErrors(prev => ({ ...prev, [name]: '' })); }
    };
    
    // Specific handler for course checkboxes
    const handleCourseChange = (e) => {
        const courseId = parseInt(e.target.value, 10);
        const isChecked = e.target.checked;

        setFormData(prev => {
            const currentCourses = prev.selectedCourses;
            const newSelectedCourses = isChecked
                ? [...currentCourses, courseId]
                : currentCourses.filter(id => id !== courseId);
            return { ...prev, selectedCourses: newSelectedCourses };
        });
        if (errors.courses) { setErrors(prev => ({ ...prev, courses: '' })); }
    };
    
    // File handlers
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, studentPhoto: file }));
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleResultChange = (e) => {
        const file = e.target.files;
        if (file) {
            setFormData(prev => ({ ...prev, result: file }));
            setResultPreview(URL.createObjectURL(file));
        }
    };

    // Complete validation logic
    const validateForm = () => {
        const newErrors = {};
        if (!formData.studentName.trim()) newErrors.studentName = "Student name is required.";
        if (!isEditMode && !formData.password) newErrors.password = "Password is required.";
        if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required.";
        if (!formData.gender) newErrors.gender = "Please select a gender.";
        if (formData.selectedCourses.length === 0) newErrors.courses = "Please select at least one course.";
        if (!formData.schoolName.trim()) newErrors.schoolName = "School name is required.";
        if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Please enter a valid 10-digit mobile number.";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";
        if (!formData.cast) newErrors.cast = "Please select a cast.";
        if (!/^\d{12}$/.test(formData.aadharCardNumber)) newErrors.aadharCardNumber = "Please enter a valid 12-digit Aadhar number.";
        if (!formData.fullAddress.trim()) newErrors.fullAddress = "Full address is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill all the required fields correctly.");
            return;
        }
        
        setLoading(true);
        try {
            // Your api service will handle converting this object to FormData
            const response = isEditMode
                ? await studentAPI.update(studentId, formData)
                : await studentAPI.create(formData);
            
            toast.success(`Student ${isEditMode ? 'updated' : 'created'} successfully!`);
            navigate('/admin/students-management');
        } catch (error) {
            console.error('Error saving student:', error);
            toast.error(`Error: ${error.message || 'Something went wrong.'}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !courses.length) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
                <span className="ml-3 text-gray-600">Loading initial data...</span>
            </div>
        );
    }
    
    return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => navigate('/admin/students-management')} className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Students
                    </button>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    {isEditMode ? 'Edit Student' : 'Student Registration Form'}
                </h1>
                <p className="text-gray-600">
                    {isEditMode ? 'Update the student details below' : 'Fill in the student details below'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload Section (No Change) */}
                <div className="flex items-start space-x-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Student Photo *</label>
                        <label htmlFor="studentPhoto" className="cursor-pointer">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center hover:border-blue-400 w-[150px] h-[150px] flex items-center justify-center">
                                {!photoPreview ? (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <Upload className="w-12 h-12" />
                                    </div>
                                ) : (
                                    <img src={photoPreview} alt="Student preview" className="w-full h-full object-cover rounded-lg"/>
                                )}
                            </div>
                        </label>
                        <input type="file" id="studentPhoto" name="studentPhoto" accept="image/*" onChange={handlePhotoChange} className="hidden"/>
                    </div>
                </div>

                {/* Personal Information (No Change) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2"><User className="w-4 h-4 mr-2" />Student Name *</label>
                        <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.studentName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter student name"/>
                        {errors.studentName && <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>}
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2"><Lock className="w-4 h-4 mr-2" />Password *</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder={isEditMode ? "Leave blank to keep unchanged" : "Enter password"} />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2"><UserCheck className="w-4 h-4 mr-2" />Father's Name *</label>
                        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.fatherName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter father's name" />
                        {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">Gender *</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                    </div>
                </div>

                {/* Course Information - MULTI-SELECT CHECKBOXES (No Change) */}
                <div className="space-y-4">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                        <BookOpen className="w-4 h-4 mr-2" />Choose Courses *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                        {courses.length > 0 ? courses.map(course => (
                            <div key={course.id} className="flex items-center">
                                <input type="checkbox" id={`course-${course.id}`} value={course.id} checked={formData.selectedCourses.includes(course.id)} onChange={handleCourseChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                <label htmlFor={`course-${course.id}`} className="ml-3 text-sm text-gray-700 cursor-pointer">{course.courseName} - {formatPrice(course.price)}</label>
                            </div>
                        )) : <p className="text-gray-500">No courses available.</p>}
                    </div>
                    {errors.courses && <p className="text-red-500 text-sm mt-1">{errors.courses}</p>}
                </div>
                
                {/* --- NEW UPDATE: Display Selected Courses and Total Price --- */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">Selected Courses Summary</h3>
                    
                    {/* Display Selected Courses Names */}
                    <div>
                        <ul className="space-y-1 list-disc list-inside">
                            {formData.selectedCourses.length > 0 ? (
                                formData.selectedCourses.map(courseId => {
                                    const course = courses.find(c => c.id === courseId);
                                    return course ? <li key={course.id} className="text-gray-700">{course.courseName}</li> : null;
                                })
                            ) : (
                                <p className="text-gray-500 italic">No courses selected yet.</p>
                            )}
                        </ul>
                    </div>
                    
                    {/* Display Total Price */}
                    <div className="pt-2 border-t border-blue-200">
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2"><Tag className="w-4 h-4 mr-2" />Total Price</label>
                        <input type="text" value={formatPrice(totalPrice)} readOnly className="w-full px-3 py-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed font-semibold text-lg"/>
                    </div>
                </div>
                
                {/* Other Information (No Change) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">School Name *</label>
                        <input type="text" name="schoolName" value={formData.schoolName} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.schoolName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter school name"/>
                        {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2"><Phone className="w-4 h-4 mr-2" />Mobile Number *</label>
                        <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter 10-digit mobile number" maxLength="10" />
                        {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2"><Calendar className="w-4 h-4 mr-2" />Date of Birth *</label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}/>
                        {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">Cast *</label>
                        <select name="cast" value={formData.cast} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.cast ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select Cast</option>
                            {castOptions.map(cast => (<option key={cast} value={cast}>{cast}</option>))}
                        </select>
                        {errors.cast && <p className="text-red-500 text-sm mt-1">{errors.cast}</p>}
                    </div>
                </div>
                
                <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2"><CreditCard className="w-4 h-4 mr-2" />Aadhar Card Number *</label>
                    <input type="text" name="aadharCardNumber" value={formData.aadharCardNumber} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.aadharCardNumber ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter 12-digit Aadhar number" maxLength="12"/>
                    {errors.aadharCardNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharCardNumber}</p>}
                </div>
                
                <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2"><Home className="w-4 h-4 mr-2" />Full Address *</label>
                    <textarea name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} rows="4" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.fullAddress ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter complete address"/>
                    {errors.fullAddress && <p className="text-red-500 text-sm mt-1">{errors.fullAddress}</p>}
                </div>

                {/* Submit Button (No Change) */}
                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center min-w-[150px]">
                        {loading ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{isEditMode ? 'Updating...' : 'Saving...'}</>
                        ) : (
                            <>{isEditMode ? <Save className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}{isEditMode ? 'Update Student' : 'Submit Student'}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    </div>
);

};

export default StudentForm;

