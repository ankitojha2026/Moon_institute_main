import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gray-100 text-black shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
         
         <Link to="/" className="text-2xl font-bold text-black">

          <div className="flex items-center space-x-3">
            <img 
              src="/images/logo.png" 
              alt="The Moon Institute Logo" 
              className="w-12 h-12 object-contain rounded-full"
            />
            <div>
              <h1 className="text-xl font-bold">THE MOON INSTITUTE</h1>
              <p className="text-xs text-gray-600">Where Learning Meets Success</p>
            </div>
          </div>

         </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`hover:text-accent transition-colors ${
                isActiveLink('/') ? 'text-accent font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`hover:text-accent transition-colors ${
                isActiveLink('/about') ? 'text-accent font-semibold' : ''
              }`}
            >
              About
            </Link>
            <Link 
              to="/courses" 
              className={`hover:text-accent transition-colors ${
                isActiveLink('/courses') ? 'text-accent font-semibold' : ''
              }`}
            >
              Courses
            </Link>
            <Link 
              to="/events" 
              className={`hover:text-accent transition-colors ${
                isActiveLink('/events') ? 'text-accent font-semibold' : ''
              }`}
            >
              Events
            </Link>
            <Link 
              to="/contact" 
              className={`hover:text-accent transition-colors ${
                isActiveLink('/contact') ? 'text-accent font-semibold' : ''
              }`}
            >
              Contact
            </Link>
            <Link to="/student-login">
              <Button variant="outline" className="bg-transparent border-black text-black hover:bg-black hover:text-white">
                StudentsLogin
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent border-black text-black hover:bg-black hover:text-white"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-50 border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    isActiveLink('/') 
                      ? 'bg-black/10 text-accent font-semibold' 
                      : 'text-black hover:bg-black/5'
                  }`}
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    isActiveLink('/about') 
                      ? 'bg-black/10 text-accent font-semibold' 
                      : 'text-black hover:bg-black/5'
                  }`}
                  onClick={closeMenu}
                >
                  About
                </Link>
                <Link 
                  to="/courses" 
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    isActiveLink('/courses') 
                      ? 'bg-black/10 text-accent font-semibold' 
                      : 'text-black hover:bg-black/5'
                  }`}
                  onClick={closeMenu}
                >
                  Courses
                </Link>
                <Link 
                  to="/events" 
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    isActiveLink('/events') 
                      ? 'bg-black/10 text-accent font-semibold' 
                      : 'text-black hover:bg-black/5'
                  }`}
                  onClick={closeMenu}
                >
                  Events
                </Link>
                <Link 
                  to="/contact" 
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    isActiveLink('/contact') 
                      ? 'bg-black/10 text-accent font-semibold' 
                      : 'text-black hover:bg-black/5'
                  }`}
                  onClick={closeMenu}
                >
                  Contact
                </Link>
                <Link to="/student-login" onClick={closeMenu}>
                  <Button 
                    variant="outline" 
                    className="w-full bg-transparent border-black text-black hover:bg-black hover:text-white"
                  >
                    StudentsLogin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;