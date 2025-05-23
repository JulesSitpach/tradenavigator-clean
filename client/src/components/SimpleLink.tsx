import React from 'react';
import { Link } from 'react-router-dom';

interface SimpleLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const SimpleLink: React.FC<SimpleLinkProps> = ({ to, children, className = '' }) => {
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};

export default SimpleLink;