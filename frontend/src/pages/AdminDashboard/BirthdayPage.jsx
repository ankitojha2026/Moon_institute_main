import React, { useState, useEffect } from 'react';
import { Calendar, Gift, Cake, PartyPopper } from 'lucide-react';
import { studentAPI } from '../../services/api';

const BirthdayPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBirthdayFeed();
    }, []);

    const fetchBirthdayFeed = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getBirthdayFeed();
            setStudents(response.records || []);
        } catch (err) {
            console.error('Error fetching birthday feed:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to check if a birthday is today
    const isBirthdayToday = (dateString) => {
        if (!dateString) return false;
        const birthDate = new Date(dateString);
        const today = new Date();
        return birthDate.getDate() === today.getDate() && 
               birthDate.getMonth() === today.getMonth();
    };

    // Formats date to show "Month Day" (e.g., "August 19")
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            month: 'long', day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen">
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                    <PartyPopper className="mr-3 h-10 w-10 text-purple-600" />
                    <h1 className="text-4xl font-bold text-gray-900">🎂 Birthday Feed 🎂</h1>
                    <Cake className="ml-3 h-10 w-10 text-pink-600" />
                </div>
                <p className="text-lg text-gray-600">Today's & Upcoming Celebrations</p>
            </div>
            
            {students.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-600">No birthdays today or in the near future.</p>
                </div>
            ) : (
                <div className="space-y-4 max-w-2xl mx-auto">
                    {students.map((student) => {
                        const isToday = isBirthdayToday(student.dateOfBirth);
                        return (
                            <div
                                key={student.id} // Use 'id' from MySQL
                                className={`bg-white rounded-xl shadow-lg flex items-center p-4 transition-all duration-300 ${
                                    isToday ? 'border-4 border-pink-400 ring-4 ring-pink-200' : 'border border-gray-200'
                                }`}
                            >
                                <img
                                    src={student.studentPhotoUrl || 'https://via.placeholder.com/80'} // Use 'studentPhotoUrl'
                                    alt={student.studentName}
                                    className="w-20 h-20 rounded-full object-cover mr-4 border-2 border-white shadow"
                                />
                                <div className="flex-1">
                                    <p className="font-bold text-lg text-gray-800">{student.studentName}</p>
                                    <p className="text-sm text-gray-500">{student.course}</p>
                                    <div className={`mt-2 text-sm font-semibold px-3 py-1 rounded-full inline-block ${
                                        isToday 
                                            ? 'bg-pink-100 text-pink-700' 
                                            : 'bg-purple-100 text-purple-700'
                                    }`}>
                                        {isToday ? (
                                            <span className="flex items-center"><Cake className="w-4 h-4 mr-2"/> Happy Birthday!</span>
                                        ) : (
                                            <span className="flex items-center"><Gift className="w-4 h-4 mr-2"/> B'day on {formatDate(student.dateOfBirth)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BirthdayPage;
