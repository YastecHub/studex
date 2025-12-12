import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    // Simple login validation (in real app, this would be API call)
    if (formData.email && formData.password) {
      navigate('/home');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-2xl mx-auto px-8 py-16">
        <div className="text-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center mb-6 mx-auto shadow-xl">
            <img src="./Rectangle 2.png" alt="StuDex Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome Back</h1>
          <p className="text-gray-600 text-2xl">Sign in to your StuDex account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-12 space-y-8">
          <div>
            <label className="block text-base font-bold text-gray-800 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-4 text-base pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-base text-gray-600">Remember me</span>
            </label>
            <button type="button" className="text-base text-blue-600 hover:text-blue-700 transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl text-xl font-semibold shadow-2xl shadow-blue-200 hover:shadow-3xl hover:scale-105 transition-all duration-300"
          >
            Sign In
          </button>

          <div className="text-center">
            <span className="text-gray-500 text-lg">Don't have an account? </span>
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="text-blue-600 font-semibold text-lg hover:text-blue-700 transition-colors"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};