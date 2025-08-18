import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-800 text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
          <div className="space-y-8">
            <motion.div 
              className="space-y-4 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold leading-tight text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                EMPOWERING <span className="text-accent text-center">YOUNG MINDS</span>
                <br />
                IN BANDA <span className="text-accent text-center">WITH</span>
                <br />
                <span className="text-accent text-center">EDUCATION</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-blue-100 max-w-lg text-center mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                From Class 9 to 12, CBSE & UP Board, to Spoken English, IIT-JEE, and NEET prep — we shape achievers.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-700 hover:to-purple-900 text-white font-semibold px-8 py-3">
                  <Link to="/courses">Explore Courses</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white bg-transparent text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                >
                  <Link to="/student-login">Student Login</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-64 h-64 bg-accent rounded-full flex items-center justify-center">
                  <div className="text-primary text-6xl">📚</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center animate-bounce">
                <span className="text-primary text-2xl">🎓</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;