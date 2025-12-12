import React, { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useUser } from '../UserContext';
import { UserRole } from '../types';
import { 
  Edit3, 
  MapPin, 
  Star, 
  Calendar, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock,
  Camera,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Settings,
  Shield,
  Bell,
  Briefcase,
  FileText,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Skill {
  name: string;
  level: number;
  verified: boolean;
}

interface Review {
  id: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  comment: string;
  date: string;
  projectTitle: string;
}

const MOCK_SKILLS: Skill[] = [
  { name: 'React', level: 95, verified: true },
  { name: 'TypeScript', level: 90, verified: true },
  { name: 'Node.js', level: 85, verified: false },
  { name: 'UI/UX Design', level: 80, verified: true },
  { name: 'Python', level: 75, verified: false }
];

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    rating: 5,
    comment: 'Excellent work! Delivered exactly what I needed on time.',
    date: '2 weeks ago',
    projectTitle: 'E-commerce Website'
  },
  {
    id: '2',
    clientName: 'Mike Chen',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 5,
    comment: 'Great communication and quality work. Highly recommended!',
    date: '1 month ago',
    projectTitle: 'Mobile App Design'
  }
];

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, userData, setUserData } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(userData?.profileImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    setUserData(null);
    navigate('/login');
  };

  // Different tabs for freelancers vs clients
  const freelancerTabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'portfolio', label: 'Portfolio', icon: Award },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];
  
  const clientTabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'jobs', label: 'Posted Jobs', icon: Briefcase },
    { id: 'history', label: 'Hiring History', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];
  
  const tabs = userRole === UserRole.FREELANCER ? freelancerTabs : clientTabs;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setProfileImagePreview(imageUrl);
        if (userData) {
          setUserData({
            ...userData,
            profileImageUrl: imageUrl,
            profileImage: file
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Profile Header */}
        <div className={`rounded-3xl p-8 text-white relative overflow-hidden ${
          userRole === UserRole.FREELANCER 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
            : 'bg-gradient-to-r from-purple-600 to-pink-600'
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative flex items-start gap-6">
            <div className="relative">
              {profileImagePreview || userData?.profileImageUrl ? (
                <img
                  src={profileImagePreview || userData?.profileImageUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl border-4 border-white/20 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {userData?.firstName?.[0] || 'U'}
                  </span>
                </div>
              )}
              <button 
                onClick={handleProfileImageClick}
                title="Change profile picture"
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-gray-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:bg-gray-50"
              >
                <Camera size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
                aria-label="Upload profile picture"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{userData?.firstName} {userData?.lastName}</h1>
                  <p className={`text-lg mb-2 ${
                    userRole === UserRole.FREELANCER ? 'text-blue-100' : 'text-purple-100'
                  }`}>
                    {userRole === UserRole.FREELANCER 
                      ? (userData?.bio || 'Full-Stack Developer & UI/UX Designer')
                      : 'Project Manager & Client'
                    }
                  </p>
                  <div className={`flex items-center gap-4 ${
                    userRole === UserRole.FREELANCER ? 'text-blue-100' : 'text-purple-100'
                  }`}>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>Lagos, Nigeria</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Joined March 2023</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-red-100 hover:text-white"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
              
              {/* Role-based Stats */}
              {userRole === UserRole.FREELANCER ? (
                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">4.9</div>
                    <div className="text-blue-100 text-base">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">47</div>
                    <div className="text-blue-100 text-base">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">₦2.5M</div>
                    <div className="text-blue-100 text-base">Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">98%</div>
                    <div className="text-blue-100 text-base">Success Rate</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">12</div>
                    <div className="text-purple-100 text-base">Jobs Posted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">8</div>
                    <div className="text-purple-100 text-base">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">₦850K</div>
                    <div className="text-purple-100 text-base">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">4.8</div>
                    <div className="text-purple-100 text-base">Client Rating</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-gray-100 p-2 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* About */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">About Me</h3>
                  <p className="text-gray-600 leading-relaxed mb-4 text-lg">
                    {userRole === UserRole.FREELANCER 
                      ? (userData?.bio || 'Passionate full-stack developer with 5+ years of experience creating beautiful, functional web applications. I specialize in React, Node.js, and modern web technologies.')
                      : 'Experienced project manager with a track record of successfully delivering complex projects on time and within budget. I work with talented freelancers to bring ideas to life.'
                    }
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {userRole === UserRole.FREELANCER ? (
                      <>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Available for hire</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Quick responder</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Top rated</span>
                      </>
                    ) : (
                      <>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Active client</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Fast payments</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Clear requirements</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Role-specific content */}
                {userRole === UserRole.FREELANCER ? (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Skills & Expertise</h3>
                    <div className="space-y-4">
                      {(userData?.skills || MOCK_SKILLS.map(s => s.name)).slice(0, 5).map((skill, index) => (
                        <div key={typeof skill === 'string' ? skill : skill} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 text-lg">{typeof skill === 'string' ? skill : skill}</span>
                              <Shield size={16} className="text-green-500" />
                            </div>
                            <span className="text-base text-gray-500">{90 + index * 2}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${90 + index * 2}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                        <CheckCircle size={20} className="text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-lg">E-commerce Website Completed</p>
                          <p className="text-base text-gray-500">2 days ago • ₦25,000</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                        <Clock size={20} className="text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-lg">Mobile App Design In Progress</p>
                          <p className="text-base text-gray-500">Started 5 days ago • ₦15,000</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                        <Briefcase size={20} className="text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-lg">Content Writing Project Posted</p>
                          <p className="text-base text-gray-500">1 week ago • 4 applicants</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {(activeTab === 'reviews' && userRole === UserRole.FREELANCER) && (
              <div className="space-y-4">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.clientAvatar}
                        alt={review.clientName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.clientName}</h4>
                            <p className="text-sm text-gray-500">{review.projectTitle}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-xs text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {(activeTab === 'jobs' && userRole === UserRole.CLIENT) && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Posted Jobs</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">E-commerce Website Development</h4>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Completed</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">Modern e-commerce site with payment integration</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Posted 2 weeks ago</span>
                        <span>₦25,000</span>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">Mobile App UI Design</h4>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">In Progress</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">Clean mobile app interface design</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Posted 1 week ago</span>
                        <span>₦15,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {(activeTab === 'history' && userRole === UserRole.CLIENT) && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Hiring History</h3>
                  <div className="space-y-4">
                    {MOCK_REVIEWS.map((review) => (
                      <div key={review.id} className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.clientAvatar}
                            alt={review.clientName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{review.clientName}</h4>
                                <p className="text-sm text-gray-500">{review.projectTitle}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-1">
                                  {renderStars(review.rating)}
                                </div>
                                <p className="text-xs text-gray-500">{review.date}</p>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-green-500" />
                    <span className="text-gray-600">Response Time</span>
                  </div>
                  <span className="font-semibold text-gray-900">&lt; 1 hour</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    <span className="text-gray-600">Delivery Time</span>
                  </div>
                  <span className="font-semibold text-gray-900">2-3 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-yellow-500" />
                    <span className="text-gray-600">Starting Price</span>
                  </div>
                  <span className="font-semibold text-gray-900">₦50,000</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">alex@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-600">+234 801 234 5678</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-gray-400" />
                  <span className="text-gray-600">alexthompson.dev</span>
                </div>
                <div className="flex items-center gap-3">
                  <Github size={16} className="text-gray-400" />
                  <span className="text-gray-600">@alexthompson</span>
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin size={16} className="text-gray-400" />
                  <span className="text-gray-600">Alex Thompson</span>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className="text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">New project inquiry</p>
                  <p className="text-xs text-blue-600">2 minutes ago</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm font-medium text-green-900">Payment received</p>
                  <p className="text-xs text-green-600">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};