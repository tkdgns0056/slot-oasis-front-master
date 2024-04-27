import _axios from './index.ts'


interface PaymentRequest extends Pagaable {
  userIdx: number
}

interface Payment {
  idx: string
  type: string
  amount: number
  startDt: string
  endDt: string
}

const fetchPage = async (params: PaymentRequest) => {
  return _axios.get<Page<Payment>>('/api/v1/payments/page', { params })
}

const fetchHistoryPage = async (params: any) => {
  return _axios.get<Page<Payment>>('/api/v1/payments/history/page', { params })
}

const fetchAmountByType = async () => {
  return _axios.get<any>('/api/v1/payments/amount')
}

const save = async (params: any) => {
  return _axios.post<Page<Payment>>('/api/v1/payments', params)
}

export default {
  fetchPage,
  fetchAmountByType,
  fetchHistoryPage,
  save,
}

