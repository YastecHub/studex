import React, { useState } from 'react';
import { X, Shield, Clock, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';

interface EscrowStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrowId: string;
  jobTitle: string;
  amount: number;
  status: 'secured' | 'work_in_progress' | 'completed' | 'disputed';
  userRole: 'client' | 'freelancer';
  onConfirmCompletion: () => void;
  onDispute: () => void;
}

export const EscrowStatusModal: React.FC<EscrowStatusModalProps> = ({
  isOpen,
  onClose,
  escrowId,
  jobTitle,
  amount,
  status,
  userRole,
  onConfirmCompletion,
  onDispute
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  const getStatusInfo = () => {
    switch (status) {
      case 'secured':
        return {
          icon: <Shield size={24} className="text-blue-600" />,
          title: 'Payment Secured',
          description: userRole === 'client' 
            ? 'Your payment is held in escrow. Freelancer can now start work.'
            : 'Payment is secured in escrow. You can now start working on this project.',
          color: 'blue'
        };
      case 'work_in_progress':
        return {
          icon: <Clock size={24} className="text-yellow-600" />,
          title: 'Work in Progress',
          description: userRole === 'client'
            ? 'Freelancer is working on your project. Payment remains in escrow.'
            : 'Continue working on the project. Payment will be released upon completion.',
          color: 'yellow'
        };
      case 'completed':
        return {
          icon: <CheckCircle size={24} className="text-green-600" />,
          title: 'Work Completed',
          description: userRole === 'client'
            ? 'Please review and confirm completion to release payment.'
            : 'Work submitted! Waiting for client confirmation to release payment.',
          color: 'green'
        };
      case 'disputed':
        return {
          icon: <AlertTriangle size={24} className="text-red-600" />,
          title: 'Dispute Raised',
          description: 'Admin is reviewing the dispute. Payment remains secured until resolution.',
          color: 'red'
        };
      default:
        return {
          icon: <Shield size={24} className="text-gray-600" />,
          title: 'Unknown Status',
          description: 'Contact support for assistance.',
          color: 'gray'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                statusInfo.color === 'blue' ? 'bg-blue-100' :
                statusInfo.color === 'yellow' ? 'bg-yellow-100' :
                statusInfo.color === 'green' ? 'bg-green-100' :
                statusInfo.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {statusInfo.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Escrow Status</h3>
                <p className="text-sm text-gray-500">ID: {escrowId}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Info */}
          <div className={`rounded-2xl p-4 ${
            statusInfo.color === 'blue' ? 'bg-blue-50 border border-blue-200' :
            statusInfo.color === 'yellow' ? 'bg-yellow-50 border border-yellow-200' :
            statusInfo.color === 'green' ? 'bg-green-50 border border-green-200' :
            statusInfo.color === 'red' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              statusInfo.color === 'blue' ? 'text-blue-900' :
              statusInfo.color === 'yellow' ? 'text-yellow-900' :
              statusInfo.color === 'green' ? 'text-green-900' :
              statusInfo.color === 'red' ? 'text-red-900' : 'text-gray-900'
            }`}>{statusInfo.title}</h4>
            <p className={`text-sm ${
              statusInfo.color === 'blue' ? 'text-blue-800' :
              statusInfo.color === 'yellow' ? 'text-yellow-800' :
              statusInfo.color === 'green' ? 'text-green-800' :
              statusInfo.color === 'red' ? 'text-red-800' : 'text-gray-800'
            }`}>{statusInfo.description}</p>
          </div>

          {/* Job Details */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Escrow Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Project:</span>
                <span className="font-medium text-gray-900">{jobTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-gray-900">₦{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium capitalize ${
                  statusInfo.color === 'blue' ? 'text-blue-600' :
                  statusInfo.color === 'yellow' ? 'text-yellow-600' :
                  statusInfo.color === 'green' ? 'text-green-600' :
                  statusInfo.color === 'red' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {status === 'completed' && userRole === 'client' && !showConfirmation && (
              <button
                onClick={() => setShowConfirmation(true)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Confirm Completion & Release Payment
              </button>
            )}

            {showConfirmation && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800 mb-3">
                  Are you sure you want to release the payment? This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={onConfirmCompletion}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Yes, Release Payment
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {(status === 'work_in_progress' || status === 'completed') && status !== 'disputed' && (
              <button
                onClick={onDispute}
                className="w-full bg-red-100 text-red-700 py-3 rounded-xl font-semibold hover:bg-red-200 transition-all flex items-center justify-center gap-2"
              >
                <AlertTriangle size={18} />
                Raise Dispute
              </button>
            )}

            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              <MessageSquare size={18} />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};