import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ReviewsSection from "@/components/Contact/ReviewsSection"; 
import { motion } from "framer-motion";

const MapAndContactInfo = () => {
    return (
        <div className="min-h-screen">
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-800 text-white py-10">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl font-bold mb-1">Reach Out to Us</h1>
                    </div>
                </section>

                {/* Contact Information & Map */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <motion.div 
                            className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* ✅ Get In Touch */}
                            <motion.div 
                                className="space-y-8 order-1 lg:order-1"
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
                                    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
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

                                    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
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

                                    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
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

                                    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
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

                            {/* ✅ Map Section */}
                            <motion.div 
                                className="order-2 lg:order-2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <div className="rounded-lg overflow-hidden shadow-lg h-full">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.9212347426533!2d80.35151277484644!3d25.474305420421967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399ccfef9a91bfb7%3A0xd295311f46a58b34!2sTHE%20MOON%20INSTITUTE%20RUN%20BY%20GURU%20SHARMA(ENGLISH)!5e0!3m2!1sen!2sin!4v1755244878264!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, minHeight: "450px" }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="The Moon Institute Location"
                                    ></iframe>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

              
            </main>
        </div>
    );
};

export default MapAndContactInfo;
