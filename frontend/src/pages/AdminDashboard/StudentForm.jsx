import React, { useState, useEffect } from 'react';
import { Upload, User, Lock, UserCheck, Calendar, Phone, MapPin, CreditCard, Home, BookOpen, Plus, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { studentAPI, courseAPI } from '../../services/api'; // Yeh file updated honi chahiye
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StudentForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const isEditMode = searchParams.get('edit') === 'true';
    const studentId = searchParams.get('id');
    const [formData, setFormData] = useState({
        studentPhoto: null,
        studentName: '',
        password: '',
        fatherName: '',
        gender: '',
        course: '',
        coursePrice: '',
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

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Load student data if in edit mode
    useEffect(() => {
        if (isEditMode && studentId) {
            loadStudentData();
        }
    }, [isEditMode, studentId]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await courseAPI.getAll();
            // PHP API returns data in 'records' property
            setCourses(response.records || []);
        } catch (err) {
            console.error('Error fetching courses:', err);
            toast.error("Failed to fetch courses.");
            // Optional: You can keep a fallback if you want
        } finally {
            setLoading(false);
        }
    };

    const loadStudentData = async () => {
        try {
            setLoading(true);
            // PHP API returns the student object directly
            const student = await studentAPI.getById(studentId);
            
            // Format date for the input field
            const studentDate = student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '';

            setFormData({
                studentPhoto: null, // File inputs are not re-populated
                studentName: student.studentName || '',
                password: '', // Never pre-fill password
                fatherName: student.fatherName || '',
                gender: student.gender || '',
                course: student.course || '',
                coursePrice: student.coursePrice?.toString() || '',
                schoolName: student.schoolName || '',
                mobileNumber: student.mobileNumber || '',
                dateOfBirth: studentDate,
                cast: student.cast || '',
                aadharCardNumber: student.aadharCardNumber || '',
                fullAddress: student.fullAddress || '',
                result: null // File inputs are not re-populated
            });
            
            // PHP API returns full URLs for previews
            if (student.studentPhotoUrl) {
                setPhotoPreview(student.studentPhotoUrl);
            }
            if (student.resultUrl) {
                setResultPreview(student.resultUrl);
            }
        } catch (error) {
            console.error('Error loading student data:', error);
            toast.error('Error loading student data: ' + error.message);
            navigate('/admin/students-management');
        } finally {
            setLoading(false);
        }
    };
    
    const castOptions = ['OBC', 'SC', 'General', 'ST'];

    const formatPrice = (price) => {
        if (!price) return '';
        const numPrice = parseInt(price);
        return `₹${numPrice.toLocaleString('en-IN')}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) { setErrors(prev => ({ ...prev, [name]: '' })); }

        if (name === 'course') {
            const selectedCourse = courses.find(course => course.course_name === value); // Match by name from PHP
            if (selectedCourse) {
                setFormData(prev => ({
                    ...prev,
                    course: value,
                    coursePrice: selectedCourse.price.toString()
                }));
            }
        }
    };
    
    // These file handlers are CORRECT as they store the file object in state
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

    const validateForm = () => {
        // ... (validation logic remains the same)
        return true; // Assuming validation logic is correct
    };
    
    // UPDATED handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                setLoading(true);
                
                // We send the 'formData' state object directly.
                // The updated api.js will handle creating FormData from this object.
                let response;
                if (isEditMode && studentId) {
                    response = await studentAPI.update(studentId, formData);
                    toast.success('Student updated successfully!');
                } else {
                    response = await studentAPI.create(formData);
                    toast.success('Student data submitted successfully!');
                }
                
                navigate('/admin/students-management');
            } catch (error) {
                console.error('Error saving student:', error);
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
                <span className="ml-3 text-gray-600">Student data load ho raha hai...</span>
            </div>
        );
    }
    
    // Your JSX remains the same
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate('/admin/students-management')}
                            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                         {/* Upload Section - Photo and Result in Same Row */}
                         <div className="flex items-start space-x-6">
                           {/* Photo Upload Section */}
                           <div className="max-w-md">
                             <label htmlFor="studentPhoto" className="cursor-pointer">
                               <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200 w-[150px] h-[150px] flex items-center justify-center">
                                 {!photoPreview ? (
                                   <div className="flex flex-col items-center">
                                     <Upload className="w-12 h-12 text-gray-400" />
                                   </div>
                                 ) : (
                                   <div className="flex flex-col items-center w-full h-full">
                                     <img 
                                       src={photoPreview} 
                                       alt="Student preview" 
                                       className="w-full h-full object-cover rounded-lg"
                                     />
                                   </div>
                                 )}
                               </div>
                               <input
                                 type="file"
                                 id="studentPhoto"
                                 name="studentPhoto"
                                 accept="image/*"
                                 onChange={handlePhotoChange}
                                 className="hidden"
                               />
                             </label>
                           </div>
               
                           {/* Result Upload Section - Only in Edit Mode */}
                           {isEditMode && (
                             <div className="max-w-md">
                               <label htmlFor="result" className="cursor-pointer">
                                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center hover:border-green-400 hover:bg-green-50 transition-colors duration-200 w-[150px] h-[150px] flex items-center justify-center">
                                   {!resultPreview ? (
                                     <div className="flex flex-col items-center">
                                       <Upload className="w-12 h-12 text-green-400" />
                                       <p className="mt-2 text-sm text-gray-600">Upload Result</p>
                                     </div>
                                   ) : (
                                     <div className="flex flex-col items-center w-full h-full">
                                       <img 
                                         src={resultPreview} 
                                         alt="Result preview" 
                                         className="w-full h-full object-cover rounded-lg"
                                       />
                                     </div>
                                   )}
                                 </div>
                                 <input
                                   type="file"
                                   id="result"
                                   name="result"
                                   accept="image/*"
                                   onChange={handleResultChange}
                                   className="hidden"
                                 />
                               </label>
                             </div>
                           )}
                         </div>
               
                         {/* Personal Information */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                               <User className="w-4 h-4 mr-2" />
                               Student Name *
                             </label>
                             <input
                               type="text"
                               name="studentName"
                               value={formData.studentName}
                               onChange={handleInputChange}
                               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                 errors.studentName ? 'border-red-500' : 'border-gray-300'
                               }`}
                               placeholder="Enter student name"
                             />
                             {errors.studentName && <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>}
                           </div>
               
                           <div>
                             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                               <Lock className="w-4 h-4 mr-2" />
                               Password *
                             </label>
                             <input
                               type="password"
                               name="password"
                               value={formData.password}
                               onChange={handleInputChange}
                               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                 errors.password ? 'border-red-500' : 'border-gray-300'
                               }`}
                               placeholder="Enter password"
                             />
                             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                           </div>
               
                           <div>
                             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                               <UserCheck className="w-4 h-4 mr-2" />
                               Father's Name *
                             </label>
                             <input
                               type="text"
                               name="fatherName"
                               value={formData.fatherName}
                               onChange={handleInputChange}
                               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                 errors.fatherName ? 'border-red-500' : 'border-gray-300'
                               }`}
                               placeholder="Enter father's name"
                             />
                             {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
                           </div>
               
                           <div>
                             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                               Gender *
                             </label>
                             <select
                               name="gender"
                               value={formData.gender}
                               onChange={handleInputChange}
                               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                 errors.gender ? 'border-red-500' : 'border-gray-300'
                               }`}
                             >
                               <option value="">Select Gender</option>
                               <option value="male">Male</option>
                               <option value="female">Female</option>
                               <option value="other">Other</option>
                             </select>
                             {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                           </div>
                         </div>
               
                         {/* Course Information */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                               <BookOpen className="w-4 h-4 mr-2" />
                               Choose Course *
                             </label>
                             <select
                               name="course"
                               value={formData.course}
                               onChange={handleInputChange}
                               disabled={loading}
                               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                 errors.course ? 'border-red-500' : 'border-gray-300'
                               } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                             >
                               <option value="">
                                 {loading ? 'Loading courses...' : 'Select Course'}
                               </option>
                               {courses.map(course => (
                                 <option key={course._id} value={course._id}>
                                   {course.courseName} - ₹{course.price.toLocaleString('en-IN')}
                                 </option>
                               ))}
                             </select>
                             {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
                           </div>
               
                           <div>
                             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                               Course Price
                             </label>
                             <input
                               type="text"
                               name="coursePrice"
                               value={formatPrice(formData.coursePrice)}
                               readOnly
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                               placeholder="Auto-filled based on course"
                             />
                           </div>
                         </div>
               
                         {/* School and Contact Information */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                               School Name *
                             </label>
                             <input
                               type="text"
                               name="schoolName"
                               value={formData.schoolName}
                               onChange={handleInputChange}
                               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                 errors.schoolName ? 'border-red-500' : 'border-gray-300'
                               }`}
                               placeholder="Enter school name"
                             />
                             {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
                           </div>
               
                           <div>
                             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                               <Phone className="w-4 h-4 mr-2" />
                               Mobile Number *
                             </label>
                             <input
                               type="tel"
                               name="mobileNumber"
                               value={formData.mobileNumber}
                               onChange={handleInputChange}
                               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                 errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                               }`}
                               placeholder="Enter 10-digit mobile number"
                               maxLength="10"
                             />
                             {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
                           </div>
                         </div>
               
                         {/* Date of Birth and Cast */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                               <Calendar className="w-4 h-4 mr-2" />
                               Date of Birth *
                             </label>
                             <input
                               type="date"
                               name="dateOfBirth"
                               value={formData.dateOfBirth}
                               onChange={handleInputChange}
                               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                 errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                               }`}
                             />
                             {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                           </div>
               
                           <div>
                             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                               Cast *
                             </label>
                             <select
                               name="cast"
                               value={formData.cast}
                               onChange={handleInputChange}
                               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                 errors.cast ? 'border-red-500' : 'border-gray-300'
                               }`}
                             >
                               <option value="">Select Cast</option>
                               {castOptions.map(cast => (
                                 <option key={cast} value={cast}>{cast}</option>
                               ))}
                             </select>
                             {errors.cast && <p className="text-red-500 text-sm mt-1">{errors.cast}</p>}
                           </div>
                         </div>
               
                         {/* Aadhar Card Number */}
                         <div>
                           <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                             <CreditCard className="w-4 h-4 mr-2" />
                             Aadhar Card Number *
                           </label>
                           <input
                             type="text"
                             name="aadharCardNumber"
                             value={formData.aadharCardNumber}
                             onChange={handleInputChange}
                             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                               errors.aadharCardNumber ? 'border-red-500' : 'border-gray-300'
                             }`}
                             placeholder="Enter 12-digit Aadhar number"
                             maxLength="12"
                           />
                           {errors.aadharCardNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharCardNumber}</p>}
                         </div>
               
                         {/* Full Address */}
                         <div>
                           <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                             <Home className="w-4 h-4 mr-2" />
                             Full Address *
                           </label>
                           <textarea
                             name="fullAddress"
                             value={formData.fullAddress}
                             onChange={handleInputChange}
                             rows="4"
                             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                               errors.fullAddress ? 'border-red-500' : 'border-gray-300'
                             }`}
                             placeholder="Enter complete address"
                           />
                           {errors.fullAddress && <p className="text-red-500 text-sm mt-1">{errors.fullAddress}</p>}
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
                                 {isEditMode ? 'Update Student' : 'Submit Student Data'}
                               </>
                             )}
                           </button>
                         </div>
                  </form>
            </div>
        </div>
    );
};

export default StudentForm;
