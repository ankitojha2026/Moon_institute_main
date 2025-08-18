import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const ReviewsSection = () => {
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

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-lg text-gray-600">
              Hear from our students about their experience at The Moon Institute
            </p>
          </div>

          {/* Overall Rating */}
          <div className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Overall Rating</h3>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-5xl font-bold text-gray-900">4.9</span>
                <span className="text-gray-600 text-xl">of 5</span>
              </div>
              <div className="flex justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600">Based on student reviews</p>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.class}</p>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-5 h-5 ${
                            star <= testimonial.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
