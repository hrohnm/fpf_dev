import React, { createContext, useReducer, useCallback } from 'react';

// Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  autoClose?: boolean;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
};

// Action types
type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

// Reducer
const notificationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

// Context
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  showSuccess: (message: string, title?: string) => string;
  showError: (message: string, title?: string) => string;
  showWarning: (message: string, title?: string) => string;
  showInfo: (message: string, title?: string) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Provider
interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  // Add notification
  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = generateId();
      const newNotification: Notification = {
        ...notification,
        id,
        autoClose: notification.autoClose ?? true,
        duration: notification.duration ?? 5000,
      };

      dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

      // Auto close notification if enabled
      if (newNotification.autoClose) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    },
    []
  );

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  // Helper functions for different notification types
  const showSuccess = useCallback(
    (message: string, title?: string) => {
      return addNotification({
        type: 'success',
        message,
        title: title || 'Erfolg',
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message: string, title?: string) => {
      return addNotification({
        type: 'error',
        message,
        title: title || 'Fehler',
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message: string, title?: string) => {
      return addNotification({
        type: 'warning',
        message,
        title: title || 'Warnung',
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message: string, title?: string) => {
      return addNotification({
        type: 'info',
        message,
        title: title || 'Information',
      });
    },
    [addNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
