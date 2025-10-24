interface SidebarToggleButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export function SidebarToggleButton({ onClick, isOpen = true }: SidebarToggleButtonProps) {
  if (isOpen) {
    return (
      <button 
        onClick={onClick}
        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        title="사이드바 접기"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
          <line x1="14" y1="8" x2="18" y2="12"/>
          <line x1="14" y1="16" x2="18" y2="12"/>
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      title="사이드바 열기"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
      </svg>
    </button>
  );
}
