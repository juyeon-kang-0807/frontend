const BASE = 'http://localhost:8000'

// 백엔드 API를 통한 함수들
export const backendApi = {
    // 고객 관리 CRUD
    async getCustomers() {
        const res = await fetch(`${BASE}/api/customer`)
        if (!res.ok) throw new Error(`GET /api/customer ${res.status}`)
        return res.json()
    },

    async getCustomer(customerNo: number) {
        const res = await fetch(`${BASE}/api/customer/${customerNo}`)
        if (!res.ok) throw new Error(`GET /api/customer/${customerNo} ${res.status}`)
        return res.json()
    },

    async createCustomer(payload: {
        customer_name: string
        phone: string
        account_no: string
        account_balance: number
        estimated_total_assets: number
        investment_personality: number
        grade: string
    }) {
        const res = await fetch(`${BASE}/api/customer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`POST /api/customer ${res.status}`)
        return res.json()
    },

    async updateCustomer(customerNo: number, payload: {
        customer_name?: string
        phone?: string
        account_no?: string
        account_balance?: number
        estimated_total_assets?: number
        investment_personality?: number
        grade?: string
    }) {
        const res = await fetch(`${BASE}/api/customer/${customerNo}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`PUT /api/customer/${customerNo} ${res.status}`)
        return res.json()
    },

    async deleteCustomer(customerNo: number) {
        const res = await fetch(`${BASE}/api/customer/${customerNo}`, {
            method: "DELETE",
        })
        if (!res.ok) throw new Error(`DELETE /api/customer/${customerNo} ${res.status}`)
        return res.json()
    },

    // 상담 내역 관리 CRUD
    async getConsultations(customerNo?: string, limit = 20, offset = 0) {
        const params = new URLSearchParams()
        if (customerNo) params.append('customer_no', customerNo)
        params.append('limit', limit.toString())
        params.append('offset', offset.toString())
        
        console.log(`백엔드 API 호출: ${BASE}/api/consultation?${params}`)
        
        try {
            const res = await fetch(`${BASE}/api/consultation?${params}`)
            console.log('응답 상태:', res.status, res.statusText)
            
            if (!res.ok) {
                const errorText = await res.text()
                console.error('API 오류 응답:', errorText)
                throw new Error(`GET /api/consultation ${res.status}: ${errorText}`)
            }
            
            const result = await res.json()
            console.log('API 응답 데이터:', result)
            
            return result.data || result
        } catch (error) {
            console.error('API 호출 실패:', error)
            throw error
        }
    },

    async getConsultation(consultationNo: number) {
        const res = await fetch(`${BASE}/consultation/${consultationNo}`)
        if (!res.ok) throw new Error(`GET /consultation/${consultationNo} ${res.status}`)
        return res.json()
    },

    async createConsultation(payload: {
        customer_no: number
        consulted_at: string
        branch_name: string
        topic: string
        summary: string
    }) {
        const res = await fetch(`${BASE}/consultation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`POST /consultation ${res.status}`)
        return res.json()
    },

    async updateConsultation(consultationNo: number, payload: {
        customer_no?: number
        consulted_at?: string
        branch_name?: string
        topic?: string
        summary?: string
    }) {
        const res = await fetch(`${BASE}/consultation/${consultationNo}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`PUT /consultation/${consultationNo} ${res.status}`)
        return res.json()
    },

    async deleteConsultation(consultationNo: number) {
        const res = await fetch(`${BASE}/consultation/${consultationNo}`, {
            method: "DELETE",
        })
        if (!res.ok) throw new Error(`DELETE /consultation/${consultationNo} ${res.status}`)
        return res.json()
    },

    // ✅ 팩트체크 관리 CRUD (Supabase 연동)
    async getFactChecks(consultationNo?: number) {
        const params = new URLSearchParams()
        if (consultationNo) params.append('consultation_no', consultationNo.toString())
        
        console.log(`📡 팩트체크 API 호출: ${BASE}/api/factchecks?${params.toString()}`)
        
        try {
            // ✅ 슬래시(/) 제거 및 toString() 추가
            const url = `${BASE}/api/factchecks?${params.toString()}`
            const res = await fetch(url)
            console.log('팩트체크 응답 상태:', res.status, res.statusText)
            
            if (!res.ok) {
                const errorText = await res.text()
                console.error('팩트체크 API 오류 응답:', errorText)
                throw new Error(`GET /api/factchecks ${res.status}: ${errorText}`)
            }
            
            const result = await res.json()
            console.log('팩트체크 API 응답 데이터:', result)
            
            // ✅ 배열 or 객체 모두 대응
            if (Array.isArray(result)) {
                console.log('🟢 배열 형태로 팩트체크 데이터 수신')
                return result
            } else if (result.data && Array.isArray(result.data)) {
                console.log('🟢 data 필드 내 배열 형태 수신')
                return result.data
            } else {
                console.warn('⚠️ 팩트체크 데이터 비어 있음:', result)
                return []
            }
        } catch (error) {
            console.error('❌ 팩트체크 API 호출 실패:', error)
            return []
        }
    },

    async getFactCheck(factcheckNo: number) {
        const res = await fetch(`${BASE}/api/factchecks/${factcheckNo}`)
        if (!res.ok) throw new Error(`GET /api/factchecks/${factcheckNo} ${res.status}`)
        return res.json()
    },

    async createFactCheck(payload: {
        consultation_no: number
        type: string
        category: string
        description: string
        regulation: string
        suggestion: string
        original_text?: string
        timestamp?: string
    }) {
        const res = await fetch(`${BASE}/api/factchecks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`POST /factchecks ${res.status}`)
        return res.json()
    },

    async updateFactCheck(factcheckNo: number, payload: {
        consultation_no?: number
        type?: string
        category?: string
        description?: string
        regulation?: string
        suggestion?: string
        original_text?: string
        timestamp?: string
    }) {
        const res = await fetch(`${BASE}/factchecks/${factcheckNo}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`PUT /factchecks/${factcheckNo} ${res.status}`)
        return res.json()
    },

    async deleteFactCheck(factcheckNo: number) {
        const res = await fetch(`${BASE}/factchecks/${factcheckNo}`, {
            method: "DELETE",
        })
        if (!res.ok) throw new Error(`DELETE /factchecks/${factcheckNo} ${res.status}`)
        return res.json()
    },

    // ✅ 기존 호환성 함수 유지
    async getFactChecksByConsultation(consultationId: number) {
        return this.getFactChecks(consultationId)
    },

    async testSupabaseConnection() {
        const res = await fetch(`${BASE}/test-supabase`)
        if (!res.ok) throw new Error(`GET /test-supabase ${res.status}`)
        return res.json()
    },

    async createTestData() {
        const res = await fetch(`${BASE}/create-test-data`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
        if (!res.ok) throw new Error(`POST /create-test-data ${res.status}`)
        return res.json()
    },

    // STT스트리밍 시작
    async startSTTStream() {
        const res = await fetch(`${BASE}/api/stt_stream/start`, {
            method: "POST",
        })
        if (!res.ok) throw new Error(`POST /api/stt_stream/start ${res.status}`)
        return res.json()
    },

    /** STT 스트리밍 중지 */
    async stopSTTStream() {
        const res = await fetch(`${BASE}/api/stt_stream/stop`, {
            method: "POST",
        })
        if (!res.ok) throw new Error(`POST /api/stt_stream/stop ${res.status}`)
        return res.json()
    },

    /** STT 현재 상태 확인 */
    async getSTTStatus() {
        const res = await fetch(`${BASE}/api/stt_stream/status`)
        if (!res.ok) throw new Error(`GET /api/stt_stream/status ${res.status}`)
        return res.json()
    },

    /** WebSocket URL (React에서 실시간 결과 수신용) */
    getSTTWebSocketUrl() {
        return `${BASE.replace("http", "ws")}/ws/stt`
    },

    // ✅ 팩트체크 리포트 저장
    async saveFactcheckReport(payload: {
        customerName: string;
        phoneNumber: string;
        sessionId?: string;
        items: Array<{
            type: 'high' | 'medium' | 'low';
            category: string;
            description: string;
            regulation: string;
            suggestion: string;
            originalText?: string;
            timestamp?: string;
        }>;
    }) {
        const res = await fetch(`${BASE}/factchecks/report`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`POST /factchecks/report ${res.status}: ${text}`);
        }
        return res.json();
    },
};
