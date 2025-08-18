import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sprout, Rocket, Zap, Stethoscope, FileText, Target, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Courses = () => {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Our Courses</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive programs designed for academic excellence and competitive success
            </p>
          </div>
        </section>

        {/* JEE & NEET Preparation */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* JEE Preparation */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -10 }}
              >
                <Card className="border-0 shadow-lg overflow-hidden relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </span>
                </div>
                
                <div className="bg-blue-600 text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">JEE Preparation</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-yellow-500" />
                    </div>
                    <span className="text-sm">Advanced</span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Course Features:</h4>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Comprehensive Physics, Chemistry, Mathematics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Weekly Mock Tests & Detailed Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Daily Doubt Clearing Sessions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Complete Study Material & DPPs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Previous 20 Years Question Papers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Online Test Series Access</span>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-600 mb-1">₹25,000/year</div>
                    <div className="text-sm text-gray-500">Includes all study materials</div>
                  </div>
                  
                <Link to="/contact">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-700 hover:to-purple-900 text-white">
                        Enroll Now
                    </Button>
                </Link>
                </CardContent>
              </Card>
              </motion.div>

              {/* NEET Preparation */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -10 }}
              >
              <Card className="border-0 shadow-lg overflow-hidden relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    TRENDING
                  </span>
                </div>
                
                <div className="bg-green-600 text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">NEET Preparation</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-sm">Medical Entrance</span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Course Features:</h4>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Biology, Physics, Chemistry</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">NCERT Based Comprehensive Teaching</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Regular Mock Tests & Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Previous Year Papers Practice</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Medical Career Guidance</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Anatomy Models & Lab Access</span>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-green-600 mb-1">₹22,000/year</div>
                    <div className="text-sm text-gray-500">Includes all study materials</div>
                  </div>
                  
                  <Link to="/contact">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-700 hover:to-purple-900 text-white">
                        Enroll Now
                    </Button>
                </Link>
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
        {/* Foundation Courses */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-primary mb-16">
              Foundation Courses
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Class 9th & 10th */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-primary text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">Class 9th & 10th</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Sprout className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm">Foundation Course</span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">All Subjects Coverage (Math, Science, English)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Board Exam Preparation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Strong Concept Building</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Regular Assessments & Tests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Olympiad Preparation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Career Counseling</span>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary mb-1">₹15,000/year</div>
                    <div className="text-sm text-gray-500">Per subject: ₹6,000/year</div>
                  </div>
                  
                  <Link to="/contact">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-700 hover:to-purple-900 text-white">
                        Enroll Now
                    </Button>
                </Link>
                </CardContent>
              </Card>

              {/* Class 11th & 12th */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-orange-500 text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">Class 11th & 12th</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Rocket className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-sm">Competitive</span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">PCM/PCB Streams Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Board + JEE/NEET Preparation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Advanced Problem Solving</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Regular Mock Tests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Career Guidance & Counseling</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">College Admission Support</span>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-orange-500 mb-1">₹20,000/year</div>
                    <div className="text-sm text-gray-500">PCM/PCB streams available</div>
                  </div>
                
                  <Link to="/contact">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-700 hover:to-purple-900 text-white">
                        Enroll Now
                    </Button>
                </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        {/* Additional Services */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-primary mb-16">
              Additional Services
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Test Series */}
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Test Series
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comprehensive online and offline test series for all competitive exams
                  </p>
                  
                  <div className="text-2xl font-bold text-primary mb-6">
                    ₹3,000/year
                  </div>
                  
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-700 hover:to-purple-900 text-white">
                    <Link to="/contact">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Doubt Classes */}
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-pink-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Doubt Classes
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Dedicated doubt clearing sessions with expert faculty
                  </p>
                  
                  <div className="text-2xl font-bold text-primary mb-6">
                    ₹2,000/month
                  </div>
                  
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-700 hover:to-purple-900 text-white">
                    <Link to="/contact">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Career Counseling */}
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-8 h-8 text-orange-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Career Counseling
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Professional guidance for career planning and college selection
                  </p>
                  
                  <div className="text-2xl font-bold text-primary mb-6">
                    ₹1,500/session
                  </div>
                  
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-700 hover:to-purple-900 text-white">
                    <Link to="/contact">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Courses;
