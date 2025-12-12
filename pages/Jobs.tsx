import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { PostJobModal } from '../components/PostJobModal';
import { ApplicantsModal } from '../components/ApplicantsModal';
import { useUser } from '../UserContext';
import { UserRole } from '../types';
import { ACTIVE_JOBS, SERVICES, CURRENT_USER } from '../constants';
import { Clock, CheckCircle, AlertCircle, Plus, Users, Eye, FileText, Zap, Search, Send, Briefcase, Star } from 'lucide-react';

interface PostedJob {
  id: string;
  title: string;
  description: string;
  budget: number;
  postedDate: string;
  applicants: number;
  status: 'open' | 'closed' | 'completed';
  category: string;
}

const POSTED_JOBS: PostedJob[] = [
  {
    id: 'pj1',
    title: 'E-commerce Website Development',
    description: 'Need a modern e-commerce website with payment integration and admin dashboard.',
    budget: 25000,
    postedDate: '2 days ago',
    applicants: 4,
    status: 'open',
    category: 'Development'
  },
  {
    id: 'pj2',
    title: 'Mobile App UI/UX Design',
    description: 'Design a clean and modern mobile app interface for a food delivery service.',
    budget: 15000,
    postedDate: '5 days ago',
    applicants: 7,
    status: 'open',
    category: 'Design'
  },
  {
    id: 'pj3',
    title: 'Content Writing for Blog',
    description: 'Write 10 SEO-optimized blog posts about technology trends.',
    budget: 8000,
    postedDate: '1 week ago',
    applicants: 12,
    status: 'completed',
    category: 'Writing'
  }
];

interface JobApplication {
  id: string;
  jobTitle: string;
  clientName: string;
  clientAvatar: string;
  budget: number;
  appliedDate: string;
  status: 'pending' | 'accepted' | 'declined';
  proposal: string;
  category: string;
}

const JOB_APPLICATIONS: JobApplication[] = [
  {
    id: 'app1',
    jobTitle: 'React Developer for SaaS Platform',
    clientName: 'TechCorp Ltd',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    budget: 45000,
    appliedDate: '2 days ago',
    status: 'pending',
    proposal: 'I have 3+ years experience with React and can deliver this project within the timeline.',
    category: 'Development'
  },
  {
    id: 'app2',
    jobTitle: 'Logo Design for Startup',
    clientName: 'Sarah Johnson',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    budget: 12000,
    appliedDate: '4 days ago',
    status: 'accepted',
    proposal: 'I specialize in modern logo design and brand identity. Check my portfolio for similar work.',
    category: 'Design'
  },
  {
    id: 'app3',
    jobTitle: 'WordPress Website Development',
    clientName: 'Mike Chen',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    budget: 18000,
    appliedDate: '1 week ago',
    status: 'declined',
    proposal: 'I can create a custom WordPress theme with all the features you mentioned.',
    category: 'Development'
  },
  {
    id: 'app4',
    jobTitle: 'Mobile App UI Design',
    clientName: 'Digital Agency',
    clientAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    budget: 22000,
    appliedDate: '3 days ago',
    status: 'pending',
    proposal: 'I have extensive experience in mobile UI/UX design with a focus on user-centered design.',
    category: 'Design'
  },
  {
    id: 'app5',
    jobTitle: 'Content Writing Package',
    clientName: 'Marketing Pro',
    clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    budget: 15000,
    appliedDate: '5 days ago',
    status: 'accepted',
    proposal: 'I can write engaging, SEO-optimized content that drives traffic and conversions.',
    category: 'Writing'
  },
  {
    id: 'app6',
    jobTitle: 'Python Data Analysis',
    clientName: 'Research Institute',
    clientAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    budget: 35000,
    appliedDate: '1 week ago',
    status: 'declined',
    proposal: 'I have strong Python skills and experience with data visualization libraries.',
    category: 'Development'
  },
  {
    id: 'app7',
    jobTitle: 'Social Media Graphics',
    clientName: 'Fashion Brand',
    clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    budget: 8000,
    appliedDate: '6 days ago',
    status: 'pending',
    proposal: 'I can create eye-catching social media graphics that align with your brand aesthetic.',
    category: 'Design'
  },
  {
    id: 'app8',
    jobTitle: 'E-commerce Integration',
    clientName: 'Online Store',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    budget: 28000,
    appliedDate: '4 days ago',
    status: 'pending',
    proposal: 'I have experience integrating payment gateways and can ensure secure transactions.',
    category: 'Development'
  },
  {
    id: 'app9',
    jobTitle: 'Video Editing Project',
    clientName: 'Content Creator',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    budget: 20000,
    appliedDate: '1 week ago',
    status: 'declined',
    proposal: 'I can edit your videos with professional transitions and color grading.',
    category: 'Video'
  },
  {
    id: 'app10',
    jobTitle: 'Database Optimization',
    clientName: 'Tech Startup',
    clientAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    budget: 40000,
    appliedDate: '3 days ago',
    status: 'pending',
    proposal: 'I can optimize your database queries and improve overall system performance.',
    category: 'Development'
  }
];

