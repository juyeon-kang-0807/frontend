import React, { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, Edit, Save, Trash2 } from 'lucide-react';
import { backendApi } from '../api';

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

interface CustomerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerInfo: CustomerInfo;
  onCustomerUpdate?: (updatedCustomer: CustomerInfo) => void;
  onCustomerDelete?: (customerId: string) => void;
}

export function CustomerDetailDialog({ 
  open, 
  onOpenChange, 
  customerInfo, 
  onCustomerUpdate, 
  onCustomerDelete 
}: CustomerDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(customerInfo);

  const handleSave = async () => {
    try {
      setLoading(true);
      // TODO: 실제 고객 번호를 사용하여 업데이트
      // await backendApi.updateCustomer(customerNo, editedCustomer);
      onCustomerUpdate?.(editedCustomer);
      setIsEditing(false);
      alert('고객 정보가 업데이트되었습니다.');
    } catch (error) {
      console.error('고객 정보 업데이트 실패:', error);
      alert('고객 정보 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('이 고객 정보를 삭제하시겠습니까?')) {
      try {
        setLoading(true);
        // TODO: 실제 고객 번호를 사용하여 삭제
        // await backendApi.deleteCustomer(customerNo);
        onCustomerDelete?.('customer-id');
        onOpenChange(false);
        alert('고객 정보가 삭제되었습니다.');
      } catch (error) {
        console.error('고객 정보 삭제 실패:', error);
        alert('고객 정보 삭제에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };
  const getRiskLabel = () => {
    switch (customerInfo.riskTolerance) {
      case 'conservative':
        return '안전 추구형';
      case 'moderate':
        return '위험 중립형';
      case 'aggressive':
        return '적극 투자형';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-[342px] bg-white rounded-[15px] border-[3px] border-[#242760]">
        {/* Header */}
        <div className="relative bg-[#242760] h-[41px] rounded-t-[12px] flex items-center justify-between px-4">
          <span className="text-white font-semibold text-[16px]">고객 상세 정보</span>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6 p-0 text-white border-white hover:bg-white/10"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                {onCustomerDelete && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={loading}
                    className="h-6 w-6 p-0 text-white border-white hover:bg-white/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSave}
                  disabled={loading}
                  className="h-6 w-6 p-0 text-white border-white hover:bg-white/10"
                >
                  <Save className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedCustomer(customerInfo);
                  }}
                  className="h-6 w-6 p-0 text-white border-white hover:bg-white/10"
                >
                  <X className="w-3 h-3" />
                </Button>
              </>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/10 rounded p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[600px] overflow-y-auto">
          {/* Basic Info */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {isEditing ? (
                <>
                  <Input
                    value={editedCustomer.name}
                    onChange={(e) => setEditedCustomer({...editedCustomer, name: e.target.value})}
                    className="w-24"
                    placeholder="이름"
                  />
                  <Input
                    value={editedCustomer.age.toString()}
                    onChange={(e) => setEditedCustomer({...editedCustomer, age: parseInt(e.target.value) || 0})}
                    className="w-16"
                    placeholder="나이"
                    type="number"
                  />
                </>
              ) : (
                <>
                  <p className="text-black text-[16px]">이름 : {customerInfo.name}</p>
                  <p className="text-black text-[16px]">나이 : {customerInfo.age}</p>
                </>
              )}
            </div>
            {isEditing ? (
              <Input
                value={editedCustomer.phoneNumber}
                onChange={(e) => setEditedCustomer({...editedCustomer, phoneNumber: e.target.value})}
                className="mb-2"
                placeholder="연락처"
              />
            ) : (
              <p className="text-black text-[16px] mb-2">연락처 : {customerInfo.phoneNumber}</p>
            )}
            <p className="text-black text-[16px] mb-2">직업 : IT개발자 소득 : 월 700만원</p>
            <p className="text-black text-[16px]">자산규모: 5억 이상</p>
          </div>

          {/* Investment Profile */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            {isEditing ? (
              <div className="mb-2">
                <label className="text-black text-[16px] mb-1 block">투자성향:</label>
                <Select
                  value={editedCustomer.riskTolerance}
                  onValueChange={(value: 'conservative' | 'moderate' | 'aggressive') => 
                    setEditedCustomer({...editedCustomer, riskTolerance: value})
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">안전 추구형</SelectItem>
                    <SelectItem value="moderate">위험 중립형</SelectItem>
                    <SelectItem value="aggressive">적극 투자형</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <p className="text-black text-[16px] mb-1">투자성향 : {getRiskLabel()}</p>
            )}
            <p className="text-black text-[16px] mb-1">분석일자 : 2025.08.01</p>
            <p className="text-black text-[16px]">
              주요 특징 : 원금 손실 최소화 선호, 예적금 위주 투자 경험
            </p>
          </div>

          {/* Holdings */}
          <div className="mb-6">
            <p className="text-black text-[16px] font-semibold mb-2">보유상품</p>
            <div className="space-y-1">
              <p className="text-black text-[16px]">
                예적금 : 주택청약종합저축(월 10만원), 자유적금(월 50만원, 만기 3개월전)
              </p>
              <p className="text-black text-[16px]">대출: -</p>
              <p className="text-black text-[16px]">카드 : 00카드</p>
              <p className="text-black text-[16px]">펀드/주식 : -</p>
            </div>
          </div>

          {/* Financial Goals */}
          <div>
            <p className="text-black text-[16px] font-semibold mb-2">고객 금융 목표</p>
            {isEditing ? (
              <Input
                value={editedCustomer.investmentPurpose}
                onChange={(e) => setEditedCustomer({...editedCustomer, investmentPurpose: e.target.value})}
                placeholder="투자 목적"
              />
            ) : (
              <p className="text-black text-[16px]">{customerInfo.investmentPurpose}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
