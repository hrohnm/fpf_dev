import React, { useState } from 'react';
import { useNotification } from '../../hooks/useNotification';

/**
 * A notification bell component that displays a count of unread notifications
 * and allows the user to view and dismiss them.
 */
const NotificationBell: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDismiss = (id: string) => {
    removeNotification(id);
  };

  const handleDismissAll = () => {
    notifications.forEach((notification) => {
      removeNotification(notification.id);
    });
  };

  return (
    <div className="relative">
      {/* Notification bell button */}
      <button
        type="button"
        className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        onClick={toggleDropdown}
      >
        <span className="sr-only">View notifications</span>
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Notification badge */}
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      {/* Notification dropdown */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Benachrichtigungen</h3>
                {notifications.length > 0 && (
                  <button
                    type="button"
                    className="text-xs text-primary-600 hover:text-primary-800"
                    onClick={handleDismissAll}
                  >
                    Alle löschen
                  </button>
                )}
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-60 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Keine neuen Benachrichtigungen
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex justify-between">
                      <div className="flex-1">
                        {notification.title && (
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        )}
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                      <button
                        type="button"
                        className="ml-2 text-gray-400 hover:text-gray-500"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        <span className="sr-only">Dismiss</span>
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
