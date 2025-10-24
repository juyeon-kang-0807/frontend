import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { FeedbackItem } from './FeedbackCard';
import { backendApi } from '../api';

interface SavedNote {
  id: string;
  text: string;
  timestamp: Date;
}

export interface ConsultationHistory {
  id: string;
  customerName: string;
  phoneNumber: string;
  timestamp: Date;
  violationCount: number;
  feedbacks: FeedbackItem[];
  savedNotes: SavedNote[];
}

interface DbConsultation {
  id: number;
  customer_no: string;
  consultation_type?: string;
  consulted_at?: string;
  summary?: string;
  created_at?: string;
  updated_at?: string;
}

interface Customer {
  id?: number;
  customer_no: string;
  customer_name: string;
  phone?: string;
  account_no?: string;
  balance?: number;
  created_at?: string;
  updated_at?: string;
}

interface ConsultationHistoryListProps {
  histories?: ConsultationHistory[];
  onSelectHistory?: (history: ConsultationHistory) => void;
  customerNo?: string; // 특정 고객의 상담내역만 보려면
  initialSearchQuery?: string; // 초기 검색어
  filterByCustomer?: { name: string; phone: string }; // 고객별 필터링
}

export function ConsultationHistoryList({ 
  histories, 
  onSelectHistory, 
  customerNo,
  initialSearchQuery = '',
  filterByCustomer
}: ConsultationHistoryListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dbHistories, setDbHistories] = useState<ConsultationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 검색어 설정
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Supabase에서 직접 상담내역 가져오기
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('상담내역 가져오기 시작...', { customerNo });
        
        // 백엔드 API를 통해 상담 데이터 가져오기
        console.log('백엔드 API 호출 시작...');
        console.log('API URL:', 'http://localhost:8000/consultation');
        
        const response = await backendApi.getConsultations(customerNo);
        
        console.log('백엔드 응답:', response);
        
        // 백엔드에서 반환하는 형태에 맞게 데이터 추출
        const consultations = response.data || response;
        
        console.log('추출된 상담 데이터:', consultations);
        
        // 데이터 변환 - 간단한 형태로
        const convertedHistories: ConsultationHistory[] = (consultations || []).map((consultation: any) => {
          console.log('상담 데이터 변환:', consultation);
          
          // 고객 정보 추출 (조인된 데이터에서)
          const customerInfo = consultation.customer || {};
          
          return {
            id: consultation.consultation_no?.toString() || consultation.id?.toString() || `consultation-${Math.random()}`,
            customerName: customerInfo.customer_name || `고객 ${consultation.customer_no}`,
            phoneNumber: customerInfo.phone || '전화번호 없음',
            timestamp: new Date(consultation.consulted_at || consultation.created_at || new Date()),
            violationCount: 0, // 팩트체크 개수로 업데이트 가능
            feedbacks: [],
            savedNotes: consultation.summary ? [{
              id: `note-${consultation.consultation_no || consultation.id}`,
              text: consultation.summary,
              timestamp: new Date(consultation.created_at || new Date())
            }] : []
          };
        });
        
        console.log('변환된 상담내역:', convertedHistories);
        
        // 테스트용: 데이터가 없으면 간단한 목업 데이터 추가
        if (convertedHistories.length === 0) {
          console.log('실제 데이터가 없으므로 테스트용 목업 데이터를 추가합니다.');
          const mockData = [{
            id: 'test-1',
            customerName: '테스트고객',
            phoneNumber: '010-1234-5678',
            timestamp: new Date(),
            violationCount: 2,
            feedbacks: [],
            savedNotes: [{
              id: 'note-test-1',
              text: '테스트 상담 내용입니다.',
              timestamp: new Date()
            }]
          }];
          console.log('목업 데이터:', mockData);
          setDbHistories(mockData);
        } else {
          setDbHistories(convertedHistories);
        }
      } catch (err) {
        console.error('상담내역을 가져오는 중 오류 발생:', err);
        console.error('오류 상세:', err);
        
        let errorMessage = '상담내역을 불러올 수 없습니다.';
        if (err instanceof Error) {
          errorMessage = `오류: ${err.message}`;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [customerNo]);

  const allHistories = [...(histories || []), ...dbHistories];
  
  // 고객별 필터링 적용
  const filteredByCustomer = filterByCustomer 
    ? allHistories.filter(h => 
        h.customerName.toLowerCase().includes(filterByCustomer.name.toLowerCase()) ||
        h.phoneNumber.includes(filterByCustomer.phone)
      )
    : allHistories;
  
  const filteredHistories = filteredByCustomer.filter(h => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const customerName = h.customerName.toLowerCase();
    const phoneNumber = h.phoneNumber.toLowerCase();
    const summary = h.savedNotes?.[0]?.text?.toLowerCase() || '';
    
    return customerName.includes(query) || 
          phoneNumber.includes(query) || 
          summary.includes(query);
  });

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 1) {
      return '방금 전';
    } else if (diffMins < 60) {
      return `${diffMins}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else if (diffWeeks < 4) {
      return `${diffWeeks}주 전`;
    } else if (diffMonths < 12) {
      return `${diffMonths}개월 전`;
    } else {
      return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' });
    }
  };

  const formatConsultationTime = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full h-full bg-white border-2 border-[#242760] rounded-2xl flex flex-col px-4 py-4">
      {/* Header - 고정 */}
      <div className="py-3 px-3 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg text-[#242760] mb-2 font-semibold">상담 내역</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="이름, 전화번호로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#f7f6f4] border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* History List - 스크롤 가능한 영역 */}
      <div className="flex-1 overflow-y-auto p-2 min-h-0" 
           style={{ 
             scrollbarWidth: 'thin', 
             scrollbarColor: '#4B5563 #F3F4F6'
           }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 text-sm">상담내역을 불러오는 중...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500 text-sm">
              <div className="font-semibold mb-2">상담 내역을 불러올 수 없습니다</div>
              <div className="text-xs">{error}</div>
              <div className="text-xs mt-2">
                백엔드 서버가 실행 중인지 확인하세요: http://localhost:8000
              </div>
            </div>
          </div>
        ) : filteredHistories.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 text-sm">상담내역이 없습니다.</div>
          </div>
        ) : (
          <div className="space-y-1">
            {/* 실제 상담 내역 - 간단한 형태 */}
            {filteredHistories.map((history) => (
              <div
                key={history.id}
                className="p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 cursor-pointer bg-white shadow-sm hover:shadow-md mb-2"
                onClick={() => {
                  console.log('고객 클릭됨:', history);
                  onSelectHistory?.(history);
                }}
              >
                {/* 고객명, 전화번호, 시간만 표시 */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-semibold text-sm">{history.customerName}</span>
                    <span className="text-sm text-gray-600 mt-1">{history.phoneNumber}</span>
                    {history.savedNotes && history.savedNotes.length > 0 && (
                      <span className="text-xs text-gray-500 mt-1 truncate">
                        상담 요약: {history.savedNotes[0].text}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">{getTimeAgo(history.timestamp)}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatConsultationTime(history.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}