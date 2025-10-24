import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface ProductSectionProps {
  title: string;
  products: string[];
  isExpanded: boolean;
  onToggle: () => void;
  type: 'recommended' | 'caution';
}

export function ProductSection({ title, products, isExpanded, onToggle, type }: ProductSectionProps) {
  const isRecommended = type === 'recommended';
  
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full bg-white rounded-lg p-4 border-2 border-[#bbbcce] flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-4 h-4">
            {isRecommended ? (
              <CheckCircle className="w-4 h-4 text-[#00387a]" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#ff383c]" />
            )}
          </div>
          <span className={isRecommended ? 'text-[#00387a]' : 'text-[#ff383c]'}>
            {title}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {products.map((product, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-3 text-center ${
                isRecommended ? 'bg-[#e1e8f2]' : 'bg-[#ffe5e5]'
              }`}
            >
              <span className={isRecommended ? 'text-[#00387a]' : 'text-[#ff383c]'}>
                {product}
              </span>
            </div>
          ))}
          
          {!isRecommended && (
            <div className="bg-[#fff3e0] rounded-lg p-4 text-center">
              <p className="text-[#d97706] text-sm leading-relaxed">
                💡 부적합 상품 권유 시<br />
                반드시 서면 경고 후 고객 확인 필요
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
