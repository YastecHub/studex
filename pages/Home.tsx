import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { AIChatbot } from '../components/AIChatbot';
import { HireModal } from '../components/HireModal';
import { useUser } from '../UserContext';
import { UserRole } from '../types';
import { CATEGORIES, CURRENT_USER } from '../constants';
import { getServices } from '../services/api';
import { Search, Sparkles, Star, MapPin, DollarSign, Clock, CheckCircle, Briefcase, BookOpen, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { userData, userRole, profileMode, setProfileMode, isHybridMode } = useUser();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hireModal, setHireModal] = useState<{ isOpen: boolean; freelancerName: string; serviceTitle: string }>({ 
    isOpen: false, 
    freelancerName: '', 
    serviceTitle: '' 
  });
  
  const displayName = userData?.username || userData?.firstName || CURRENT_USER.name.split(' ')[0];
  const userAvatar = userData?.profileImageUrl || CURRENT_USER.avatar;
  const userName = userData?.username || CURRENT_USER.name;
  const userRoleDisplay = userData?.skillCategory || (isHybridMode ? 'Hybrid User' : 'User');
  
  const openHireModal = (freelancerName: string, serviceTitle: string) => {
    setHireModal({ isOpen: true, freelancerName, serviceTitle });
  };
  
  const closeHireModal = () => {
    setHireModal({ isOpen: false, freelancerName: '', serviceTitle: '' });
  };

  useEffect(() => {
    const fetchServices = async () => {
      if (!searchQuery && activeCategory === 'All') {
        setLoading(false);
        return;
      }
      
      try {
        const result = await getServices({
          page: 1,
          limit: 6,
          category: activeCategory,
          search: searchQuery
        });
        
        if (result.success) {
          setServices(result.data.services || []);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchServices, 300);
    return () => clearTimeout(timeoutId);
  }, [activeCategory, searchQuery]);

  const filteredServices = services;
  
  // Freelancer stats
  const freelancerStats = {
    earnings: 125000,
    jobsInProgress: 3,
    completedJobs: 12
  };

  const LEARNING_COURSES = [
    {
      id: 1,
      title: 'How to Bake Cake',
      description: 'Master the art of cake baking from basic sponge to professional decorating techniques',
      price: 2000,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=250&fit=crop',
      instructor: 'Chef Sarah',
      duration: '3 hours',
      rating: 4.9
    },
    {
      id: 2,
      title: 'Web Development Basics',
      description: 'Learn HTML, CSS, and JavaScript fundamentals to build your first website',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      instructor: 'John Dev',
      duration: '5 hours',
      rating: 4.8
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      description: 'Complete guide to social media marketing, SEO, and online advertising',
      price: 1900,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
      instructor: 'Maria Lopez',
      duration: '4 hours',
      rating: 4.7
    },
    {
      id: 4,
      title: 'Photography Fundamentals',
      description: 'Learn composition, lighting, and editing to take stunning photos',
      price: 1700,
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=250&fit=crop',
      instructor: 'David Kim',
      duration: '3.5 hours',
      rating: 4.6
    },
    {
      id: 5,
      title: 'Graphic Design Essentials',
      description: 'Master Photoshop and design principles for creating professional graphics',
      price: 1600,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
      instructor: 'Lisa Chen',
      duration: '4.5 hours',
      rating: 4.8
    },
    {
      id: 6,
      title: 'Content Writing Skills',
      description: 'Write compelling content for blogs, social media, and marketing campaigns',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop',
      instructor: 'Alex Writer',
      duration: '2.5 hours',
      rating: 4.5
    }
  ];

  // Show freelancer dashboard if user is freelancer or hybrid in freelancer mode
  if (userRole === UserRole.FREELANCER || (isHybridMode && profileMode === 'freelancer')) {
    return (
      <Layout>
        <div className="p-4 lg:p-8 space-y-4 lg:space-y-8">
          {/* Dual Mode Switcher for Hybrid Users */}
          {isHybridMode && (
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
                <button
                  onClick={() => setProfileMode('freelancer')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    profileMode === 'freelancer'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Search size={18} />
                  Freelancer Mode
                </button>
                <button
                  onClick={() => setProfileMode('client')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    profileMode === 'client'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase size={18} />
                  Client Mode
                </button>
              </div>
            </div>
          )}

          {/* Freelancer Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-xl lg:text-3xl font-bold text-gray-900">Hello, {displayName} 👋</h1>
              <p className="text-gray-600 text-sm lg:text-lg mt-1">
                {isHybridMode ? 'Freelancer Mode' : 'Ready to find your next project?'}
              </p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userRoleDisplay}</p>
              </div>
              <img 
                src={userAvatar} 
                alt="Profile" 
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => navigate('/profile')}
              />
            </div>
          </div>

          {/* Freelancer Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Earnings</p>
                  <p className="text-3xl font-bold">₦{freelancerStats.earnings.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <DollarSign size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Jobs in Progress</p>
                  <p className="text-3xl font-bold">{freelancerStats.jobsInProgress}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Clock size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Completed Jobs</p>
                  <p className="text-3xl font-bold">{freelancerStats.completedJobs}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 lg:left-5 top-3 lg:top-4 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search for jobs, projects..."
              className="w-full pl-10 lg:pl-14 pr-4 lg:pr-6 py-3 lg:py-4 bg-white border border-gray-200 rounded-xl lg:rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm lg:text-lg transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white flex justify-between items-center shadow-2xl shadow-blue-200/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles size={20} className="text-yellow-300" />
                <span className="text-sm font-bold uppercase tracking-wider text-blue-100">AI Recommended Jobs</span>
              </div>
              <p className="font-bold text-2xl mb-1">Perfect matches for your skills</p>
              <p className="text-blue-100 text-lg">Based on your portfolio and expertise.</p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl text-lg font-medium transition-all hover:scale-105">
              View All Jobs
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  whitespace-nowrap px-6 py-3 rounded-2xl text-base font-medium transition-all hover:scale-105
                  ${activeCategory === cat 
                    ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg shadow-gray-300' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Available Jobs */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
              <button className="text-blue-600 text-lg font-medium hover:text-blue-700 transition-colors">See all →</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                    <div className="h-3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                filteredServices.map(service => (
                  <div 
                    key={service.id} 
                    onClick={() => navigate(`/service/${service.id}`)}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 group"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <img alt="Client Avatar" src={service.freelancerAvatar || 'https://picsum.photos/seed/default/200/200'} className="w-6 h-6 rounded-full" />
                          <span className="font-medium">Client</span>
                        </div>
                        {service.aiMatchScore && (
                          <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {service.aiMatchScore}% Match
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
                        {service.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MapPin size={16} />
                        <span>Campus</span>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <p className="font-bold text-blue-600 text-xl">
                          ₦{service.price?.toLocaleString()}
                          <span className="text-gray-400 text-sm font-normal ml-1">
                            {service.priceType === 'NEGOTIABLE' ? '(Negotiable)' : ''}
                          </span>
                        </p>
                        <div className="flex items-center text-yellow-500 text-sm font-bold gap-1">
                          <Star size={16} fill="currentColor" />
                          {service.rating || 4.8}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Learning Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-3">
                <BookOpen size={28} className="text-purple-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Learn New Skills</h2>
                  <p className="text-gray-600">Expand your expertise with our courses</p>
                </div>
              </div>
              <button className="text-purple-600 text-lg font-medium hover:text-purple-700 transition-colors">View All →</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {LEARNING_COURSES.slice(0, 3).map(course => (
                <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-t-2xl"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-t-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play size={24} className="text-purple-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ₦{course.price.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{course.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 text-xs font-bold">{course.instructor[0]}</span>
                        </div>
                        <span>{course.instructor}</span>
                      </div>
                      <span>{course.duration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="font-bold text-gray-900">{course.rating}</span>
                      </div>
                      <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <AIChatbot />
          <HireModal 
            isOpen={hireModal.isOpen}
            onClose={closeHireModal}
            freelancerName={hireModal.freelancerName}
            serviceTitle={hireModal.serviceTitle}
          />
        </div>
      </Layout>
    );
  }
  
  // Client view (existing code)
  return (
    <Layout>
      <div className="p-8 space-y-8">
        {/* Dual Mode Switcher for Hybrid Users */}
        {isHybridMode && (
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <button
                onClick={() => setProfileMode('freelancer')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  profileMode === 'freelancer'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Search size={18} />
                Freelancer Mode
              </button>
              <button
                onClick={() => setProfileMode('client')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  profileMode === 'client'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Briefcase size={18} />
                Client Mode
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hello, {displayName} 👋</h1>
            <p className="text-gray-600 text-lg mt-1">
              {isHybridMode ? 'Client Mode - What do you need help with today?' : 'What do you need help with today?'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userRoleDisplay}</p>
            </div>
            <img 
              src={userAvatar} 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate('/profile')}
            />
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-5 top-4 text-gray-400" size={22} />
          <input 
            type="text"
            placeholder="Search for services, freelancers, or projects..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none text-lg transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* AI Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white flex justify-between items-center shadow-2xl shadow-blue-200/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={20} className="text-yellow-300" />
              <span className="text-sm font-bold uppercase tracking-wider text-blue-100">AI Powered Recommendations</span>
            </div>
            <p className="font-bold text-2xl mb-1">Top picks curated for you</p>
            <p className="text-blue-100 text-lg">Based on your skills, preferences, and recent activity.</p>
          </div>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl text-lg font-medium transition-all hover:scale-105">
            Explore All
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                whitespace-nowrap px-6 py-3 rounded-2xl text-base font-medium transition-all hover:scale-105
                ${activeCategory === cat 
                  ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg shadow-gray-300' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Popular Services - Only for Client Users */}
        {(userRole === UserRole.CLIENT || (isHybridMode && profileMode === 'client')) && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-bold text-gray-900">Popular Services</h2>
              <button className="text-blue-600 text-lg font-medium hover:text-blue-700 transition-colors">See all →</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {[
                {
                  id: 1,
                  image: 'Frontend Dev.jpg',
                  title: 'Frontend Development',
                  description: 'Build responsive websites and web applications with modern frameworks'
                },
                {
                  id: 2,
                  image: 'photographer.jpg',
                  title: 'Photography Services',
                  description: 'Professional photography for events, portraits, and commercial projects'
                },
                {
                  id: 3,
                  image: 'fashionDesigner.jpg',
                  title: 'Fashion Design',
                  description: 'Custom clothing design and fashion consulting services'
                },
                {
                  id: 4,
                  image: 'MakeupArtist .jpg',
                  title: 'Makeup Artist',
                  description: 'Professional makeup services for events, photoshoots, and special occasions'
                },
                {
                  id: 5,
                  image: 'TutorStudentResearch.jpg',
                  title: 'Academic Tutoring',
                  description: 'Expert tutoring and research assistance for students'
                },
                {
                  id: 6,
                  image: 'ArtistSongwriterPianist.jpg',
                  title: 'Music & Arts',
                  description: 'Music composition, songwriting, and artistic services'
                },
                {
                  id: 7,
                  image: 'model.jpg',
                  title: 'Modeling Services',
                  description: 'Professional modeling for fashion, commercial, and artistic projects'
                },
                {
                  id: 8,
                  image: 'peronalshopper.jpg',
                  title: 'Personal Shopping',
                  description: 'Curated shopping experiences and style consultation'
                }
              ].map(service => (
                <div 
                  key={service.id}
                  className="bg-white rounded-2xl lg:rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 group overflow-hidden"
                >
                  <div className="relative w-full h-40 sm:h-48">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-4 lg:p-6 space-y-3">
                    <h3 className="font-bold text-gray-900 text-base lg:text-lg line-clamp-1">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openHireModal('Service Provider', service.title);
                        }}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/service/${service.id}`);
                        }}
                        className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service List - For all users */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold text-gray-900">
              {(userRole === UserRole.CLIENT || (isHybridMode && profileMode === 'client')) ? 'All Services' : 'Available Services'}
            </h2>
            <button className="text-blue-600 text-lg font-medium hover:text-blue-700 transition-colors">See all →</button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              filteredServices.map(service => (
                <div 
                  key={service.id} 
                  onClick={() => navigate(`/service/${service.id}`)}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 group"
                >
                  <div className="relative w-full h-48 mb-4">
                    <img 
                      src={service.portfolioImages?.[0] || 'https://picsum.photos/seed/service/400/300'} 
                      alt={service.title} 
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    {service.aiMatchScore && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-lg">
                        {service.aiMatchScore}% Match
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <img alt="Freelancer Avatar" src={service.freelancerAvatar || 'https://picsum.photos/seed/default/200/200'} className="w-6 h-6 rounded-full" />
                        <span className="font-medium">{service.freelancerName || 'Freelancer'}</span>
                      </div> 
                      <div className="flex items-center text-yellow-500 text-sm font-bold gap-1">
                        <Star size={16} fill="currentColor" />
                        {service.rating || 4.8}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
                      {service.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <MapPin size={16} />
                      <span>Campus</span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <p className="font-bold text-blue-600 text-xl">
                        ₦{service.price?.toLocaleString()}
                        <span className="text-gray-400 text-sm font-normal ml-1">
                          {service.priceType === 'NEGOTIABLE' ? '(Est.)' : ''}
                        </span>
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openHireModal(service.freelancerName || 'Freelancer', service.title);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Hire Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {!loading && filteredServices.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-500">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search size={32} className="text-gray-400" />
                </div>
                <p className="text-xl font-medium mb-2">No services found</p>
                <p className="text-gray-400">Try adjusting your search criteria or browse different categories.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <AIChatbot />
      <HireModal 
        isOpen={hireModal.isOpen}
        onClose={closeHireModal}
        freelancerName={hireModal.freelancerName}
        serviceTitle={hireModal.serviceTitle}
      />
    </Layout>
  );
};