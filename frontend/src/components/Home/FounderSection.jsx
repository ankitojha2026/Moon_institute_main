import { Card, CardContent } from "@/components/ui/card";

const FounderSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Founder's Portrait */}
                <div className="lg:w-1/3">
                  <div className="h-full">
                    <img
                      src="/images/founder.jpg"
                      alt="Mr. Guru Sharma - Founder of The Moon Institute"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback placeholder if image doesn't load */}
                    <div className="hidden w-full h-full bg-gray-200 items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">GS</span>
                        </div>
                        <p className="text-gray-600">Founder Photo</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-2/3 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Meet Our Founder
                  </h2>
                  
                  <h3 className="text-2xl font-semibold text-primary mb-6">
                    Mr. Guru Sharma
                  </h3>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    With over 15 years of experience in competitive exam coaching, Mr. Guru Sharma has guided thousands of students to success in JEE, NEET, and board examinations. His innovative teaching methods and personalized approach have made The Moon Institute a beacon of excellence in education.
                  </p>
                  
                  {/* Achievement Badges */}
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      M.Tech IIT Delhi
                    </span>
                    <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      15+ Years Experience
                    </span>
                    <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      5000+ Students Mentored
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
