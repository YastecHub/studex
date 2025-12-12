import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext';
import { ToastProvider } from './contexts/ToastContext';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Home } from './pages/Home';
import { ServiceDetails } from './pages/ServiceDetails';
import { Wallet } from './pages/Wallet';
import { Jobs } from './pages/Jobs';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <UserProvider>
        <HashRouter>
          <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/messages" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </UserProvider>
    </ToastProvider>
  );
};

export default App;