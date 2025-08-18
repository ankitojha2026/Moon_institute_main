import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react";
import ReviewsSection from "@/components/Contact/ReviewsSection";
import { motion } from "framer-motion";
import { contactAPI } from "../services/api";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    courseInterest: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phoneNumber || !formData.courseInterest || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.phoneNumber.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    try {
      setLoading(true);
      const response = await contactAPI.submit(formData);
      
      if (response.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          courseInterest: '',
          message: ''
        });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      // Show more specific error message
      if (error.message && error.message.includes('Validation failed:')) {
        toast.error(error.message);
      } else if (error.message && error.message.includes('API request failed')) {
        toast.error('Validation error. Please check your input and try again.');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Get in touch with us for admissions, course details, or any queries
            </p>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Contact Information */}
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Get In Touch
                  </h2>
                  <p className="text-gray-600 text-lg mb-8">
                    Ready to start your educational journey with us? Contact us today for more information about our courses and admissions.
                  </p>
                </div>

                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <Phone className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Phone</h3>
                            <p className="text-gray-600">9795546469</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Email</h3>
                            <p className="text-gray-600">info@mooninstitute.com</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Address</h3>
                            <p className="text-gray-600">The Moon Institute, Banda, Uttar Pradesh</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Office Hours</h3>
                            <p className="text-gray-600">Mon - Sat: 9:00 AM - 6:00 PM</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Send us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            First Name *
                          </label>
                          <Input 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter your first name" 
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Last Name *
                          </label>
                          <Input 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter your last name" 
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Email *
                        </label>
                        <Input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email" 
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Phone Number *
                        </label>
                        <Input 
                          type="tel" 
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number" 
                          maxLength={10}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Course Interest *
                        </label>
                        <select 
                          name="courseInterest"
                          value={formData.courseInterest}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Select a course</option>
                          <option value="upboard">UP Board (Class 9-12)</option>
                          <option value="cbse">CBSE (Class 9-12)</option>
                          <option value="spoken">Spoken English</option>
                          <option value="jee-neet">IIT-JEE & NEET</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Message *
                        </label>
                        <Textarea 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your requirements or questions"
                          rows={4}
                          required
                        />
                      </div>

                      <Button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-700 hover:to-purple-900 text-white py-3"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending Message...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Find Us Here
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.9212347426533!2d80.35151277484644!3d25.474305420421967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399ccfef9a91bfb7%3A0xd295311f46a58b34!2sTHE%20MOON%20INSTITUTE%20RUN%20BY%20GURU%20SHARMA(ENGLISH)!5e0!3m2!1sen!2sin!4v1755244878264!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="The Moon Institute Location"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <ReviewsSection />
      </main>
    </div>
  );
};

export default Contact;