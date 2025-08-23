import { Card, CardContent } from "@/components/ui/card";
import MissionVisionSection from "@/components/About/MissionVisionSection";
import FacultySection from "@/components/About/FacultySection";
import ScrollToTopButton from "../components/common/ScrollToTopButton";

const About = () => {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">About The Moon Institute</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Where Learning Meets Success
            </p>
          </div>
        </section>

        <MissionVisionSection />

        {/* About Content */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    About The Moon Institute
                  </h2>
                  
                  <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                    <p>
                      At The Moon Institute, we believe education is the light that guides every learner toward a brighter future.
                    </p>
                    
                    <p>
                      We provide high-quality coaching for students from Class 9 to Class 12 in both CBSE and UP Board syllabi. Our specialized programs cover Spoken English, IIT-JEE, and NEET preparation, empowering students to excel in academics, competitive exams, and communication skills.
                    </p>
                    
                    <p>
                      Our experienced faculty, student-friendly teaching methods, and personalized attention ensure that every learner understands concepts deeply and gains the confidence to achieve their goals.
                    </p>
                    
                    <p className="font-semibold text-primary">
                      With a commitment to academic excellence and holistic development, The Moon Institute is not just a place to study—it's where dreams take shape and futures shine bright.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <FacultySection />
      </main>
         <ScrollToTopButton/>
    </div>
  );
};

export default About;