import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { login } from '../services/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        navigate('/home');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error: any) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center mb-4 lg:mb-6 mx-auto rounded-2xl bg-white shadow-lg">
            <img src="/logo.png" alt="StuDex Logo" className="w-full h-full object-contain p-2" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-3">Welcome Back</h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Sign in to your StuDex account</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-4 sm:space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="you@example.com"
              disabled={loading}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
              <span>•</span> {errors.email}
            </p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm pr-10 sm:pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 sm:right-3 top-2 sm:top-3 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-1"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
              <span>•</span> {errors.password}
            </p>}
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 accent-blue-600"
                disabled={loading}
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <button 
              type="button" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 sm:mt-8"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Signup Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <span className="text-gray-600 text-sm">Don't have an account? </span>
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Sign up
            </button>
          </div>
        </form>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6 sm:mt-8">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
};