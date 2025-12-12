import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ApplyModal } from '../components/ApplyModal';
import { useUser } from '../UserContext';
import { UserRole } from '../types';
import { SERVICES } from '../constants';
import { ArrowLeft, Star, MapPin, ShieldCheck, Clock, Zap, DollarSign, MessageSquare, CheckCircle, User } from 'lucide-react';
import { Button } from '../components/Button';

export const ServiceDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useUser();
  const service = SERVICES.find(s => s.id === id);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'none' | 'pending' | 'accepted' | 'rejected'>('none');

  const handleApply = (proposal: string) => {
    setApplicationStatus('pending');
    setTimeout(() => {
      alert('Application submitted successfully! You will be notified when the client responds.');
    }, 500);
  };

  if (!service) return (
    <Layout>
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
        <Button onClick={() => navigate('/home')}>Back to Home</Button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {userRole === UserRole.FREELANCER ? 'Job Details' : 'Service Details'}
          </h1>
        </div>

        {/* Job Title & Price */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold text-gray-900 flex-1 mr-4">{service.title}</h2>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">₦{service.price.toLocaleString()}</div>
              <p className="text-gray-500 text-sm">
                {service.priceType === 'NEGOTIABLE' ? 'Budget (Negotiable)' : 'Fixed budget'}
              </p>
              {service.aiMatchScore && userRole === UserRole.FREELANCER && (
                <div className="mt-2">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {service.aiMatchScore}% Match
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-yellow-500 fill-current" />
              <span className="font-medium">{service.rating}</span>
              <span>({service.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>Unilag Campus</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>7 days deadline</span>
            </div>
          </div>

          {/* Client/Freelancer Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">
                {userRole === UserRole.FREELANCER ? 'David A.' : service.freelancerName}
              </h3>
              <p className="text-gray-600">
                {userRole === UserRole.FREELANCER ? 'Client' : 'Freelancer'} • 
                <span className="text-green-600 font-medium">Verified</span> • 
                98% Success Rate
              </p>
            </div>
            <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              View Profile
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="grid grid-cols-2 gap-4">
              {service.portfolioImages.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${service.title} ${index + 1}`}
                  className="w-full h-48 object-cover rounded-2xl shadow-sm"
                />
              ))}
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {userRole === UserRole.FREELANCER ? 'Job Description' : 'About This Service'}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
              
              {userRole === UserRole.FREELANCER && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Skills Required:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Node.js', 'MongoDB', 'UI/UX Design'].map(skill => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck size={18} className="text-green-600" />
                      <span className="font-semibold text-green-900">Payment Protection</span>
                    </div>
                    <p className="text-green-800 text-sm">
                      This job includes escrow protection. Payment is held securely until work is completed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Application Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">{service.category}</span>
                </div>
                
                {userRole === UserRole.FREELANCER && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Proposals</span>
                    <span className="font-medium text-gray-900">3 submitted</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {userRole === UserRole.FREELANCER ? (
                  <>
                    {applicationStatus === 'none' && (
                      <>
                        <button 
                          onClick={() => setApplyModal(true)}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 text-lg"
                        >
                          <DollarSign size={20} />
                          Apply for this Job
                        </button>
                        <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                          <MessageSquare size={18} />
                          Message Client
                        </button>
                      </>
                    )}
                    {applicationStatus === 'pending' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
                        <CheckCircle size={32} className="text-yellow-600 mx-auto mb-3" />
                        <p className="font-bold text-yellow-900 text-lg">Application Submitted!</p>
                        <p className="text-yellow-800 text-sm mt-1">Waiting for client response</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Button fullWidth>Contact Freelancer</Button>
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={18} />
                      Hire Now
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>



        
        <ApplyModal 
          isOpen={applyModal}
          onClose={() => setApplyModal(false)}
          jobTitle={service.title}
          clientName="David A."
          onSubmit={handleApply}
        />
      </div>
    </Layout>
  );
};