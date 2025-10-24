import { ActionButton } from './ActionButton';
import { CareLogo } from './CareLogo';

interface TopHeaderProps {
  isRecording: boolean;
  onViewHistory: () => void;
  onStartStop: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onBackToMain?: () => void;
}

export function TopHeader({ 
  isRecording, 
  onViewHistory, 
  onStartStop,
  onToggleSidebar,
  isSidebarOpen = true,
  onBackToMain
}: TopHeaderProps) {
  return (
    <div className="h-[92px] bg-white border-b-2 border-[#001e5a] flex items-center justify-between px-6 relative z-10">
      <div className="flex items-center gap-4">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <CareLogo size="md" color="blue" onClick={onBackToMain} />
        </div>
        
        {/* Sidebar Toggle */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isSidebarOpen ? "사이드바 접기" : "사이드바 펼치기"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
              {isSidebarOpen ? (
                <>
                  <line x1="14" y1="8" x2="18" y2="12"/>
                  <line x1="14" y1="16" x2="18" y2="12"/>
                </>
              ) : (
                <>
                  <line x1="15" y1="8" x2="11" y2="12"/>
                  <line x1="15" y1="16" x2="11" y2="12"/>
                </>
              )}
            </svg>
          </button>
        )}
      </div>
      
      <div className="flex gap-3">
        <ActionButton onClick={onViewHistory} variant="secondary">
          상담 내역
        </ActionButton>
        <ActionButton 
          onClick={onStartStop} 
          variant={isRecording ? 'stop' : 'primary'}
        >
          {isRecording ? '상담 종료' : '상담 시작'}
        </ActionButton>
      </div>
    </div>
  );
}
