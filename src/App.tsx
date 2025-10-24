import { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { ConsultationScreen } from './components/ConsultationScreen';
import { MainMenu } from './components/MainMenu';
import { ConsultationHistoryScreen } from './components/ConsultationHistoryScreen';
import { FeedbackItem } from './components/FeedbackCard';
import { ConnectionTest } from './components/ConnectionTest';
import { Button } from './components/ui/button';

type Screen = 'main' | 'start' | 'consultation' | 'history' | 'connection-test';
``
export default function App() {
  const [screen, setScreen] = useState<Screen>('main');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isHistoryMode, setIsHistoryMode] = useState(false);

  console.log('현재 화면:', screen);

  const handleStartConsultation = (name: string, phone: string) => {
    console.log('handleStartConsultation 호출됨', { name, phone });
    setCustomerName(name);
    setPhoneNumber(phone);
    setScreen('consultation');
    console.log('화면 상태 변경됨:', 'consultation');
  };

  const handleViewHistory = () => {
    console.log('handleViewHistory 호출됨');
    console.log('통합된 상담내역 화면으로 이동');
    setScreen('history');
    console.log('화면 상태 변경됨:', 'history');
  };

  const handleBackToMain = () => {
    console.log('메인 메뉴로 돌아가기');
    setScreen('main');
  };

  const handleStart = (name: string, phone: string) => {
    console.log('상담 시작:', { name, phone });
    setCustomerName(name);
    setPhoneNumber(phone);
    setScreen('consultation');
    console.log('화면 변경됨: consultation');
  };

  const handleEndConsultation = (consultationFeedbacks: FeedbackItem[]) => {
    setFeedbacks(consultationFeedbacks);
    setIsHistoryMode(false); // 상담 완료 후는 실제 고객 정보 사용
    setScreen('history'); // 상담내역 조회 화면으로 이동
  };

  const handleNewConsultation = () => {
    setCustomerName('');
    setPhoneNumber('');
    setFeedbacks([]);
    setScreen('start');
  };

  const handleBackToStart = () => {
    setScreen('start');
  };

  if (screen === 'connection-test') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Button onClick={handleBackToMain} variant="outline">
              ← 메인 메뉴로 돌아가기
            </Button>
          </div>
          <ConnectionTest />
        </div>
      </div>
    );
  }

  if (screen === 'main') {
    return (
      <MainMenu 
        onStartConsultation={handleStartConsultation}
        onViewHistory={handleViewHistory}
      />
    );
  }

  if (screen === 'history') {
    return (
      <ConsultationHistoryScreen 
        onBackToMain={handleBackToMain}
        customerName={customerName}
        phoneNumber={phoneNumber}
      />
    );
  }

  if (screen === 'start') {
    return (
      <div>
        <StartScreen onStart={handleStart} onBackToMain={handleBackToMain} />
        <div className="fixed bottom-4 right-4">
          <Button 
            onClick={handleBackToMain} 
            variant="outline" 
            size="sm"
          >
            ← 메인 메뉴
          </Button>
        </div>
      </div>
    );
  }


  return (
    <ConsultationScreen 
      customerName={customerName} 
      phoneNumber={phoneNumber}
      onEndConsultation={handleEndConsultation}
      onBackToMain={handleBackToMain}
    />
  );
}
