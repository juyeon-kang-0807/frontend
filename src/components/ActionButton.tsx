import { ReactNode } from 'react';

interface ActionButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'stop';
  children: ReactNode;
  className?: string;
}

export function ActionButton({ 
  onClick, 
  variant = 'primary', 
  children, 
  className = '' 
}: ActionButtonProps) {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'rgb(227, 5, 128)',
          color: 'white'
        };
      case 'secondary':
        return {
          background: 'rgba(0,56,122,0.57)',
          color: 'white'
        };
      case 'stop':
        return {
          background: '#e1e1e1',
          color: '#e30580'
        };
      default:
        return {};
    }
  };

  const hoverClasses = variant === 'secondary' 
    ? 'hover:bg-[rgba(0,56,122,0.8)]' 
    : '';

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl transition-colors ${hoverClasses} ${className}`}
      style={getStyles()}
    >
      {children}
    </button>
  );
}
