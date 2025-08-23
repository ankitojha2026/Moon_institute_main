// src/pages/admin/ResultsManagement.js

import React, { useState, useEffect } from 'react';
import { studentAPI, resultAPI } from '../../services/api';
import { toast } from 'sonner';
import { Plus, Trash2, X, List, Loader } from 'lucide-react';

const ResultsManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentResults, setStudentResults] = useState([]);
    const [newResult, setNewResult] = useState({
        course_id: '',
        test_name: '',
        marks_obtained: '',
        total_marks: '100',
        test_date: new Date().toISOString().split('T')[0]
    });

    // Fetch all students on component mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // read_one.php ko use karke har student ke enrolled courses la rahe hain
                const response = await studentAPI.getAll(); 
                const studentsWithDetails = await Promise.all(
                    response.records.map(student => studentAPI.getById(student.id))
                );
                setStudents(studentsWithDetails);
            } catch (error) {
                toast.error("Failed to fetch students.");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    // Function to open the results modal
    const handleManageResults = async (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
        try {
            const response = await resultAPI.getByStudentId(student.id);
            setStudentResults(response.records || []);
        } catch (error) {
            toast.error("Failed to fetch results for this student.");
        }
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
        setStudentResults([]);
        setNewResult({ course_id: '', test_name: '', marks_obtained: '', total_marks: '100', test_date: new Date().toISOString().split('T')[0] });
    };

    const handleNewResultChange = (e) => {
        const { name, value } = e.target;
        setNewResult(prev => ({ ...prev, [name]: value }));
    };

    const handleAddResult = async (e) => {
        e.preventDefault();
        if (!newResult.course_id || !newResult.test_name || newResult.marks_obtained === '') {
            toast.error("Please fill all fields for the new result.");
            return;
        }

        try {
            await resultAPI.create({
                ...newResult,
                student_id: selectedStudent.id,
            });
            toast.success("Result added successfully!");
            // Refresh results
            const response = await resultAPI.getByStudentId(selectedStudent.id);
            setStudentResults(response.records || []);
            // Reset form
            setNewResult({ course_id: '', test_name: '', marks_obtained: '', total_marks: '100', test_date: new Date().toISOString().split('T')[0] });
        } catch (error) {
            toast.error("Failed to add result.");
        }
    };
    
    const handleDeleteResult = async (resultId) => {
        if (window.confirm("Are you sure you want to delete this result?")) {
            try {
                await resultAPI.delete(resultId);
                toast.success("Result deleted!");
                setStudentResults(prev => prev.filter(r => r.id !== resultId));
            } catch (error) {
                toast.error("Failed to delete result.");
            }
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader className="animate-spin inline-block" /></div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Results Management</h1>
            
            {/* Students Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Courses</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map(student => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.student_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {student.enrolled_courses_details?.map(c => c.course_name).join(', ') || 'None'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleManageResults(student)} className="flex items-center text-blue-600 hover:text-blue-800">
                                        <List className="w-4 h-4 mr-2" />
                                        Manage Results
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Results Modal */}
            {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold">Manage Results for {selectedStudent.student_name}</h2>
                            <button onClick={handleCloseModal}><X className="w-6 h-6" /></button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            {/* Existing Results Table */}
                            <h3 className="font-semibold mb-2">Existing Results</h3>
                            <div className="mb-6 overflow-hidden border rounded-lg">
                                <table className="min-w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-semibold">Course</th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold">Test Name</th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold">Score</th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {studentResults.length > 0 ? studentResults.map(result => (
                                            <tr key={result.id}>
                                                <td className="px-4 py-2">{result.course_name}</td>
                                                <td className="px-4 py-2">{result.test_name}</td>
                                                <td className="px-4 py-2">{result.marks_obtained} / {result.total_marks}</td>
                                                <td className="px-4 py-2">{new Date(result.test_date).toLocaleDateString()}</td>
                                                <td>
                                                    <button onClick={() => handleDeleteResult(result.id)} className="text-red-500 hover:text-red-700 p-1">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="text-center py-4">No results found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Add New Result Form */}
                            <h3 className="font-semibold mb-2 border-t pt-4">Add New Result</h3>
                            <form onSubmit={handleAddResult} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium">Course</label>
                                    <select name="course_id" value={newResult.course_id} onChange={handleNewResultChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                        <option value="">Select Course</option>
                                        {selectedStudent.enrolled_courses_details?.map(course => (
                                            <option key={course.id} value={course.id}>{course.course_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Test Name</label>
                                    <input type="text" name="test_name" value={newResult.test_name} onChange={handleNewResultChange} placeholder="e.g., Mid-Term" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Marks Obtained</label>
                                    <input type="number" name="marks_obtained" value={newResult.marks_obtained} onChange={handleNewResultChange} placeholder="e.g., 85" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Total Marks</label>
                                    <input type="number" name="total_marks" value={newResult.total_marks} onChange={handleNewResultChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div className="md:col-span-1">
                                    <button type="submit" className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                        <Plus className="w-4 h-4 mr-2" /> Add
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsManagement;