export const Jobs: React.FC = () => {
  const { userRole } = useUser();
  const [activeTab, setActiveTab] = useState<'jobs-for-you' | 'all-jobs' | 'applications' | 'projects'>('jobs-for-you');
  const [subTab, setSubTab] = useState<'pending' | 'accepted' | 'declined' | 'in-progress' | 'completed'>('pending');
  const [postJobModal, setPostJobModal] = useState(false);
  const [applicantsModal, setApplicantsModal] = useState<{ isOpen: boolean; jobTitle: string }>({ isOpen: false, jobTitle: '' });
  const [postedJobs, setPostedJobs] = useState(POSTED_JOBS);
  
  const handlePostJob = (jobData: any) => {
    const newJob: PostedJob = {
      id: `pj${Date.now()}`,
      title: jobData.title,
      description: jobData.description,
      budget: parseInt(jobData.budget),
      postedDate: 'Just now',
      applicants: 0,
      status: 'open',
      category: jobData.category
    };
    setPostedJobs(prev => [newJob, ...prev]);
  };
  
  const handleAcceptApplicant = (applicantId: string) => {
    alert(`Contract created with applicant ${applicantId}! Check your contracts section.`);
    setApplicantsModal({ isOpen: false, jobTitle: '' });
  };
  
  const handleDeclineApplicant = (applicantId: string) => {
    alert(`Applicant ${applicantId} declined.`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-50 text-green-700 border-green-200';
      case 'closed': return 'bg-red-50 text-red-700 border-red-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  
  // Show different content based on user role
  if (userRole === UserRole.CLIENT) {
    return (
      <Layout>
        <div className="p-8 space-y-8">
          {/* Client Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Posted Jobs</h1>
              <p className="text-gray-600 mt-1">Manage your job postings and applicants</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-800">{postedJobs.filter(j => j.status === 'open').length} Open Jobs</span>
                </div>
              </div>
              <button
                onClick={() => setPostJobModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2"
              >
                <Plus size={18} />
                Post a Job
              </button>
            </div>
          </div>
          
          {/* Posted Jobs */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Posted Jobs</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {postedJobs.map(job => (
                <div key={job.id} className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
                      {job.status.toUpperCase()}
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">₦{job.budget.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{job.postedDate}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={16} />
                      <span className="font-medium">{job.applicants} applicants</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {job.applicants > 0 && (
                        <button
                          onClick={() => setApplicantsModal({ isOpen: true, jobTitle: job.title })}
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Eye size={16} />
                          View Applicants
                        </button>
                      )}
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <FileText size={16} />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {postedJobs.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Plus size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
                <p className="text-gray-500 mb-6">Start by posting your first job to find talented freelancers</p>
                <button
                  onClick={() => setPostJobModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Post Your First Job
                </button>
              </div>
            )}
          </div>
          
          <PostJobModal 
            isOpen={postJobModal}
            onClose={() => setPostJobModal(false)}
            onSubmit={handlePostJob}
          />
          
          <ApplicantsModal 
            isOpen={applicantsModal.isOpen}
            onClose={() => setApplicantsModal({ isOpen: false, jobTitle: '' })}
            jobTitle={applicantsModal.jobTitle}
            applicants={[]}
            onAccept={handleAcceptApplicant}
            onDecline={handleDeclineApplicant}
          />
        </div>
      </Layout>
    );
  }
  
  // Freelancer view
  return (
    <Layout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
            <p className="text-gray-600 mt-1">Find opportunities and manage your work</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-800">3 Active Projects</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">₦69,000 Pending</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Tabs */}
        <div className="flex gap-2 bg-gray-100 p-2 rounded-2xl">
           <button 
             onClick={() => setActiveTab('jobs-for-you')}
             className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
               activeTab === 'jobs-for-you' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             <Zap size={16} />
             Jobs for You (AI)
           </button>
           <button 
             onClick={() => setActiveTab('all-jobs')}
             className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
               activeTab === 'all-jobs' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             <Search size={16} />
             All Jobs
           </button>
           <button 
             onClick={() => setActiveTab('applications')}
             className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
               activeTab === 'applications' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             <Send size={16} />
             My Applications ({JOB_APPLICATIONS.length})
           </button>
           <button 
             onClick={() => setActiveTab('projects')}
             className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
               activeTab === 'projects' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             <Briefcase size={16} />
             My Projects
           </button>
        </div>
        
        {/* Sub Tabs for Applications and Projects */}
        {(activeTab === 'applications' || activeTab === 'projects') && (
          <div className="flex gap-2 bg-gray-50 p-2 rounded-xl max-w-md">
            {activeTab === 'applications' ? (
              <>
                <button 
                  onClick={() => setSubTab('pending')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    subTab === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Pending ({JOB_APPLICATIONS.filter(app => app.status === 'pending').length})
                </button>
                <button 
                  onClick={() => setSubTab('accepted')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    subTab === 'accepted' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Accepted ({JOB_APPLICATIONS.filter(app => app.status === 'accepted').length})
                </button>
                <button 
                  onClick={() => setSubTab('declined')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    subTab === 'declined' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Declined ({JOB_APPLICATIONS.filter(app => app.status === 'declined').length})
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setSubTab('in-progress')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    subTab === 'in-progress' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  In Progress (3)
                </button>
                <button 
                  onClick={() => setSubTab('completed')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    subTab === 'completed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Completed (12)
                </button>
              </>
            )}
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'jobs-for-you' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">AI-Recommended Jobs</h3>
                  <p className="text-sm text-gray-600">Based on your skills and preferences</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {SERVICES.slice(0, 4).map(service => (
                <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold">
                      RECOMMENDED
                    </span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">₦{service.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Fixed Price</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <img src={service.freelancerAvatar} alt={service.freelancerName} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{service.freelancerName}</p>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{service.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'all-jobs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SERVICES.map(service => (
              <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                    {service.category.toUpperCase()}
                  </span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">₦{service.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Fixed Price</div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                
                <div className="flex items-center gap-3 mb-4">
                  <img src={service.freelancerAvatar} alt={service.freelancerName} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{service.freelancerName}</p>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{service.rating}</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {JOB_APPLICATIONS.filter(app => app.status === subTab).map(application => {
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
                  case 'accepted': return 'bg-green-50 text-green-700 border-green-200';
                  case 'declined': return 'bg-red-50 text-red-700 border-red-200';
                  default: return 'bg-gray-50 text-gray-700 border-gray-200';
                }
              };
              
              return (
                <div key={application.id} className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.status)}`}>
                      {application.status.toUpperCase()}
                    </span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">₦{application.budget.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{application.appliedDate}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{application.jobTitle}</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <img src={application.clientAvatar} alt={application.clientName} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{application.clientName}</p>
                      <p className="text-xs text-gray-500">{application.category}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600 font-medium mb-1">Your Proposal:</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{application.proposal}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                      View Details
                    </button>
                    {application.status === 'accepted' && (
                      <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-xl text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all">
                        Start Project
                      </button>
                    )}
                    {application.status === 'pending' && (
                      <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                        Edit Proposal
                      </button>
                    )}
                    {application.status === 'declined' && (
                      <button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all">
                        Apply Similar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {(subTab === 'in-progress' ? ACTIVE_JOBS : []).map(job => {
              const service = SERVICES.find(s => s.id === job.serviceId);
              if (!service) return null;

              return (
                <div key={job.id} className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                        IN PROGRESS
                      </span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₦{job.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{job.date}</p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    
                    <div className="flex items-center gap-3">
                      <img src={service.freelancerAvatar} alt={service.freelancerName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-gray-900">{service.freelancerName}</p>
                        <p className="text-sm text-gray-500">Client</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-gray-900">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Expected completion: 3 days</p>
                  </div>

                  <div className="p-6">
                    <div className="flex gap-3">
                      <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {subTab === 'completed' && (
              <div className="col-span-full text-center py-16 text-gray-500">
                <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">12 Projects Completed</h3>
                <p className="text-gray-500">Great work! You've successfully completed 12 projects</p>
              </div>
            )}
            
            {subTab === 'in-progress' && ACTIVE_JOBS.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-500">
                <Clock size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects in progress</h3>
                <p className="text-gray-500">Apply to jobs to start working on new projects</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};