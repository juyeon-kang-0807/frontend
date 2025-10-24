import { useState, useEffect } from 'react';
import { backendApi } from '../api';
import { ConversationPanel } from './ConversationPanel';
import { CustomerInfoPanel } from './CustomerInfoPanel';
import { TopHeader } from './TopHeader';
import { SessionStatusBar } from './SessionStatusBar';
import { FeedbackPopup } from './FeedbackPopup';

interface Message {
  id: string;
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: Date;
  hasFeedback?: boolean;
  feedbackId?: string;
}

interface Feedback {
  id: string;
  messageId: string;
  type: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  regulation: string;
  suggestion: string;
  timestamp: Date;
  originalText?: string;
}

interface ConsultationScreenProps {
  customerName: string;
  phoneNumber: string;
  onEndConsultation?: (feedbacks: Feedback[]) => void;
  onBackToMain?: () => void;
}

export function ConsultationScreen({
  customerName,
  phoneNumber,
  onEndConsultation,
  onBackToMain,
}: ConsultationScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePopup, setActivePopup] = useState<{
    type: 'high' | 'medium';
    category: string;
    id: string;
  } | null>(null);

  const [sessionInfo] = useState({
    sessionId: 'A1234B56',
    agentName: '김민지',
    agentId: 'A-1234',
  });
  const [customerInfo] = useState({
    name: customerName,
    phoneNumber: phoneNumber,
    age: 33,
    investmentExperience: 'beginner' as const,
    riskTolerance: 'conservative' as const,
    financialStatus: '안정적 (정기 소득 있음)',
    investmentPurpose: '노후 자금 마련',
    customerGrade: 'VIP',
  });

  // 🎧 STT API 연결
  useEffect(() => {
    if (isRecording) {
      backendApi.startSTTStream().then(() => {
        console.log("🎙️ STT 스트리밍 시작됨");
      });
    } else {
      backendApi.stopSTTStream();
    }
  }, [isRecording]);

  // ✅ WebSocket 실시간 수신
  useEffect(() => {
    if (!isRecording) return;

    const wsUrl = backendApi.getSTTWebSocketUrl();
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => console.log("✅ STT WebSocket 연결됨:", wsUrl);
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // 백엔드에서 보낸 JSON
        const text = data?.text ?? '';
        if (!text) return;

        const speaker: 'agent' | 'customer' =
          data?.speaker === 'customer' ? 'customer' : 'agent';

        const newMsg: Message = {
          id: `stt-${Date.now()}`,
          speaker,
          text,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMsg]);

        // ✅ GPT 분석 결과 있을 경우 feedback 생성
        const a = data?.analysis;
        if (a && a.level && a.level !== '정상') {
          const fbType =
            a.level === '심각' ? 'high' : a.level === '경고' ? 'medium' : 'low';

          const newFeedback: Feedback = {
            id: `fb-${Date.now()}`,
            messageId: newMsg.id,
            type: fbType,
            category: a.title || '주의 필요',
            description: a.description || '',
            regulation: a.reference || '',
            suggestion: a.suggestion || '',
            timestamp: new Date(),
            originalText: text,
          };

          setFeedbacks((prev) => [...prev, newFeedback]);

          // 메시지에도 연결 표시
          setMessages((prev) =>
            prev.map((m) =>
              m.id === newMsg.id
                ? { ...m, hasFeedback: true, feedbackId: newFeedback.id }
                : m
            )
          );

          // ⚡ 실시간 팝업
          if (fbType === 'high' || fbType === 'medium') {
            setActivePopup({
              type: fbType,
              category: newFeedback.category,
              id: newFeedback.id,
            });
          }
        }
      } catch (e) {
        console.error("⚠️ WebSocket 데이터 파싱 실패:", event.data);
      }
    };

    socket.onclose = () => console.log("🔌 WebSocket 연결 종료");
    return () => socket.close();
  }, [isRecording]);

  // 🎙️ 상담 시작 / 종료 제어
  const handleStartStop = async () => {
  if (isRecording) {
    console.log("🛑 상담 종료 요청 중...");

    try {
      await backendApi.stopSTTStream();
      console.log("🛑 STT 중지 완료");

      // ✅ 상담 내용 저장
      await backendApi.createConsultation({
        customer_no: 1, // 👉 실제 고객번호로 대체 필요
        consulted_at: new Date().toISOString(),
        branch_name: "서울지점",
        topic: "상담 종료 자동 기록",
        summary: "STT 세션 종료 후 자동 저장됨",
      });

      console.log("✅ 상담내역 저장 완료");

      // 기존 피드백 리포트 저장도 그대로
      if (onEndConsultation) onEndConsultation(feedbacks);
    } catch (err) {
      console.error("⚠️ STT 중지/저장 실패:", err);
    }
  } else {
    console.log("🎙️ 상담 시작 요청 중...");
    await backendApi.startSTTStream();
    setMessages([]);
    setFeedbacks([]);
    setActivePopup(null);
  }

  setIsRecording(!isRecording);
};


  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopHeader
        isRecording={isRecording}
        onStartStop={handleStartStop}
        onBackToMain={onBackToMain}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <div className="w-[300px] bg-[#001e5a] flex flex-col">
            <div className="flex-1 overflow-y-auto pb-16 pt-4">
              <CustomerInfoPanel customerInfo={customerInfo} />
            </div>
            <SessionStatusBar sessionId={sessionInfo.sessionId} />
          </div>
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-hidden">
            <ConversationPanel
              messages={messages}
              isRecording={isRecording}
              feedbacks={feedbacks}
            />
          </div>
        </div>
      </div>

      {activePopup && (
        <FeedbackPopup
          type={activePopup.type}
          category={activePopup.category}
          onClose={() => setActivePopup(null)}
          autoCloseDelay={5000}
        />
      )}
    </div>
  );
}
