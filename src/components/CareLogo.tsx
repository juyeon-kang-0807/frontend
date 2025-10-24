interface CareLogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'blue';
  className?: string;
  onClick?: () => void;
}

export function CareLogo({ size = 'md', color = 'blue', className = '', onClick }: CareLogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl', 
    lg: 'text-3xl'
  };

  const colorClasses = {
    white: 'text-white',
    blue: 'text-[#001e5a]'
  };

  return (
    <div 
      className={`${sizeClasses[size]} font-bold ${colorClasses[color]} ${className} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      onClick={onClick}
    >
      CARE
    </div>
  );
}
