import React, { useState } from 'react';
import { ConsultationHistoryList, ConsultationHistory } from './ConsultationHistoryList';
import { CareLogo } from './CareLogo';
import { backendApi } from '../api';

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

interface SummaryScreenProps {
  onNewConsultation: () => void;
  onBackToMain: () => void;
  selectedCustomer?: { name: string; phone: string } | null;
}

export function SummaryScreen({ onNewConsultation, onBackToMain, selectedCustomer }: SummaryScreenProps) {
  console.log('SummaryScreen 렌더링됨');
  
  const [selectedHistory, setSelectedHistory] = useState<ConsultationHistory | null>(null);
  const [factChecks, setFactChecks] = useState<FactCheck[]>([]);
  const [factChecksLoading, setFactChecksLoading] = useState(false);

  const handleSelectHistory = async (history: ConsultationHistory) => {
    console.log('상담 내역 선택:', history);
    setSelectedHistory(history);
    
    // 선택된 상담의 팩트체크 가져오기
    try {
      setFactChecksLoading(true);
      
      // 상담 번호를 정수로 변환
      const consultationNo = parseInt(history.id);
      console.log('팩트체크 조회 - 상담 번호:', consultationNo, '타입:', typeof consultationNo);
      
      // 유효한 상담 번호인지 확인
      if (isNaN(consultationNo)) {
        console.error('유효하지 않은 상담 번호:', history.id);
        setFactChecks([]);
        return;
      }
      
      const factChecksData = await backendApi.getFactChecks(consultationNo);
      console.log('가져온 팩트체크:', factChecksData);
      
      // 팩트체크 데이터가 배열인지 확인
      if (Array.isArray(factChecksData)) {
        setFactChecks(factChecksData);
      } else {
        console.warn('팩트체크 데이터가 배열이 아닙니다:', factChecksData);
        setFactChecks([]);
      }
    } catch (error) {
      console.error('팩트체크 조회 실패:', error);
      setFactChecks([]);
    } finally {
      setFactChecksLoading(false);
    }
  };

  const handleNewConsultation = () => {
    setSelectedHistory(null);
    setFactChecks([]);
    onNewConsultation();
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Header */}
      <div className="h-[80px] bg-white border-b-2 border-[#001e5a] flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <CareLogo size="md" color="blue" onClick={onBackToMain} />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onBackToMain}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            메인 메뉴
          </button>
          <button
            onClick={handleNewConsultation}
            className="px-6 py-3 bg-gradient-to-r from-[#d50982] to-[#ff383c] text-white rounded-2xl hover:opacity-90 transition-opacity"
          >
            새 상담
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0 gap-4 p-4">
        {/* Left Sidebar - Consultation History */}
        <div className="w-[400px] bg-[#001e5a] p-4 flex items-center justify-center">
          <ConsultationHistoryList 
            onSelectHistory={handleSelectHistory}
            initialSearchQuery={selectedCustomer?.name || ''}
            filterByCustomer={selectedCustomer || undefined}
          />
        </div>

        {/* Right Content - Care Report */}
        <div className="flex-1 p-4 min-h-0">
          <div className="h-full bg-white border-2 border-[#242760] rounded-2xl flex flex-col">
            {/* Header */}
            <div className="bg-[#242760] text-white py-4 px-6 flex items-center justify-center flex-shrink-0">
              <div className="text-center">
                <h1 className="text-2xl mb-1">C.A.R.E REPORT</h1>
                {selectedCustomer && (
                  <div className="text-sm text-blue-200">
                    고객: {selectedCustomer.name} ({selectedCustomer.phone})
                  </div>
                )}
              </div>
            </div>

            {/* Content - 스크롤 가능 */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0" 
                 style={{ 
                   scrollbarWidth: 'thin', 
                   scrollbarColor: '#4B5563 #F3F4F6'
                 }}>
              {!selectedHistory ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-gray-400 text-4xl mb-4">📋</div>
                    <div className="text-gray-500 text-lg">
                      {selectedCustomer ? `${selectedCustomer.name} 고객의 상담 내역을 선택하세요` : '상담 내역을 선택하세요'}
                    </div>
                    <div className="text-gray-400 text-sm mt-2">왼쪽에서 상담 내역을 클릭하면 팩트체크 리포트가 표시됩니다</div>
                  </div>
                </div>
              ) : factChecksLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#242760] mx-auto mb-4"></div>
                    <div className="text-gray-500 text-sm">팩트체크를 불러오는 중...</div>
                  </div>
                </div>
              ) : factChecks.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-green-400 text-4xl mb-4">✅</div>
                    <div className="text-gray-500 text-lg">완벽한 상담!</div>
                    <div className="text-gray-400 text-sm mt-2">이 상담에서는 개선 포인트가 발견되지 않았습니다</div>
                    <div className="text-gray-400 text-xs mt-4">
                      상담 번호: {selectedHistory?.id} | 고객: {selectedHistory?.customerName}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 선택된 상담 정보 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">선택된 상담</h3>
                    <div className="text-sm text-blue-800">
                      <div>상담 번호: {selectedHistory?.id}</div>
                      <div>고객명: {selectedHistory?.customerName}</div>
                      <div>전화번호: {selectedHistory?.phoneNumber}</div>
                      <div>상담일시: {selectedHistory?.timestamp.toLocaleString('ko-KR')}</div>
                    </div>
                  </div>

                  {/* 팩트체크 요약 */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">팩트체크 요약</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {factChecks.filter(fc => fc.severity === '심각').length}
                        </div>
                        <div className="text-sm text-gray-600">심각</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {factChecks.filter(fc => fc.severity === '경고').length}
                        </div>
                        <div className="text-sm text-gray-600">경고</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {factChecks.filter(fc => fc.severity === '정보').length}
                        </div>
                        <div className="text-sm text-gray-600">정보</div>
                      </div>
                    </div>
                  </div>

                  {/* 팩트체크 목록 */}
                  <div className="space-y-4">
                    {factChecks.map((factCheck, index) => (
                      <div key={factCheck.factcheck_no} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              factCheck.severity === '심각' ? 'bg-red-100 text-red-800' :
                              factCheck.severity === '경고' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {factCheck.severity}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(factCheck.created_at).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">🚨 감지된 문구</h4>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-sm text-red-800 font-medium">
                                "{factCheck.detected_statement}"
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">💡 수정 제안</h4>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm text-blue-800">
                                {factCheck.correction_suggestion}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">⚖️ 관련 법령</h4>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <p className="text-xs text-gray-700">
                                {factCheck.related_law}
                              </p>
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
