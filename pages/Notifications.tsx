import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { 
  Bell, 
  Check, 
  X, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  User, 
  Briefcase,
  Star,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'message' | 'payment' | 'job' | 'review' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New Message',
    message: 'Sarah Johnson sent you a message about the e-commerce project',
    time: '2 minutes ago',
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'You received ₦25,000 for E-commerce Website project',
    time: '1 hour ago',
    read: false,
    priority: 'high'
  },
  {
    id: '3',
    type: 'job',
    title: 'New Job Match',
    message: 'Mobile App Development job matches your skills',
    time: '3 hours ago',
    read: true,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'review',
    title: 'New Review',
    message: 'Mike Chen left you a 5-star review',
    time: '1 day ago',
    read: true,
    priority: 'medium'
  },
  {
    id: '5',
    type: 'system',
    title: 'Profile Update',
    message: 'Your profile has been successfully updated',
    time: '2 days ago',
    read: true,
    priority: 'low'
  },
  {
    id: '6',
    type: 'job',
    title: 'Application Update',
    message: 'Your application for Content Writing project was accepted',
    time: '3 days ago',
    read: true,
    priority: 'high'
  }
];

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'messages' | 'payments' | 'jobs'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare size={20} className="text-blue-500" />;
      case 'payment': return <DollarSign size={20} className="text-green-500" />;
      case 'job': return <Briefcase size={20} className="text-purple-500" />;
      case 'review': return <Star size={20} className="text-yellow-500" />;
      case 'system': return <Info size={20} className="text-gray-500" />;
      default: return <Bell size={20} className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread': return !notif.read;
      case 'messages': return notif.type === 'message';
      case 'payments': return notif.type === 'payment';
      case 'jobs': return notif.type === 'job';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              <CheckCircle size={16} />
              Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'messages', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
            { id: 'payments', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
            { id: 'jobs', label: 'Jobs', count: notifications.filter(n => n.type === 'job').length }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                filter === filterOption.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
              {filterOption.count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  filter === filterOption.id
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {filterOption.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {filter === 'all' ? "You're all caught up!" : `No ${filter} notifications found.`}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'border border-blue-200 bg-blue-50/30' : 'border border-gray-100'
                } transition-all hover:shadow-xl`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="Delete notification"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className={`mb-3 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>{notification.time}</span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State for filtered results */}
        {filteredNotifications.length === 0 && filter !== 'all' && (
          <div className="text-center py-8">
            <button
              onClick={() => setFilter('all')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all notifications
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};