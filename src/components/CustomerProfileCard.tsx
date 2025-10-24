import React from 'react';

interface CustomerProfileCardProps {
  name: string;
  age: number;
  phoneNumber: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  customerGrade?: string;
  onDetailClick: () => void;
  onHistoryClick?: () => void;
}

export function CustomerProfileCard({
  name,
  age,
  phoneNumber,
  riskTolerance,
  customerGrade = 'VIP',
  onDetailClick,
  onHistoryClick
}: CustomerProfileCardProps) {
  const getRiskLabel = () => {
    switch (riskTolerance) {
      case 'conservative':
        return '안전추구형';
      case 'moderate':
        return '위험중립형';
      case 'aggressive':
        return '공격투자형';
      default:
        return '';
    }
  };

  return (
    <div 
      className="bg-white rounded-t-[165.5px] pt-16 pb-8 px-6 mb-4 relative" 
      style={{ boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)', border: '2px solid rgba(36,39,96,0.31)' }}
    >
      <h2 className="text-[#242760] text-2xl text-center mb-2" style={{ fontWeight: 600 }}>
        {name} ({age})
      </h2>
      <p className="text-[#544c4c] text-center mb-6" style={{ fontSize: '18px', fontWeight: 500 }}>
        {phoneNumber}
      </p>

      <div className="flex justify-center gap-8 mb-6">
        <div className="text-center min-w-[100px]">
          <p className="text-[#242760] text-xl mb-1" style={{ fontWeight: 600, lineHeight: '1.2' }}>
            {getRiskLabel()}
          </p>
          <p className="text-[#544c4c] text-sm">투자성향</p>
        </div>
        <div className="text-center min-w-[100px]">
          <p className="text-[#242760] text-xl mb-1" style={{ fontWeight: 600, lineHeight: '1.2' }}>
            {customerGrade}
          </p>
          <p className="text-[#544c4c] text-sm">고객 등급</p>
        </div>
      </div>

      <div className="flex gap-8 justify-center">
        <div className="min-w-[100px] flex justify-center">
          <button 
            onClick={onDetailClick}
            className="bg-[#242760] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#1a1d4a] transition-colors"
          >
            상세열람
          </button>
        </div>
        <div className="min-w-[100px] flex justify-center">
          <button 
            onClick={onHistoryClick}
            className="bg-[#242760] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#1a1d4a] transition-colors"
          >
            이전 상담
          </button>
        </div>
      </div>
    </div>
  );
}
