import React from 'react';
import { Link } from 'react-router-dom';

interface CleanLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

const CleanLink: React.FC<CleanLinkProps> = ({ 
  to, 
  children, 
  className = '',
  activeClassName = ''
}) => {
  // Simple wrapper around Link with cleaner props
  return (
    <Link 
      to={to} 
      className={className}
      // You might want to implement active state checking here
    >
      {children}
    </Link>
  );
};

export default CleanLink;