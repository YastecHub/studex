import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useToast } from '../contexts/ToastContext';
import { UserRole } from '../types';
import { X, Upload, Loader, Camera } from 'lucide-react';
import { signup } from '../services/api';

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  level: string;
  matricNo: string;
  username: string;
  skills: string[];
  portfolioFiles: File[];
  bio: string;
  profileImage: File | null;
}

const AVAILABLE_SKILLS = [
  'Web Development', 'Mobile Development', 'UI/UX Design', 'Graphic Design',
  'Content Writing', 'Digital Marketing', 'Photography', 'Video Editing',
  'Data Analysis', 'Tutoring', 'Translation', 'Virtual Assistant'
];

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, setUserData } = useUser();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<SignupData>({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    level: '',
    matricNo: '',
    username: '',
    skills: [],
    portfolioFiles: [],
    bio: '',
    profileImage: null
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors: Record<string, string> = {};
    const basicFields = [formData.firstName, formData.lastName, formData.email, formData.department, formData.level, formData.matricNo, formData.username];
    
    if (!basicFields.every(value => value.trim())) {
      showToast('error', 'Missing Required Fields', 'Please fill in all required fields');
      return;
    }
    
    if (!formData.email.includes('@')) {
      validationErrors.email = 'Please enter a valid email address';
    }
    
    if (!password.trim() || password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }
    
    // Freelancer-specific validation
    if (userRole === UserRole.FREELANCER || userRole === UserRole.HYBRID) {
      if (!formData.bio.trim()) {
        validationErrors.bio = 'Please add a professional bio';
      }
    }
    
    if (Object.keys(validationErrors).length > 0) {
      const errorMessage = Object.values(validationErrors)[0];
      showToast('error', 'Validation Error', errorMessage);
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    try {
      const apiFormData = new FormData();
      apiFormData.append('matric', formData.matricNo);
      apiFormData.append('email', formData.email);
      apiFormData.append('password', password);
      apiFormData.append('firstName', formData.firstName);
      apiFormData.append('lastName', formData.lastName);
      apiFormData.append('username', formData.username);
      apiFormData.append('schoolName', formData.department);
      // Map frontend UserRole to backend skillCategory format
      const skillCategoryMap = {
        [UserRole.CLIENT]: 'Client',
        [UserRole.FREELANCER]: 'Freelancer', 
        [UserRole.HYBRID]: 'Hybrid'
      };
      apiFormData.append('skillCategory', skillCategoryMap[userRole]);
      apiFormData.append('interests', JSON.stringify(selectedSkills));
      
      if (formData.profileImage) {
        apiFormData.append('profileImage', formData.profileImage);
      }
      
      const result = await signup(apiFormData);
      
      if (result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        // Update current user in constants
        const { updateCurrentUser } = await import('../constants');
        updateCurrentUser({
          ...formData,
          profileImageUrl: result.data.user.profileImage,
          userRole
        });
        
        setUserData({
          ...formData,
          profileImageUrl: result.data.user.profileImage,
          userRole
        });
        
        showToast('success', 'Account Created!', 'Welcome to StuDex. Redirecting...');
        setTimeout(() => navigate('/home'), 1500);
      } else {
        if (result.errors) {
          const errorList = Object.entries(result.errors)
            .map(([, value]) => value)
            .join('\n');
          showToast('error', 'Registration Failed', errorList);
        } else {
          showToast('error', 'Registration Failed', result.message || 'Please check your information and try again');
        }
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Please check your connection and try again';
      showToast('error', 'Connection Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => {
      const updated = prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill];
      setFormData(prevForm => ({ ...prevForm, skills: updated }));
      return updated;
    });
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPortfolioFiles(prev => {
      const updated = [...prev, ...files];
      setFormData(prevForm => ({ ...prevForm, portfolioFiles: updated }));
      return updated;
    });
  };
  
  const removeFile = (index: number) => {
    setPortfolioFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      setFormData(prevForm => ({ ...prevForm, portfolioFiles: updated }));
      return updated;
    });
  };
  
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeProfileImage = () => {
    setFormData(prev => ({ ...prev, profileImage: null }));
    setProfileImagePreview(null);
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case UserRole.CLIENT: return 'Client';
      case UserRole.FREELANCER: return 'Freelancer';
      case UserRole.HYBRID: return 'Hybrid';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8">
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center mb-6 lg:mb-8">
          <div className="w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center mb-4 lg:mb-6 mx-auto shadow-xl">
            <img src="/logo.png" alt="StuDex Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-2 lg:mb-4">Complete Your Profile</h1>
          <p className="text-gray-600 text-sm sm:text-lg lg:text-2xl">You're signing up as a <span className="font-semibold text-blue-600">{getRoleTitle()}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4">
          {/* Profile Image Upload */}
          <div className="flex justify-center mb-4 lg:mb-6">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={24} className="text-gray-400 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
                id="profile-image-upload"
                aria-label="Upload profile picture"
              />
              <label
                htmlFor="profile-image-upload"
                title="Upload profile picture"
                className="absolute -bottom-2 -right-2 w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                <Upload size={16} className="text-white lg:w-5 lg:h-5" />
              </label>
              {profileImagePreview && (
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute -top-2 -right-2 w-6 h-6 lg:w-8 lg:h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X size={12} className="text-white lg:w-4 lg:h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Matric Number *</label>
              <input
                type="text"
                name="matricNo"
                value={formData.matricNo}
                onChange={handleChange}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                required
              >
                <option value="">Select Level</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
            </div>
          </div>

          {/* Skills Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills & Interests</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_SKILLS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    selectedSkills.includes(skill)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Bio for Freelancers */}
          {(userRole === UserRole.FREELANCER || userRole === UserRole.HYBRID) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio *</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base resize-none"
                placeholder="Tell clients about your experience and expertise..."
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 lg:py-4 px-6 rounded-xl font-semibold text-sm lg:text-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};