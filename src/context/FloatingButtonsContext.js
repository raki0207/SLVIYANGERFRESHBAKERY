import React, { createContext, useContext, useState } from 'react';

const FloatingButtonsContext = createContext();

export const useFloatingButtons = () => {
  const context = useContext(FloatingButtonsContext);
  if (!context) {
    throw new Error('useFloatingButtons must be used within FloatingButtonsProvider');
  }
  return context;
};

export const FloatingButtonsProvider = ({ children }) => {
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);

  return (
    <FloatingButtonsContext.Provider value={{ showFloatingButtons, setShowFloatingButtons }}>
      {children}
    </FloatingButtonsContext.Provider>
  );
};

