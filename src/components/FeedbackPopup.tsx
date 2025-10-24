import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FeedbackPopupProps {
  type: 'high' | 'medium';
  category: string;
  onClose: () => void;
  autoCloseDelay?: number;
}

export function FeedbackPopup({ type, category, onClose, autoCloseDelay = 5000 }: FeedbackPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 애니메이션을 위한 지연
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // 자동 닫기
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, autoCloseDelay);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // 애니메이션 완료 후 제거
  };

  const getIcon = () => {
    if (type === 'high') {
      return '⚠️';
    } else {
      return '💡';
    }
  };

  const getTitle = () => {
    if (type === 'high') {
      return '표현 확인 필요';
    } else {
      return '참고해주세요';
    }
  };

  const getBgColor = () => {
    if (type === 'high') {
      return 'bg-orange-50 border-orange-200';
    } else {
      return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    if (type === 'high') {
      return 'text-orange-800';
    } else {
      return 'text-blue-800';
    }
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className={`max-w-md w-full mx-4 p-4 rounded-lg border-2 shadow-lg ${getBgColor()}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{getIcon()}</div>
            <div className="flex-1">
              <h3 className={`font-semibold text-sm ${getTextColor()}`}>
                {getTitle()}
              </h3>
              <p className={`text-sm mt-1 ${getTextColor()}`}>
                {category}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`ml-2 p-1 rounded-full hover:bg-white/20 transition-colors ${getTextColor()}`}
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

