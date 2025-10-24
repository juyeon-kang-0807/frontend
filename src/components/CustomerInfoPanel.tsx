import { useState } from 'react';
import { CustomerDetailDialog } from './CustomerDetailDialog';
import { ConsultationHistoryDialog } from './ConsultationHistoryDialog';
import { ProductSection } from './ProductSection';
import { CustomerProfileCard } from './CustomerProfileCard';

interface CustomerInfo {
  name: string;
  phoneNumber: string;
  age: number;
  investmentExperience: 'none' | 'beginner' | 'intermediate' | 'expert';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  financialStatus: string;
  investmentPurpose: string;
  customerGrade?: string;
}

interface CustomerInfoPanelProps {
  customerInfo: CustomerInfo;
}

export function CustomerInfoPanel({ customerInfo }: CustomerInfoPanelProps) {
  const [recommendedExpanded, setRecommendedExpanded] = useState(true);
  const [cautionExpanded, setCautionExpanded] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const getRecommendedProducts = () => {
    if (customerInfo.riskTolerance === 'conservative') {
      return ['정기 예금', '적금', '안정형 펀드'];
    } else if (customerInfo.riskTolerance === 'moderate') {
      return ['혼합형 펀드', '채권형 펀드', 'ELS (원금보장형)'];
    } else {
      return ['주식형 펀드', 'ELS (비보장형)', '파생상품'];
    }
  };

  const getCautionProducts = () => {
    if (customerInfo.riskTolerance === 'conservative') {
      return ['파생 상품', '주식형 펀드', 'ELS (비보장형)'];
    } else if (customerInfo.riskTolerance === 'moderate') {
      return ['고위험 파생상품'];
    }
    return [];
  };

  const getRiskLabel = () => {
    switch (customerInfo.riskTolerance) {
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

  const recommendedProducts = getRecommendedProducts();
  const cautionProducts = getCautionProducts();

  // 샘플 상담 내역 데이터
  const consultationHistories = [
    {
      id: '1',
      date: '2025.08.14',
      agent: 'OOO 행원',
      topic: '신용카드 발급:',
      inquiry: '해외 이용 수수료 없는 카드 문의',
      result: 'XX카드(해외 특화) 발급 완료'
    },
    {
      id: '2',
      date: '2024.11.05',
      agent: '△△△ 행원',
      topic: '예금 만기:',
      inquiry: '만기 자금 운용 문의',
      result: '정기예금으로 재예치'
    }
  ];

  return (
    <div className="px-4">
      {/* Customer Profile Card */}
      <CustomerProfileCard
        name={customerInfo.name}
        age={customerInfo.age}
        phoneNumber={customerInfo.phoneNumber}
        riskTolerance={customerInfo.riskTolerance}
        customerGrade={customerInfo.customerGrade}
        onDetailClick={() => setDetailDialogOpen(true)}
        onHistoryClick={() => setHistoryDialogOpen(true)}
      />

      {/* Recommended Products */}
      <ProductSection
        title="권유 가능 상품"
        products={recommendedProducts}
        isExpanded={recommendedExpanded}
        onToggle={() => setRecommendedExpanded(!recommendedExpanded)}
        type="recommended"
      />

      {/* Caution Products */}
      {cautionProducts.length > 0 && (
        <ProductSection
          title="권유 주의 상품"
          products={cautionProducts}
          isExpanded={cautionExpanded}
          onToggle={() => setCautionExpanded(!cautionExpanded)}
          type="caution"
        />
      )}
      
      <CustomerDetailDialog 
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        customerInfo={customerInfo}
      />
      
      <ConsultationHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        histories={consultationHistories}
      />
    </div>
  );
}
