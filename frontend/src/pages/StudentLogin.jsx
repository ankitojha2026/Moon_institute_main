import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { studentAPI } from "../services/api";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    password: ""
  });

  // Check if student is already logged in
  useEffect(() => {
    const studentToken = localStorage.getItem('studentToken');
    if (studentToken) {
      navigate('/student-data');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call student login API
      const response = await studentAPI.login(formData);
      
      if (response.success) {
        // Store student data (no token needed for simple auth)
        localStorage.setItem('studentToken', 'student_logged_in');
        localStorage.setItem('studentData', JSON.stringify(response.data));
        
        toast.success('Login successful! Welcome back!');
        navigate('/student-data');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid student name or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center p-4 relative">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6">
        <Link to="/">
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </div>
      
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/images/efb325c5-2d6a-4440-a05d-13950ca4d29c.png" 
              alt="The Moon Institute Logo" 
              className="w-16 h-16 object-contain rounded-full"
            />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">THE MOON INSTITUTE</h1>
              <p className="text-blue-200 text-sm">Student Portal</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-blue-100">Sign in to access your student dashboard</p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Student Login
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                             {/* Student Name Field */}
               <div className="space-y-2">
                 <Label htmlFor="studentName" className="text-sm font-medium text-gray-700">
                   Student Name
                 </Label>
                 <div className="relative">
                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                   <Input
                     id="studentName"
                     name="studentName"
                     type="text"
                     placeholder="Enter your student name"
                     value={formData.studentName}
                     onChange={handleInputChange}
                     className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary"
                     required
                   />
                 </div>
               </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-primary focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-700 hover:to-purple-900 text-white font-semibold disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            © 2024 The Moon Institute. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
