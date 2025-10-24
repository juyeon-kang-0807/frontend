interface SessionStatusBarProps {
  sessionId: string;
}

export function SessionStatusBar({ sessionId }: SessionStatusBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-5 bg-[#e30580] flex items-center px-4">
      <div className="flex items-center gap-2 text-white text-sm">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span>STT 진행 중 [{sessionId}]</span>
      </div>
    </div>
  );
}
