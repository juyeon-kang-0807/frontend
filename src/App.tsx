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

  const handleStartConsultation = async (name: string, phone: string) => {
  console.log("handleStartConsultation 호출됨", { name, phone });

  try {
    // 1️⃣ 이름+번호로 고객 조회
    const resCustomer = await fetch(`http://localhost:8000/api/customer/lookup?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`);
    if (!resCustomer.ok) {
      const text = await resCustomer.text();
      throw new Error(`고객 조회 실패: ${text}`);
    }
    const customer = await resCustomer.json();
    console.log("🔎 고객 조회 성공:", customer);

    // 2️⃣ 상담 생성
    const resConsult = await fetch("http://localhost:8000/api/consultation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer_no: customer.customer_no,
      branch_name: "서울지점",
      topic: "실시간 상담",
      summary: "대출 위험을 축소한 잘못된 안내"
    }),
  });

    if (!resConsult.ok) {
      const text = await resConsult.text();
      throw new Error(`상담 생성 실패: ${text}`);
    }

    const created = await resConsult.json();
    console.log("🟢 상담 생성 성공:", created);

    setCustomerName(name);
    setPhoneNumber(phone);
    setScreen("consultation");

  } catch (err) {
    console.error("❌ 상담 생성 오류:", err);
    alert("상담 시작 중 오류가 발생했습니다.");
  }
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
      onViewHistory={handleViewHistory}
    />
  );
}
