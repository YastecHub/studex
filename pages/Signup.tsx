import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { UserRole } from '../types';
import { X, Upload, Plus, Camera } from 'lucide-react';
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
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'PHP',
  'UI/UX Design', 'Graphic Design', 'Photoshop', 'Figma', 'Adobe Illustrator',
  'Content Writing', 'Copywriting', 'SEO', 'Social Media Marketing',
  'Photography', 'Video Editing', 'Animation', 'WordPress', 'Shopify',
  'Mobile Development', 'Flutter', 'React Native', 'iOS', 'Android',
  'Data Analysis', 'Machine Learning', 'Excel', 'PowerBI', 'SQL'
];

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, setUserData } = useUser();
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    const basicFields = [formData.firstName, formData.lastName, formData.email, formData.department, formData.level, formData.matricNo, formData.username];
    if (!basicFields.every(value => value.trim())) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!password.trim() || password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    // Freelancer-specific validation
    if (userRole === UserRole.FREELANCER || userRole === UserRole.HYBRID) {
      if (!formData.bio.trim()) {
        alert('Please add a professional bio');
        return;
      }
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
      apiFormData.append('skillCategory', userRole);
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
        
        navigate('/home');
      } else {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).join('\n');
          alert(errorMessages);
        } else {
          alert(result.message || 'Registration failed');
        }
      }
    } catch (error) {
      alert('Network error. Please try again.');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-2xl mx-auto px-8 py-16">
        <div className="text-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center mb-6 mx-auto shadow-xl">
            <img src="/Rectangle 2.png" alt="StuDex Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Complete Your Profile</h1>
          <p className="text-gray-600 text-2xl">You're signing up as a <span className="font-semibold text-blue-600">{getRoleTitle()}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Profile Image Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={32} className="text-gray-400" />
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
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Camera size={18} />
              </label>
              {profileImagePreview && (
                <button
                  type="button"
                  onClick={removeProfileImage}
                  title="Remove profile picture"
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="text-center mb-6">
            <p className="text-base text-gray-600">Upload your profile picture (Optional)</p>
            <p className="text-sm text-gray-500">JPG, PNG or GIF (Max 5MB) - Can be added later in profile</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

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
            <label className="block text-base font-bold text-gray-800 mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select your department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Medicine">Medicine</option>
              <option value="Law">Law</option>
              <option value="Arts">Arts</option>
              <option value="Sciences">Sciences</option>
              <option value="Social Sciences">Social Sciences</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select level</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
                <option value="600">600 Level</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">Matric No</label>
              <input
                type="text"
                name="matricNo"
                value={formData.matricNo}
                onChange={handleChange}
                className="w-full px-4 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g. CSC/2023/001"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Choose a unique username"
              required
            />
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Create a password (min 6 characters)"
              required
              minLength={6}
            />
          </div>

          {/* Freelancer-specific fields */}
          {(userRole === UserRole.FREELANCER || userRole === UserRole.HYBRID) && (
            <>
              {/* Bio */}
              <div>
                <label className="block text-base font-bold text-gray-800 mb-2">Professional Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell clients about your skills and experience..."
                  required
                />
              </div>

              {/* Skills Selection */}
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">Select Your Skills</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-4">
                  {AVAILABLE_SKILLS.map(skill => (
                    <label key={skill} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-base text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Select skills that best describe your expertise (can be updated later in profile)</p>
              </div>

              {/* Portfolio Upload */}
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">Upload Portfolio (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mov"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="portfolio-upload"
                  />
                  <label htmlFor="portfolio-upload" className="cursor-pointer">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600 font-medium text-base">Click to upload portfolio files</p>
                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, Images, Videos (Max 10MB each) - Can be added later in profile</p>
                  </label>
                </div>
                
                {/* Uploaded Files */}
                {portfolioFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                    {portfolioFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Upload size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl text-xl font-semibold shadow-2xl shadow-blue-200 hover:shadow-3xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Complete Registration →'}
          </button>
        </form>
      </div>
    </div>
  );
};