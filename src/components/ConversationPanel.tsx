import { useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { User, Headphones } from 'lucide-react';
import { FeedbackCard } from './FeedbackCard';

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
}

interface ConversationPanelProps {
  messages: Message[];
  isRecording: boolean;
  feedbacks: Feedback[];
  miniMode?: boolean;
}

export function ConversationPanel({ messages, isRecording, feedbacks, miniMode = false }: ConversationPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getFeedbackForMessage = (messageId: string) => {
    return feedbacks.find(v => v.messageId === messageId);
  };

  const cardHeight = miniMode ? 'h-[500px]' : 'h-full';
  const scrollHeight = miniMode ? 'h-[calc(100%-65px)]' : 'h-[calc(100%-65px)]';

  return (
    <Card className={cardHeight}>
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-900">실시간 상담 내용</h2>
          {isRecording && !miniMode && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-600">STT 진행 중</span>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className={scrollHeight}>
        <div ref={scrollRef} className="p-4 space-y-4">
          {messages.length === 0 && !isRecording && (
            <div className="text-center py-20">
              <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">상담을 시작하려면 '상담 시작' 버튼을 클릭하세요</p>
            </div>
          )}

          {messages.length === 0 && isRecording && (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">음성을 텍스트로 변환 중...</p>
            </div>
          )}

          {messages.map((message) => {
            const feedback = message.hasFeedback ? getFeedbackForMessage(message.id) : null;
            
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${message.speaker === 'agent' ? 'justify-end' : 'justify-start'}`}
              >
                {message.speaker === 'customer' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}

                <div className={`flex flex-col max-w-[70%] ${message.speaker === 'agent' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-600">
                      {message.speaker === 'agent' ? '상담원' : '고객'}
                    </span>
                    <span className="text-gray-400">
                      {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`px-4 py-3 rounded-lg ${
                      message.speaker === 'agent'
                        ? feedback
                          ? 'bg-red-50 border-2 border-red-300'
                          : 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className={message.speaker === 'agent' && feedback ? 'text-gray-900' : ''}>
                      {message.text}
                    </p>
                  </div>

                  {feedback && (
                    <FeedbackCard feedback={feedback} variant="inline" />
                  )}
                </div>

                {message.speaker === 'agent' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                    <Headphones className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
