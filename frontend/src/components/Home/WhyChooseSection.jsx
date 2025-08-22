import { Card, CardContent } from "@/components/ui/card";
import { Trophy, GraduationCap, BookOpen } from "lucide-react";

const WhyChooseSection = () => {
  return (
    <section className="bg-gray-50">
      {/* Upper Section - Why Choose */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose The Moon Institute?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: Proven Results */}
            <Card className="border-0 shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-pink-300 hover:bg-pink-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 group-hover:bg-yellow-200">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Proven Results
                </h3>
                <p className="text-gray-600">
                  95% success rate in competitive exams
                </p>
              </CardContent>
            </Card>

            {/* Card 2: Expert Faculty */}
            <Card className="border-0 shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-green-300 hover:bg-green-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 group-hover:bg-green-200">
                  <GraduationCap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Expert Faculty
                </h3>
                <p className="text-gray-600">
                  Experienced teachers from top institutions
                </p>
              </CardContent>
            </Card>

            {/* Card 3: Comprehensive Study Material */}
            <Card className="border-0 shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-700 hover:bg-blue-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 group-hover:bg-blue-700">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Comprehensive Study Material
                </h3>
                <p className="text-gray-600">
                  Updated curriculum and practice tests
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Lower Section - Statistics */}
      <div className="bg-primary py-16 mb-0">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {/* Statistic 1 */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                5000+
              </div>
              <div className="text-white/90 text-lg">
                Students Taught
              </div>
            </div>

            {/* Statistic 2 */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                500+
              </div>
              <div className="text-white/90 text-lg">
                JEE Selections
              </div>
            </div>

            {/* Statistic 3 */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                300+
              </div>
              <div className="text-white/90 text-lg">
                NEET Selections
              </div>
            </div>

            {/* Statistic 4 */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                15+
              </div>
              <div className="text-white/90 text-lg">
                Years Experience
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
