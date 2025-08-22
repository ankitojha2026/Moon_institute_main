import React, { useState, useEffect } from 'react';
import { Cake, Gift, Loader2, Sparkles } from 'lucide-react';
import { studentAPI } from '../../services/api';

const BirthdaySection = () => {
    const [birthdayFeed, setBirthdayFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Fetch birthday feed on component mount
    useEffect(() => {
        const fetchBirthdayData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await studentAPI.getBirthdayFeed();
                setBirthdayFeed(response.records || []);
            } catch (err) {
                console.error('Failed to fetch birthday feed:', err);
                setError('Failed to fetch birthday data');
            } finally {
                setLoading(false);
            }
        };

        fetchBirthdayData();
    }, []);

    // Auto-play functionality for the carousel
    useEffect(() => {
        if (!isAutoPlaying || birthdayFeed.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % birthdayFeed.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, birthdayFeed.length]);

    const isBirthdayToday = (dateString) => {
        if (!dateString) return false;
        const birthDate = new Date(dateString);
        const today = new Date();
        return birthDate.getDate() === today.getDate() && birthDate.getMonth() === today.getMonth();
    };

    const formatUpcomingDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            month: 'long', day: 'numeric'
        });
    };

    // Loading
    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-br from-pink-100 to-purple-100 flex justify-center items-center">
                <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
            </section>
        );
    }

    // Error
    if (error) {
        return (
            <section className="py-20 bg-red-50">
                <p className="text-center text-red-600 font-semibold">{error}</p>
            </section>
        );
    }

    // No Birthdays
    if (birthdayFeed.length === 0) {
        return (
            <section className="py-20 bg-gradient-to-r from-blue-50 to-green-50">
                <div className="container mx-auto px-4 text-center">
                    <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-3xl font-bold text-gray-700">No Celebrations 🎉</h3>
                    <p className="text-gray-500 mt-2">Check back tomorrow for more birthday wishes!</p>
                </div>
            </section>
        );
    }

    const currentStudent = birthdayFeed[currentIndex];
    const isToday = isBirthdayToday(currentStudent.dateOfBirth);

    return (
        <section className="py-20 bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-white rounded-3xl shadow-2xl p-10 md:p-14 border border-pink-200 overflow-hidden group transition-all duration-300 hover:scale-[1.02]">
                        
                        {/* Decorative Sparkles */}
                        <Sparkles className="absolute top-6 left-6 text-pink-300 animate-pulse w-6 h-6" />
                        <Sparkles className="absolute bottom-6 right-6 text-purple-300 animate-pulse w-6 h-6" />

                        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                            
                            {/* Student Image */}
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-200 to-purple-200 blur-xl opacity-70 animate-pulse"></div>
                                <img 
                                    src={currentStudent.studentPhotoUrl || `https://ui-avatars.com/api/?name=${currentStudent.studentName}&background=random`} 
                                    alt={currentStudent.studentName}
                                    className="relative w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-pink-300 shadow-xl transform transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Student Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-4xl font-extrabold text-gray-800 mb-2">
                                    {currentStudent.studentName} 🎂
                                </h3>
                                <p className="text-lg text-gray-500">{currentStudent.course}</p>

                                {/* Birthday Tag */}
                                <div className={`mt-5 text-lg font-semibold px-6 py-2 rounded-full inline-flex items-center gap-2 transition-all duration-300 ${
                                    isToday 
                                        ? 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 shadow-md animate-bounce' 
                                        : 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 shadow-md'
                                }`}>
                                    {isToday ? (
                                        <><Cake className="w-5 h-5" /> Happy Birthday! 🎉</>
                                    ) : (
                                        <><Gift className="w-5 h-5" /> Birthday on {formatUpcomingDate(currentStudent.dateOfBirth)} 🎁</>
                                    )}
                                </div>

                                {/* Message */}
                                <p className="text-base mt-5 text-gray-600 italic animate-fadeIn">
                                    "Wishing you a day full of 🎊 joy, 🥳 surprises, and ❤️ love!"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dots Indicator */}
                    {birthdayFeed.length > 1 && (
                        <div className="flex justify-center mt-8 gap-3">
                            {birthdayFeed.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                                        index === currentIndex 
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 scale-110 shadow-lg' 
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`View ${birthdayFeed[index].studentName}'s birthday`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BirthdaySection;
