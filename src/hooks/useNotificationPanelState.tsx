
import { useState, useEffect } from 'react';

// Create a global state system for the notification panel state
type NotificationPanelState = {
  isOpen: boolean;
  isPinned: boolean;
};

let listeners: ((state: NotificationPanelState) => void)[] = [];
let currentState: NotificationPanelState = {
  isOpen: false,
  isPinned: false
};

const notifyListeners = () => {
  listeners.forEach(listener => listener({
    ...currentState
  }));
};

export const useNotificationPanelState = () => {
  const [state, setState] = useState(currentState);
  
  useEffect(() => {
    const listener = (newState: NotificationPanelState) => {
      setState({
        ...newState
      });
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  return state;
};

export const setNotificationPanelState = (newState: Partial<NotificationPanelState>) => {
  currentState = {
    ...currentState,
    ...newState
  };
  notifyListeners();
};
