import { CareLogo } from './CareLogo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserPlus, History } from 'lucide-react';
import { useState } from 'react';

interface MainMenuProps {
  onStartConsultation: (customerName: string, phoneNumber: string) => void;
  onViewHistory: () => void;
}

export function MainMenu({ onStartConsultation, onViewHistory }: MainMenuProps) {
  console.log('MainMenu 렌더링됨');

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleStartClick = () => {
    console.log('고객 정보 입력 버튼 클릭됨', { customerName, phoneNumber });
    if (customerName.trim() && phoneNumber.trim()) {
      onStartConsultation(customerName.trim(), phoneNumber.trim());
    } else {
      alert('고객명과 전화번호를 모두 입력해주세요.');
    }
  };

  const handleHistoryClick = () => {
    console.log('상담내역 조회 버튼 클릭됨');
    onViewHistory();
  };
  return (
    <div className="min-h-screen bg-[#001e5a] relative flex flex-col items-center justify-center overflow-y-auto">
      {/* Logo - 메뉴 선택 박스 위에 위치 */}
      <div className="mb-8 mt-8">
        <CareLogo size="lg" color="white" />
      </div>

      {/* Main Menu Card */}
      <div className="w-full max-w-lg mx-4 mb-8">
        <div 
          className="bg-white pt-16 pb-12 px-8 shadow-2xl"
          style={{
            borderTopLeftRadius: '150px',
            borderTopRightRadius: '150px'
          }}
        >
          <h2 className="text-[#001e5a] text-xl text-center mb-6 font-semibold">
            고객 정보를 입력하세요
          </h2>

          {/* 고객 정보 입력 필드 */}
          <div className="space-y-3 mb-6">
            <div>
              <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">
                고객명
              </Label>
              <Input
                id="customerName"
                type="text"
                placeholder="고객명을 입력하세요"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 rounded-lg border-gray-300 focus:border-[#001e5a] focus:ring-[#001e5a]"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                전화번호
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="전화번호를 입력하세요"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 rounded-lg border-gray-300 focus:border-[#001e5a] focus:ring-[#001e5a]"
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* 상담 시작 */}
            <Button
              onClick={handleStartClick}
              className="w-full h-12 rounded-[20px] text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ 
                background: 'linear-gradient(90deg, rgb(227, 5, 128) 0%, rgb(227, 5, 128) 100%)',
                fontWeight: 600
              }}
            >
              <UserPlus className="w-5 h-5" />
              <span className="text-base">상담 시작</span>
            </Button>

            {/* 상담내역 조회 */}
            <Button
              onClick={handleHistoryClick}
              variant="outline"
              className="w-full h-12 rounded-[20px] border-2 border-[#001e5a] text-[#001e5a] hover:bg-[#001e5a] hover:text-white transition-all flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <History className="w-5 h-5" />
              <span className="text-base">상담내역 조회</span>
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}
