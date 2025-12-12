import React, { useState, useEffect } from 'react';
import { X, Sparkles, DollarSign, Shield } from 'lucide-react';
import { EscrowPaymentModal } from './EscrowPaymentModal';

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancerName: string;
  serviceTitle: string;
}

interface JobForm {
  jobTitle: string;
  description: string;
  workType: string;
  budget: string;
  paymentStructure: string;
}

export const HireModal: React.FC<HireModalProps> = ({ isOpen, onClose, freelancerName, serviceTitle }) => {
  const [formData, setFormData] = useState<JobForm>({
    jobTitle: '',
    description: '',
    workType: '',
    budget: '',
    paymentStructure: 'milestone'
  });
  const [aiSuggestion, setAiSuggestion] = useState<{ min: number; max: number } | null>(null);
  const [showEscrowModal, setShowEscrowModal] = useState(false);

  const getAISuggestion = (description: string) => {
    const keywords = description.toLowerCase();
    
    if (keywords.includes('web') || keywords.includes('website')) {
      return { min: 10000, max: 25000 };
    }
    if (keywords.includes('mobile') || keywords.includes('app')) {
      return { min: 15000, max: 35000 };
    }
    if (keywords.includes('design') || keywords.includes('ui') || keywords.includes('logo')) {
      return { min: 5000, max: 15000 };
    }
    if (keywords.includes('writing') || keywords.includes('content')) {
      return { min: 3000, max: 8000 };
    }
    if (keywords.includes('tutoring') || keywords.includes('teaching')) {
      return { min: 2000, max: 5000 };
    }
    if (keywords.includes('photography') || keywords.includes('video')) {
      return { min: 6000, max: 15000 };
    }
    return { min: 3000, max: 10000 };
  };

  useEffect(() => {
    if (formData.description.length > 10) {
      const suggestion = getAISuggestion(formData.description);
      setAiSuggestion(suggestion);
    } else {
      setAiSuggestion(null);
    }
  }, [formData.description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate freelancer accepting the offer and proceed to escrow payment
    setShowEscrowModal(true);
  };
  
  const handleEscrowPaymentComplete = (escrowId: string) => {
    console.log('Escrow payment completed:', escrowId);
    alert(`Payment secured in escrow! Escrow ID: ${escrowId}\nFreelancer can now start work.`);
    setShowEscrowModal(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hire {freelancerName}</h2>
              <p className="text-gray-600 mt-1">Create a custom job offer</p>
            </div>
            <button
              onClick={onClose} 
              title="Close modal"
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Custom E-commerce Website"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your project requirements, timeline, and any specific details..."
              required
            />
          </div>

          {/* AI Price Suggestion */}
          {aiSuggestion && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-blue-600" />
                <span className="font-semibold text-blue-900">AI Price Suggestion</span>
              </div>
              <p className="text-blue-800">
                Based on your description, similar projects typically cost between{' '}
                <span className="font-bold">₦{aiSuggestion.min.toLocaleString()}</span> - {' '}
                <span className="font-bold">₦{aiSuggestion.max.toLocaleString()}</span>
              </p>
            </div>
          )}

          {/* Type of Work */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type of Work</label>
            <select
              name="workType"
              title="Select type of work"
              value={formData.workType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select work type</option>
              <option value="one-time">One-time Project</option>
              <option value="ongoing">Ongoing Work</option>
              <option value="hourly">Hourly Consultation</option>
              <option value="milestone">Milestone-based</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₦)</label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your budget"
                min="1000"
                required
              />
            </div>
          </div>

          {/* Payment Structure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Structure</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentStructure"
                  value="milestone"
                  checked={formData.paymentStructure === 'milestone'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Milestone</div>
                  <div className="text-xs text-gray-500">Pay per milestone</div>
                </div>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentStructure"
                  value="upfront"
                  checked={formData.paymentStructure === 'upfront'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Upfront</div>
                  <div className="text-xs text-gray-500">Pay full amount</div>
                </div>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentStructure"
                  value="completion"
                  checked={formData.paymentStructure === 'completion'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">On Completion</div>
                  <div className="text-xs text-gray-500">Pay when done</div>
                </div>
              </label>
            </div>
          </div>

          {/* Escrow Info */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Secure Escrow Payment</h4>
                <p className="text-sm text-green-800">
                  Your payment will be held securely until the freelancer completes the work. 
                  This protects both you and the freelancer.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <Shield size={18} />
              Hire with Escrow
            </button>
          </div>
        </form>
        
        <EscrowPaymentModal
          isOpen={showEscrowModal}
          onClose={() => setShowEscrowModal(false)}
          jobTitle={formData.jobTitle}
          freelancerName={freelancerName}
          amount={parseInt(formData.budget) || 0}
          onPaymentComplete={handleEscrowPaymentComplete}
        />
      </div>
    </div>
  );
};