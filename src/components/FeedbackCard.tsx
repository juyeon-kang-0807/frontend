import React from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';

export interface FeedbackItem {
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

interface FeedbackCardProps {
  feedback: FeedbackItem;
  variant?: 'inline' | 'summary';
}

export function FeedbackCard({ feedback, variant = 'summary' }: FeedbackCardProps) {
  // Inline variant - for real-time conversation
  if (variant === 'inline') {
    return (
      <div className="mt-2 p-3 bg-white border-2 border-red-300 rounded-lg shadow-md">
        <div className="flex items-start gap-2">
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            feedback.type === 'high' ? 'text-red-600' : 
            feedback.type === 'medium' ? 'text-orange-500' : 
            'text-yellow-500'
          }`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={feedback.type === 'high' ? 'destructive' : 'default'} className={
                feedback.type === 'medium' ? 'bg-orange-500 hover:bg-orange-600' : 
                feedback.type === 'low' ? 'bg-yellow-500 hover:bg-yellow-600' : ''
              }>
                {feedback.type === 'high' ? '중요' : feedback.type === 'medium' ? '참고' : '제안'}
              </Badge>
              <span className="text-gray-900">{feedback.category}</span>
            </div>
            <p className="text-gray-700 mb-2">{feedback.description}</p>
            <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
              <p className="text-blue-900">💡 개선 제안: {feedback.suggestion}</p>
            </div>
            <p className="text-gray-600">📋 관련 규정: {feedback.regulation}</p>
          </div>
        </div>
      </div>
    );
  }

  // Summary variant - for report view
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <Lightbulb 
          className={`w-6 h-6 flex-shrink-0 mt-1 ${
            feedback.type === 'high' ? 'text-red-600' : 
            feedback.type === 'medium' ? 'text-orange-500' : 
            'text-yellow-500'
          }`} 
        />
        
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Badge 
              variant={feedback.type === 'high' ? 'default' : 'default'}
              className={
                feedback.type === 'high' ? 'bg-red-600 hover:bg-red-700' :
                feedback.type === 'medium' ? 'bg-orange-500 hover:bg-orange-600' : 
                feedback.type === 'low' ? 'bg-yellow-500 hover:bg-yellow-600' : ''
              }
            >
              {feedback.type === 'high' ? '중요' : feedback.type === 'medium' ? '참고' : '제안'}
            </Badge>
            <span className="text-lg text-gray-900">{feedback.category}</span>
          </div>

          {/* Original Text */}
          {feedback.originalText && (
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <p className="text-gray-700 text-sm leading-relaxed">"{feedback.originalText}"</p>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 text-sm">{feedback.description}</p>

          {/* Suggestion */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-gray-900">
              <span className="font-medium">💡 개선 제안</span>
            </p>
            <p className="text-sm text-blue-900 mt-1 leading-relaxed">"{feedback.suggestion}"</p>
          </div>

          {/* Regulation */}
          <p className="text-sm text-gray-600">
            <span className="font-medium">📋 관련 규정:</span> {feedback.regulation}
          </p>
        </div>
      </div>
    </div>
  );
}
