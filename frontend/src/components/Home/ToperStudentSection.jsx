// src/components/TopStudentsSection.js
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Award, BookOpen, TrendingUp, User, Loader } from 'lucide-react';
import { studentAPI } from '../../services/api'; 
import { toast } from 'sonner';

// Helper function to process and rank students
const processStudentData = (students) => {
  if (!students || students.length === 0) return [];

  const studentsWithStats = students.map(student => {
    if (!student.courses || student.courses.length === 0) {
      return { ...student, totalMarks: 0, percentage: 0 };
    }
    const totalMarksObtained = student.courses.reduce((sum, course) => sum + course.marks, 0);
    const totalMaxMarks = student.courses.reduce((sum, course) => sum + course.maxMarks, 0);
    const percentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;
    return { ...student, totalMarks: totalMarksObtained, percentage: parseFloat(percentage.toFixed(2)) };
  });

  // Filter students with >= 75%
  const toppers = studentsWithStats.filter(student => student.percentage >= 75);

  // Sort toppers by percentage
  toppers.sort((a, b) => b.percentage - a.percentage);

  // Assign ranks to toppers
  return toppers.map((student, index) => ({ ...student, rank: index + 1 }));
};

// Student Card Component
const StudentCard = ({ student }) => (
  <motion.div
    className="bg-white rounded-xl shadow-lg overflow-hidden w-[280px] flex flex-col transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 group"
    whileHover={{ scale: 1.02 }}
  >
    {/* Top section with image and rank */}
    <div className="relative h-40 w-full">
      <img
        src={student.image}
        alt={student.name}
        className="w-full h-full object-cover"
      />
      {/* Rank badge */}
      <div className="absolute top-0 right-0 bg-blue-600 text-white font-bold text-lg rounded-bl-xl px-4 py-2 flex items-center space-x-2">
        <Award size={20} />
        <span>#{student.rank}</span>
      </div>
    </div>

    {/* Student name */}
    <div className="px-5 pt-3 text-center">
      <h3 className="text-lg font-bold text-gray-800 truncate">{student.name}</h3>
    </div>

    {/* Bottom section with details */}
    <div className="p-5 flex-grow flex flex-col justify-between">
      <div className="space-y-4 text-sm">
        {/* Courses */}
        <div className="flex items-start text-gray-700">
          <BookOpen size={18} className="mr-3 mt-0.5 flex-shrink-0 text-indigo-500" />
          <div>
            <p className="font-semibold text-gray-800">Courses</p>
            <p className="text-gray-600 text-xs leading-tight">
              {student.courses.map(c => c.name).join(", ")}
            </p>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="flex items-start text-gray-700">
          <TrendingUp size={18} className="mr-3 mt-0.5 flex-shrink-0 text-indigo-500" />
          <div>
            <p className="font-semibold text-gray-800">Performance</p>
            <p className="text-gray-600 text-xs">
              Marks: <span className="font-bold">{student.totalMarks}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Percentage Bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-indigo-600">Percentage</span>
          <span className="text-sm font-bold text-indigo-600">{student.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${student.percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Main Component
const ToperStudentsSection = () => {
  const [loading, setLoading] = useState(true);
  const [allStudents, setAllStudents] = useState([]);
  
  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        const studentsData = await studentAPI.getAllWithResults();
        setAllStudents(studentsData);
      } catch (error) {
        toast.error("Failed to fetch student data.");
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndProcessData();
  }, []);

  const topStudents = useMemo(() => processStudentData(allStudents), [allStudents]);

  if (loading) {
    return (
      <div className="bg-gray-100 py-12 text-center">
        <Loader size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">Fetching Toppers...</h2>
      </div>
    );
  }
  
  if (topStudents.length === 0) {
    return (
      <div className="bg-gray-100 py-12 text-center">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">No Toppers Found</h2>
        <p className="text-gray-500">No students found with 75% or more.</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900">Our Top Achievers</h2>
          <p className="mt-4 text-lg text-gray-600">Celebrating students who scored above 75%.</p>
        </div>

        {/* ✅ Container around Swiper */}
        <div className="container mx-auto px-4">
          <Swiper
            modules={[Grid, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            grid={{ rows: 2, fill: 'row' }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            breakpoints={{
              640: { slidesPerView: 2, grid: { rows: 2 } },
              1024: { slidesPerView: 3, grid: { rows: 2 } },
            }}
            className="mySwiper"
            style={{
              '--swiper-navigation-color': '#000',
              '--swiper-pagination-color': '#0056b3',
              paddingBottom: '50px',
            }}
          >
            {topStudents.map((student) => (
              <SwiperSlide key={student.id} className="pb-4 flex justify-center">
                <StudentCard student={student} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ToperStudentsSection;
