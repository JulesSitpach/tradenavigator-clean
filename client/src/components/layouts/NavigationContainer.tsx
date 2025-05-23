import React from 'react';

interface NavigationContainerProps {
  children: React.ReactNode;
}

const NavigationContainer: React.FC<NavigationContainerProps> = ({ children }) => {
  return (
    <div className="navigation-container">
      {children}
    </div>
  );
};

export default NavigationContainer;