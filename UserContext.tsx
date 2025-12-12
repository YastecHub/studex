import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from './types';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  level: string;
  matricNo: string;
  username: string;
  skills?: string[];
  portfolioFiles?: File[];
  bio?: string;
  profileImage?: File | null;
  profileImageUrl?: string;
}

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  profileMode: 'client' | 'freelancer';
  setProfileMode: (mode: 'client' | 'freelancer') => void;
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  isHybridMode: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CLIENT);
  const [profileMode, setProfileMode] = useState<'client' | 'freelancer'>('freelancer');
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const isHybridMode = userRole === UserRole.HYBRID;

  return (
    <UserContext.Provider value={{ userRole, setUserRole, profileMode, setProfileMode, userData, setUserData, isHybridMode }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};