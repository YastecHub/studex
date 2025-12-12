import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  clientName: string;
  onSubmit: (proposal: string) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ 
  isOpen, 
  onClose, 
  jobTitle, 
  clientName, 
  onSubmit 
}) => {
  const [proposal, setProposal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (proposal.trim()) {
      onSubmit(proposal);
      setProposal('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Apply for Job</h2>
              <p className="text-gray-600 mt-1">{jobTitle}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Application to {clientName}</h3>
            <p className="text-blue-800 text-sm">
              Write a compelling proposal explaining why you're the best fit for this project.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Proposal <span className="text-red-500">*</span>
            </label>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Hi! I'm interested in your project. I have experience in... I can deliver this project by... My approach would be..."
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Minimum 50 characters. Be specific about your experience and approach.
            </p>
          </div>

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
              disabled={proposal.length < 50}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};