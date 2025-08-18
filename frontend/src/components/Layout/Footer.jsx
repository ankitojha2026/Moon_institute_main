import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/efb325c5-2d6a-4440-a05d-13950ca4d29c.png" 
                alt="The Moon Institute Logo" 
                className="w-10 h-10 object-contain rounded-full"
              />
              <h3 className="text-xl font-bold">THE MOON INSTITUTE</h3>
            </div>
            <p className="text-blue-200 text-sm">
              Empowering young minds with quality education and excellence in learning.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-blue-200 hover:text-accent transition-colors text-sm">
                Home
              </Link>
              <Link to="/about" className="block text-blue-200 hover:text-accent transition-colors text-sm">
                About
              </Link>
              <Link to="/contact" className="block text-blue-200 hover:text-accent transition-colors text-sm">
                Contact
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Courses</h4>
            <div className="space-y-2">
              <p className="text-blue-200 text-sm">CBSE (Class 9-12)</p>
              <p className="text-blue-200 text-sm">UP Board (Class 9-12)</p>
              <p className="text-blue-200 text-sm">Spoken English</p>
              <p className="text-blue-200 text-sm">IIT-JEE & NEET</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-blue-200 text-sm">9795546469</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-blue-200 text-sm">info@mooninstitute.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-blue-200 text-sm">Banda, UP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white mt-8 pt-8 text-center">
          <p className="text-blue-200 text-sm">
            © 2024 The Moon Institute • Designed for Excellence in Education
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;