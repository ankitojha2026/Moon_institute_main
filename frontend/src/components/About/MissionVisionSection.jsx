import { Card, CardContent } from "@/components/ui/card";
import { Target, Building2, BarChart3, Star, Trophy } from "lucide-react";

const MissionVisionSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Mission & Vision */}
          <div className="space-y-12">
            {/* Our Mission */}
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                To provide world-class education and guidance to students preparing for competitive examinations and board exams. We believe in nurturing not just academic excellence but also building character and confidence in every student who walks through our doors.
              </p>
            </div>

            {/* Our Vision */}
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                To be the leading coaching institute that transforms dreams into reality, creating future leaders and innovators who contribute positively to society and make a meaningful impact in their chosen fields.
              </p>
            </div>
          </div>

          {/* Right Column - Achievements */}
          <div>
            <Card className="border-0 shadow-lg bg-purple-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  Our Achievements
                </h3>
                
                <div className="space-y-6">
                  {/* Achievement 1 */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">500+ JEE Selections (Main & Advanced)</p>
                    </div>
                  </div>

                  {/* Achievement 2 */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">300+ NEET Selections</p>
                    </div>
                  </div>

                  {/* Achievement 3 */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">98% Board Exam Success Rate</p>
                    </div>
                  </div>

                  {/* Achievement 4 */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">4.9/5 Student Rating</p>
                    </div>
                  </div>

                  {/* Achievement 5 */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Best Coaching Institute Award 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
