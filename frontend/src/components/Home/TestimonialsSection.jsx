import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Prisha",
      rating: 5,
      comment: "Exceedingly recommend",
      class: "Class 10th"
    },
    {
      name: "Anmol",
      rating: 5,
      comment: "I love lovely school",
      class: "Class 11th"
    },
    {
      name: "Kavya",
      rating: 5,
      comment: "Entrancovs fantastic",
      class: "Class 12th"
    }
  ];

  const topStudents = [
    { name: "Radheshyam", class: "Class 9th", roll: "1682", subjects: ["Math: 58", "Sci: 52", "Stu: 58"] },
    { name: "Shalini", class: "Class 10th", roll: "1547", subjects: ["Math: 92", "Sci: 88", "Eng: 85"] },
    { name: "Krishna", class: "Class 11th", roll: "1234", subjects: ["Math: 89", "Phy: 85", "Che: 87"] }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Testimonials */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Reviews</h2>
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-5xl font-bold text-gray-900">4.9</span>
                <span className="text-gray-600">of 5</span>
              </div>
              <div className="flex space-x-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${
                              star <= testimonial.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{testimonial.comment}</p>
                    <p className="text-xs text-gray-500">{testimonial.class}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Students */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">TOP 10 STUDENTS</h2>
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.class}</p>
                        <p className="text-xs text-gray-500">Roll No: {student.roll}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {student.subjects.map((subject, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1 bg-primary text-white text-xs rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;