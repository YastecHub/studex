import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { Button } from '../components/Button';
import { UserRole } from '../types';
import { Briefcase, User, Users } from 'lucide-react';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole } = useUser();
  const [step, setStep] = useState<'SPLASH' | 'ROLE'>('SPLASH');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  if (step === 'SPLASH') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-10 w-12 h-12 bg-teal-500 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-pink-500 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-yellow-500 rounded-full animate-pulse"></div>
        </div>
        <div className="relative z-10 w-full">
        <div className="max-w-4xl mx-auto py-8 lg:py-16">
          <div className="text-center space-y-6 lg:space-y-8">
            <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto flex items-center justify-center shadow-2xl shadow-blue-200 animate-pulse rounded-2xl bg-white">
               <img src="/logo.png" alt="StuDex Logo" className="w-full h-full object-contain p-2" />
            </div>
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-5xl lg:text-8xl font-bold text-gray-900 tracking-tight">StudEx</h1>
              <p className="text-2xl lg:text-4xl font-medium text-gray-800">
                Build, learn and get paid.
              </p>
              <p className="text-gray-600 text-lg lg:text-2xl max-w-2xl mx-auto leading-relaxed px-4">
                The ultimate platform for students to post jobs, find talented freelancers, and gain real-world experience while earning.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 justify-center items-center pt-6 lg:pt-8">
              <button 
                onClick={() => setStep('ROLE')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 lg:px-12 py-4 lg:py-5 rounded-2xl text-lg lg:text-2xl font-semibold shadow-2xl shadow-blue-200 hover:shadow-3xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                Get Started →
              </button>
              <div className="text-center">
                <span className="text-gray-500 text-base lg:text-xl">Already have an account? </span>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-blue-600 font-semibold text-base lg:text-xl hover:text-blue-700 transition-colors"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-teal-500 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-pink-500 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-yellow-500 rounded-full animate-pulse"></div>
      </div>
      <div className="max-w-4xl mx-auto py-8 lg:py-16 relative z-10">
        <div className="text-center mb-8 lg:mb-12">
          <div className="w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center mb-4 lg:mb-6 mx-auto shadow-xl rounded-xl bg-white">
             <img src="/logo.png" alt="StuDex Logo" className="w-full h-full object-contain p-1" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-4">Choose Your Path</h2>
          <p className="text-gray-600 text-lg lg:text-2xl">How would you like to use StuDex?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <RoleCard 
            role={UserRole.CLIENT} 
            title="Client" 
            desc="Post projects and hire skilled talent for your ideas."
            icon={<User className="text-blue-600" />}
            selected={selectedRole === UserRole.CLIENT}
            onSelect={() => setSelectedRole(UserRole.CLIENT)}
          />
          <RoleCard 
            role={UserRole.FREELANCER} 
            title="Freelancer" 
            desc="Find exciting projects and work with amazing clients."
            icon={<Briefcase className="text-purple-600" />}
            selected={selectedRole === UserRole.FREELANCER}
            onSelect={() => setSelectedRole(UserRole.FREELANCER)}
          />
          <RoleCard 
            role={UserRole.HYBRID} 
            title="Hybrid" 
            desc="Experience both sides - hire talent and offer services."
            icon={<Users className="text-teal-600" />}
            selected={selectedRole === UserRole.HYBRID}
            onSelect={() => setSelectedRole(UserRole.HYBRID)}
          />
        </div>

        <div className="text-center space-y-4 lg:space-y-6">
           <button 
              disabled={!selectedRole}
              onClick={() => {
                if (selectedRole) {
                  setUserRole(selectedRole);
                  navigate('/signup');
                }
              }}
              className={`px-8 lg:px-12 py-4 lg:py-5 rounded-2xl text-lg lg:text-2xl font-semibold transition-all duration-300 w-full sm:w-auto ${
                selectedRole 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-200 hover:shadow-3xl hover:scale-105' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue to StuDex →
            </button>
            <div className="text-center">
              <span className="text-gray-500 text-base lg:text-xl">Already have an account? </span>
              <button 
                onClick={() => navigate('/login')}
                className="text-blue-600 font-semibold text-base lg:text-xl hover:text-blue-700 transition-colors"
              >
                Sign in
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const RoleCard = ({ role, title, desc, icon, selected, onSelect }: any) => (
  <div 
    onClick={onSelect}
    className={`
      relative p-6 lg:p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 group
      ${selected 
        ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-2xl shadow-blue-200' 
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl'
      }
    `}
  >
    <div className={`p-3 lg:p-4 rounded-2xl mb-3 lg:mb-4 inline-block ${
      selected ? 'bg-white shadow-lg' : 'bg-gray-50 group-hover:bg-gray-100'
    }`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div className="space-y-2">
      <h3 className="font-bold text-gray-900 text-xl lg:text-2xl">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-base lg:text-lg">{desc}</p>
    </div>
    <div className={`
      absolute top-4 lg:top-6 right-4 lg:right-6 w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 flex items-center justify-center transition-all
      ${selected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-gray-400'}
    `}>
      {selected && <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white rounded-full" />}
    </div>
  </div>
);
