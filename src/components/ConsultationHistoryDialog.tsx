import { Dialog, DialogContent } from './ui/dialog';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { backendApi } from '../api';

interface ConsultationHistory {
  id: string;
  date: string;
  agent: string;
  topic: string;
  inquiry: string;
  result: string;
}

// 데이터베이스에서 가져온 실제 상담 데이터 타입
interface DbConsultation {
  id: number;
  customer_no: string;
  consultation_type?: string;
  consulted_at?: string;
  summary?: string;
  created_at?: string;
  updated_at?: string;
}

// 고객 정보 타입
interface Customer {
  id: number;
  customer_no: string;
  customer_name: string;
  phone?: string;
  account_no?: string;
  balance?: number;
  created_at?: string;
  updated_at?: string;
}

interface ConsultationHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  histories?: ConsultationHistory[];
  customerNo?: string; // 특정 고객의 상담내역만 보려면
  selectedHistory?: any; // 선택된 상담 내역
}

export function ConsultationHistoryDialog({ open, onOpenChange, histories, customerNo, selectedHistory }: ConsultationHistoryDialogProps) {
  const [dbHistories, setDbHistories] = useState<ConsultationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터베이스에서 상담내역 가져오기
  useEffect(() => {
    if (!open) return;

    const fetchConsultations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 선택된 상담 내역이 있으면 해당 고객의 상담 내역만 가져오기
        const targetCustomerNo = selectedHistory?.customerName?.includes('고객') 
          ? selectedHistory.customerName.split('고객')[1]?.trim()
          : customerNo;
        
        // 백엔드 API를 통해 상담 데이터 가져오기
        console.log('다이얼로그에서 백엔드 API 호출:', targetCustomerNo);
        const response = await backendApi.getConsultations(targetCustomerNo);
        const consultations: any[] = response.data || response;
        
        // 데이터 변환
        const convertedHistories: ConsultationHistory[] = consultations.map(consultation => {
          const date = new Date(consultation.consulted_at || consultation.created_at || new Date());
          
          // 고객 정보 추출 (조인된 데이터에서)
          const customerInfo = consultation.customer || {};
          
          return {
            id: consultation.consultation_no?.toString() || consultation.id?.toString() || `consultation-${Math.random()}`,
            date: date.toLocaleDateString('ko-KR'),
            agent: '상담사', // 실제 상담사 정보가 있다면 사용
            topic: consultation.topic || consultation.consultation_type || '일반상담',
            inquiry: consultation.summary || '상담내용 없음',
            result: '상담완료' // 실제 처리결과가 있다면 사용
          };
        });
        
        setDbHistories(convertedHistories);
      } catch (err) {
        console.error('상담내역을 가져오는 중 오류 발생:', err);
        setError('상담내역을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [open, customerNo, selectedHistory]);

  // 기존 histories와 dbHistories를 합치기
  const allHistories = [...(histories || []), ...dbHistories];

  return (
    <Dialog open={open}>
      <DialogContent 
        className="p-0 gap-0 max-w-[342px] bg-white rounded-[15px] border-[3px] border-[#242760]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="relative bg-[#242760] h-[41px] rounded-t-[12px] flex items-center justify-between px-4">
          <span className="text-white font-semibold text-[16px]">이전 상담 내역</span>
          <button
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-white/10 rounded p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[600px] overflow-y-auto">
          <h3 className="text-black text-[16px] font-semibold mb-4">상담 목록</h3>
          
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">상담내역을 불러오는 중...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-red-500">{error}</div>
            </div>
          ) : allHistories.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">상담내역이 없습니다.</div>
            </div>
          ) : (
            <div className="space-y-6">
              {allHistories.map((history) => (
                <div key={history.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="text-black text-[16px] font-semibold mb-2">
                    {history.date} / {history.agent} / {history.topic}
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-black text-[16px] font-medium">문의 내용:</span>
                      <p className="text-black text-[16px] ml-2">{history.inquiry}</p>
                    </div>
                    
                    <div>
                      <span className="text-black text-[16px] font-medium">처리 결과:</span>
                      <p className="text-black text-[16px] ml-2">{history.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
