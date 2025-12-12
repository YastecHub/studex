import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { EscrowStatusModal } from '../components/EscrowStatusModal';
import { useUser } from '../UserContext';
import { UserRole } from '../types';
import { CURRENT_USER, MOCK_TRANSACTIONS } from '../constants';
import { ArrowUpRight, ArrowDownLeft, Plus, History, Shield, Clock, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

interface EscrowTransaction {
  id: string;
  jobTitle: string;
  clientName: string;
  freelancerName: string;
  amount: number;
  status: 'secured' | 'work_in_progress' | 'completed' | 'disputed' | 'released';
  createdDate: string;
}

const MOCK_ESCROW_TRANSACTIONS: EscrowTransaction[] = [
  {
    id: 'ESC1703123456',
    jobTitle: 'E-commerce Website Development',
    clientName: 'Sarah Johnson',
    freelancerName: 'Alex Thompson',
    amount: 25000,
    status: 'work_in_progress',
    createdDate: '2 days ago'
  },
  {
    id: 'ESC1703123457',
    jobTitle: 'Mobile App UI Design',
    clientName: 'Mike Chen',
    freelancerName: 'Alex Thompson',
    amount: 15000,
    status: 'completed',
    createdDate: '5 days ago'
  },
  {
    id: 'ESC1703123458',
    jobTitle: 'Logo Design Package',
    clientName: 'TechCorp Ltd',
    freelancerName: 'Alex Thompson',
    amount: 8000,
    status: 'released',
    createdDate: '1 week ago'
  }
];

export const Wallet: React.FC = () => {
  const { userRole } = useUser();
  const [activeTab, setActiveTab] = useState<'wallet' | 'escrow'>('wallet');
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowTransaction | null>(null);
  
  const totalEscrowAmount = MOCK_ESCROW_TRANSACTIONS
    .filter(t => ['secured', 'work_in_progress', 'completed'].includes(t.status))
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secured':
      case 'work_in_progress':
        return <Clock size={16} className="text-yellow-500" />;
      case 'completed':
        return <CheckCircle size={16} className="text-blue-500" />;
      case 'released':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'disputed':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Shield size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secured':
      case 'work_in_progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'released':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'disputed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleConfirmCompletion = () => {
    alert('Payment released successfully!');
    setSelectedEscrow(null);
  };

  const handleDispute = () => {
    alert('Dispute raised. Admin will review within 24 hours.');
    setSelectedEscrow(null);
  };

  return (
    <Layout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your wallet and escrow transactions</p>
          </div>
          <div className="flex gap-2 bg-gray-100 p-2 rounded-2xl">
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === 'wallet'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ArrowUpRight size={16} />
              Wallet
            </button>
            <button
              onClick={() => setActiveTab('escrow')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === 'escrow'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield size={16} />
              Escrow
            </button>
          </div>
        </div>

        {activeTab === 'wallet' && (
          <>
            {/* Balance Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Balance */}
              <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500 rounded-full blur-2xl opacity-15 -ml-12 -mb-12"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-gray-300 text-lg font-medium mb-2">Available Balance</p>
                      <h2 className="text-5xl font-bold mb-2">₦{CURRENT_USER.walletBalance.toLocaleString()}</h2>
                      <p className="text-green-400 text-sm font-medium">+12.5% from last month</p>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-2xl font-bold">₦</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-semibold transition-all hover:scale-105">
                      <Plus size={20} /> Add Money
                    </button>
                    <button className="flex-1 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-semibold transition-all hover:scale-105">
                      <ArrowUpRight size={20} /> Withdraw
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                      <ArrowDownLeft size={24} className="text-green-600" />
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">+8.2%</span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Total Earned</p>
                  <p className="text-2xl font-bold text-gray-900">₦450,000</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                      <ArrowUpRight size={24} className="text-blue-600" />
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">-2.1%</span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₦125,000</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'escrow' && (
          <>
            {/* Escrow Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3">
                  <Shield size={24} />
                  <div>
                    <p className="text-green-100 text-sm">Total in Escrow</p>
                    <p className="text-2xl font-bold">₦{totalEscrowAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {MOCK_ESCROW_TRANSACTIONS.filter(t => ['secured', 'work_in_progress', 'completed'].includes(t.status)).length}
                    </p>
                  </div>
                  <Shield size={24} className="text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {MOCK_ESCROW_TRANSACTIONS.filter(t => t.status === 'released').length}
                    </p>
                  </div>
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Disputes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {MOCK_ESCROW_TRANSACTIONS.filter(t => t.status === 'disputed').length}
                    </p>
                  </div>
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
              </div>
            </div>

            {/* Escrow Transactions */}
            <div className="space-y-4">
              {MOCK_ESCROW_TRANSACTIONS.map(transaction => (
                <div key={transaction.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{transaction.jobTitle}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1 capitalize">{transaction.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Escrow ID:</span> {transaction.id}
                        </div>
                        <div>
                          <span className="font-medium">
                            {userRole === UserRole.CLIENT ? 'Freelancer:' : 'Client:'}
                          </span>{' '}
                          {userRole === UserRole.CLIENT ? transaction.freelancerName : transaction.clientName}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {transaction.createdDate}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">₦{transaction.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Escrow Amount</div>
                      </div>
                      
                      <button
                        onClick={() => setSelectedEscrow(transaction)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'wallet' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">View All →</button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {MOCK_TRANSACTIONS.map(t => (
                <div key={t.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center
                        ${t.type === 'DEPOSIT' || t.type === 'EARNING' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                        }
                      `}>
                        {t.type === 'DEPOSIT' || t.type === 'EARNING' 
                          ? <ArrowDownLeft size={24} /> 
                          : <ArrowUpRight size={24} />
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{t.description}</p>
                        <p className="text-gray-500">{t.date}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          t.type === 'DEPOSIT' ? 'bg-blue-100 text-blue-700' :
                          t.type === 'EARNING' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {t.type.toLowerCase().replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xl font-bold ${
                        t.type === 'DEPOSIT' || t.type === 'EARNING' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {t.type === 'DEPOSIT' || t.type === 'EARNING' ? '+' : '-'}₦{t.amount.toLocaleString()}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">Completed</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedEscrow && (
          <EscrowStatusModal
            isOpen={true}
            onClose={() => setSelectedEscrow(null)}
            escrowId={selectedEscrow.id}
            jobTitle={selectedEscrow.jobTitle}
            amount={selectedEscrow.amount}
            status={selectedEscrow.status}
            userRole={userRole === UserRole.CLIENT ? 'client' : 'freelancer'}
            onConfirmCompletion={handleConfirmCompletion}
            onDispute={handleDispute}
          />
        )}
      </div>
    </Layout>
  );
};