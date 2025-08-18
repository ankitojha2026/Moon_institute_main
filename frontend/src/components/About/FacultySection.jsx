import { Card, CardContent } from "@/components/ui/card";
import { Atom, TestTube, Dna } from "lucide-react";

const FacultySection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-primary mb-16">
          Meet Our Faculty
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Faculty 1: Dr. Priya Sharma */}
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Atom className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Dr. Priya Sharma
              </h3>
              <p className="text-primary font-semibold mb-3">
                Physics Faculty
              </p>
              
              <div className="space-y-1 mb-4">
                <p className="text-gray-600 text-sm">M.Sc Physics, IIT Bombay</p>
                <p className="text-gray-600 text-sm">12+ Years Experience</p>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">
                  Expert
                </span>
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                  IIT Alumni
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Faculty 2: Prof. Amit Gupta */}
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TestTube className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Prof. Amit Gupta
              </h3>
              <p className="text-primary font-semibold mb-3">
                Chemistry Faculty
              </p>
              
              <div className="space-y-1 mb-4">
                <p className="text-gray-600 text-sm">Ph.D Chemistry, IIT Delhi</p>
                <p className="text-gray-600 text-sm">10+ Years Experience</p>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                  Ph.D
                </span>
                <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">
                  Research
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Faculty 3: Dr. Sneha Patel */}
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Dna className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Dr. Sneha Patel
              </h3>
              <p className="text-primary font-semibold mb-3">
                Biology Faculty
              </p>
              
              <div className="space-y-1 mb-4">
                <p className="text-gray-600 text-sm">M.D, AIIMS Delhi</p>
                <p className="text-gray-600 text-sm">8+ Years Teaching Experience</p>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-pink-500 text-white rounded-full text-xs font-medium">
                  M.D
                </span>
                <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                  AIIMS
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FacultySection;
