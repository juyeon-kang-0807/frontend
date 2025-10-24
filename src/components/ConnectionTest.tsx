import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { backendApi } from '../api'

interface ConnectionTestProps {
  className?: string
}

export function ConnectionTest({ className }: ConnectionTestProps) {
  const [supabaseStatus, setSupabaseStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [backendStatus, setBackendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [supabaseError, setSupabaseError] = useState<string>('')
  const [backendError, setBackendError] = useState<string>('')
  const [supabaseData, setSupabaseData] = useState<any>(null)
  const [backendData, setBackendData] = useState<any>(null)

  const testSupabaseConnection = async () => {
    setSupabaseStatus('loading')
    setSupabaseError('')
    try {
      const result = await backendApi.testSupabaseConnection()
      setSupabaseData(result)
      setSupabaseStatus('success')
    } catch (error) {
      setSupabaseError(error instanceof Error ? error.message : '알 수 없는 오류')
      setSupabaseStatus('error')
    }
  }

  const testBackendConnection = async () => {
    setBackendStatus('loading')
    setBackendError('')
    try {
      const result = await backendApi.testSupabaseConnection()
      setBackendData(result)
      setBackendStatus('success')
    } catch (error) {
      setBackendError(error instanceof Error ? error.message : '알 수 없는 오류')
      setBackendStatus('error')
    }
  }

  const testConsultationData = async () => {
    setSupabaseStatus('loading')
    setSupabaseError('')
    try {
      const consultations = await backendApi.getConsultations()
      console.log('상담 데이터 테스트:', consultations);
      setSupabaseData({ consultations, count: consultations.length })
      setSupabaseStatus('success')
    } catch (error) {
      setSupabaseError(error instanceof Error ? error.message : '알 수 없는 오류')
      setSupabaseStatus('error')
    }
  }

  const testRealData = async () => {
    setSupabaseStatus('loading')
    setSupabaseError('')
    try {
      console.log('실제 DB 데이터 조회 시작...');
      const result = await backendApi.testSupabaseConnection()
      console.log('실제 DB 데이터 조회 결과:', result);
      setSupabaseData(result)
      setSupabaseStatus('success')
    } catch (error) {
      console.error('실제 DB 데이터 조회 오류:', error);
      setSupabaseError(error instanceof Error ? error.message : '알 수 없는 오류')
      setSupabaseStatus('error')
    }
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>연결 테스트</CardTitle>
          <CardDescription>
            Supabase와 백엔드 API 연결 상태를 확인합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testSupabaseConnection} disabled={supabaseStatus === 'loading'}>
              {supabaseStatus === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Supabase 직접 연결 테스트
            </Button>
            <Button onClick={testBackendConnection} disabled={backendStatus === 'loading'}>
              {backendStatus === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              백엔드 API 테스트
            </Button>
            <Button onClick={testRealData} disabled={supabaseStatus === 'loading'}>
              {supabaseStatus === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              실제 DB 데이터 조회
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supabase 직접 연결 결과 */}
            <div className="space-y-2">
              <h4 className="font-medium">Supabase 직접 연결</h4>
              {supabaseStatus === 'idle' && (
                <Alert>
                  <AlertDescription>테스트를 실행해주세요.</AlertDescription>
                </Alert>
              )}
              {supabaseStatus === 'loading' && (
                <Alert>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <AlertDescription>연결 테스트 중...</AlertDescription>
                </Alert>
              )}
              {supabaseStatus === 'success' && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription>
                    Supabase 연결 성공! 고객 수: {supabaseData?.customer_count || 0}
                  </AlertDescription>
                </Alert>
              )}
              {supabaseStatus === 'error' && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <AlertDescription>
                    Supabase 연결 실패: {supabaseError}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* 백엔드 API 연결 결과 */}
            <div className="space-y-2">
              <h4 className="font-medium">백엔드 API</h4>
              {backendStatus === 'idle' && (
                <Alert>
                  <AlertDescription>테스트를 실행해주세요.</AlertDescription>
                </Alert>
              )}
              {backendStatus === 'loading' && (
                <Alert>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <AlertDescription>연결 테스트 중...</AlertDescription>
                </Alert>
              )}
              {backendStatus === 'success' && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription>
                    백엔드 API 연결 성공! {backendData?.message}
                  </AlertDescription>
                </Alert>
              )}
              {backendStatus === 'error' && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <AlertDescription>
                    백엔드 API 연결 실패: {backendError}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* 전체 상태 요약 */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">연결 상태 요약</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                {supabaseStatus === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : supabaseStatus === 'error' ? (
                  <XCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                )}
                <span>Supabase 직접 연결: {supabaseStatus === 'success' ? '성공' : supabaseStatus === 'error' ? '실패' : '미테스트'}</span>
              </div>
              <div className="flex items-center gap-2">
                {backendStatus === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : backendStatus === 'error' ? (
                  <XCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                )}
                <span>백엔드 API: {backendStatus === 'success' ? '성공' : backendStatus === 'error' ? '실패' : '미테스트'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

