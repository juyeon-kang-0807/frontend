import { useState, useEffect } from 'react';
import { ConsultationHistoryList } from './ConsultationHistoryList';
import { CareLogo } from './CareLogo';
import { backendApi } from '../api';

interface ConsultationHistoryScreenProps {
  onBackToMain: () => void;
  customerName?: string;
  phoneNumber?: string;
}

interface FactCheck {
  factcheck_no: number;
  consultation_no: number;
  customer_no: number;
  severity: string;
  detected_statement: string;
  correction_suggestion: string;
  related_law: string;
  created_at: string;
}

export function ConsultationHistoryScreen({
  onBackToMain,
  customerName,
  phoneNumber,
}: ConsultationHistoryScreenProps) {
  console.log('ConsultationHistoryScreen 렌더링됨');

  const [selectedHistory, setSelectedHistory] = useState<any>(null);
  const [factChecks, setFactChecks] = useState<FactCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [factChecksLoading, setFactChecksLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // ✅ 상담 선택 시 팩트체크 불러오기
  const handleSelectHistory = async (history: any) => {
    try {
      console.log('=== 상담 내역 선택 시작 ===');
      console.log('선택된 상담 내역:', history);

      if (!history || !history.id) {
        console.error('잘못된 상담 내역 데이터:', history);
        setHasError(true);
        return;
      }

      setSelectedHistory(history);
      setHasError(false);
      setFactChecksLoading(true);

      const consultationNo = parseInt(history.id);
      console.log('팩트체크 조회 - 상담 번호:', consultationNo);

      if (isNaN(consultationNo)) {
        console.error('잘못된 상담 번호:', history.id);
        setHasError(true);
        return;
      }

      const factChecksData = await backendApi.getFactChecks(consultationNo);
      console.log('가져온 팩트체크:', factChecksData);

      // ✅ Supabase → 프론트 데이터 변환
      const convertedFactChecks = (factChecksData || []).map((fc: any) => ({
        factcheck_no: fc.factcheck_id ?? fc.id ?? 0,
        consultation_no: fc.consultation_no ?? 0,
        customer_no: fc.customer_no ?? 1,

        // 🔹 type 값(high/medium/low) → 한국어로 변환
        severity:
          fc.type === 'high'
            ? '심각'
            : fc.type === 'medium'
            ? '경고'
            : fc.type === 'low'
            ? '정보'
            : '기타',

        // 🔹 Supabase 컬럼명에 맞게 매핑
        detected_statement: fc.category ?? '내용 없음',
        correction_suggestion: fc.suggestion ?? '',
        related_law: fc.regulation ?? '',
        created_at: fc.timestamp ?? fc.created_at ?? new Date().toISOString(),
      }));

      // ✅ 수정됨: 목업 데이터 제거, 실제 DB 데이터만 표시
      if (convertedFactChecks && convertedFactChecks.length > 0) {
        setFactChecks(convertedFactChecks);
      } else {
        console.log('⚠️ 팩트체크 데이터 없음 — DB에서 조회된 결과가 없습니다.');
        setFactChecks([]);
      }

      console.log('=== 상담 내역 선택 완료 ===');
    } catch (error) {
      console.error('상담 내역 선택 중 오류 발생:', error);
      setFactChecksLoading(false);
      setFactChecks([]);
      setHasError(true);
    } finally {
      setFactChecksLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      setRefreshTrigger((prev) => prev + 1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('데이터 새로고침 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
        {/* 오류 처리 */}
        {hasError && (
          <div className="fixed inset-0 bg-red-50 flex items-center justify-center z-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg border-2 border-red-200">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-red-700 mb-2">오류가 발생했습니다</h2>
              <p className="text-gray-600 mb-4">
                상담 내역을 처리하는 중 문제가 발생했습니다.
              </p>
              <button
                onClick={() => {
                  setHasError(false);
                  setSelectedHistory(null);
                  setFactChecks([]);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="h-[92px] bg-white border-b-2 border-[#001e5a] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <CareLogo size="md" color="blue" onClick={onBackToMain} />
          </div>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 text-white rounded-2xl hover:opacity-90 transition-opacity"
            style={{ background: 'rgb(227, 5, 128)' }}
          >
            새로고침
          </button>
        </div>

        {/* 메인 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 왼쪽 상담내역 리스트 */}
          <div className="w-[360px] bg-[#001e5a] p-8 flex items-center justify-center">
            <ConsultationHistoryList
              onSelectHistory={handleSelectHistory}
              key={refreshTrigger}
              initialSearchQuery={customerName || ''}
            />
          </div>

          {/* 오른쪽 리포트 */}
          <div className="flex-1 flex flex-col p-8 overflow-hidden">
            <div className="flex-1 bg-white border-2 border-[#242760] rounded-2xl flex flex-col min-h-0">
              <div className="bg-[#242760] text-white py-5 px-8 flex items-center justify-center flex-shrink-0">
                <h1 className="text-3xl">CARE REPORT</h1>
              </div>

              {/* 내용 */}
              <div className="flex-1 overflow-y-auto p-8 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#9CA3AF #F3F4F6' }}>
                {!selectedHistory ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    상담 내역을 선택하세요.
                  </div>
                ) : factChecksLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#242760] mx-auto mb-4"></div>
                    <div className="text-gray-500 text-sm">팩트체크 불러오는 중...</div>
                  </div>
                ) : factChecks.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    개선 포인트 없음 ✅
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* 상담 정보 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">선택된 상담</h3>
                      <div className="text-sm text-blue-800">
                        <div>고객명: {selectedHistory?.customerName}</div>
                        <div>전화번호: {selectedHistory?.phoneNumber}</div>
                        <div>
                          상담일시: {selectedHistory?.timestamp.toLocaleString('ko-KR')}
                        </div>
                      </div>
                    </div>

                    {/* 팩트체크 목록 */}
                    <div className="space-y-4">
                      {factChecks.map((factCheck, index) => (
                        <div
                          key={factCheck.factcheck_no}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-500">
                                #{index + 1}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  factCheck.severity === '심각'
                                    ? 'bg-red-100 text-red-800'
                                    : factCheck.severity === '경고'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {factCheck.severity}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(factCheck.created_at).toLocaleDateString('ko-KR')}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">
                                🚨 감지된 문구
                              </h4>
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-800 font-medium">
                                  "{factCheck.detected_statement}"
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">
                                💡 수정 제안
                              </h4>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                  {factCheck.correction_suggestion}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">
                                ⚖️ 관련 법령
                              </h4>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-xs text-gray-700">{factCheck.related_law}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
