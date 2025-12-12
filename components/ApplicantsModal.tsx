import React, { useState } from 'react';
import { X, Check, X as Decline, Star, MapPin } from 'lucide-react';

interface Applicant {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  proposal: string;
  bidAmount: number;
  deliveryTime: string;
  skills: string[];
}

interface ApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  applicants: Applicant[];
  onAccept: (applicantId: string) => void;
  onDecline: (applicantId: string) => void;
}

const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'a1',
    name: 'Sarah Johnson',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    rating: 4.9,
    proposal: 'I have 5+ years of experience in React development and can deliver a high-quality e-commerce website with modern UI/UX design.',
    bidAmount: 18000,
    deliveryTime: '7 days',
    skills: ['React', 'Node.js', 'MongoDB', 'Stripe']
  },
  {
    id: 'a2',
    name: 'Chuka Emeka',
    avatar: 'https://picsum.photos/seed/chuka/200/200',
    rating: 4.8,
    proposal: 'Full-stack developer with expertise in e-commerce solutions. I can build a scalable platform with payment integration.',
    bidAmount: 15000,
    deliveryTime: '10 days',
    skills: ['React', 'Express', 'PostgreSQL', 'PayStack']
  },
  {
    id: 'a3',
    name: 'Kemi Adebayo',
    avatar: 'https://picsum.photos/seed/kemi/200/200',
    rating: 4.7,
    proposal: 'Experienced in building modern web applications. I focus on clean code and user-friendly interfaces.',
    bidAmount: 20000,
    deliveryTime: '5 days',
    skills: ['React', 'TypeScript', 'Firebase', 'Tailwind']
  },
  {
    id: 'a4',
    name: 'Tunde Okafor',
    avatar: 'https://picsum.photos/seed/tunde/200/200',
    rating: 4.6,
    proposal: 'I specialize in e-commerce development with a focus on performance and SEO optimization.',
    bidAmount: 16500,
    deliveryTime: '8 days',
    skills: ['React', 'Next.js', 'Shopify', 'SEO']
  }
];

export const ApplicantsModal: React.FC<ApplicantsModalProps> = ({ 
  isOpen, 
  onClose, 
  jobTitle, 
  onAccept, 
  onDecline 
}) => {
  const [applicants] = useState(MOCK_APPLICANTS);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Applicants</h2>
              <p className="text-gray-600 mt-1">{jobTitle}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {applicants.map((applicant) => (
            <div key={applicant.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <img 
                  src={applicant.avatar} 
                  alt={applicant.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{applicant.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-500 fill-current" />
                          <span className="font-medium text-gray-900">{applicant.rating}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin size={14} />
                          <span className="text-sm">Lagos, Nigeria</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">₦{applicant.bidAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">in {applicant.deliveryTime}</div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{applicant.proposal}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {applicant.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => onAccept(applicant.id)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check size={18} />
                      Accept & Create Contract
                    </button>
                    <button
                      onClick={() => onDecline(applicant.id)}
                      className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Decline size={18} />
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};