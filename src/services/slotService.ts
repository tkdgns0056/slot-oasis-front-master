import _axios from './index.ts'
import axios from 'axios'


interface SlotRequest extends Pagaable {
  type: string | undefined
  productName: string | undefined
  keyword: string | undefined
  ms: string | undefined
  category: string | undefined
  mid: string | undefined
  memo: string | undefined
}

interface Slot {
  type: string
  name: string
  productName: string
  keyword: string
  ms: string
  category: string
  mid: string
  memo: string
  solotCount: number
  cuser: string
  cdate: string
  uuser: string
  udate: string
}

const fetchPage = async (params: SlotRequest) => {
  return _axios.get<Page<Slot>>('/api/v1/slots/page', { params })
}

const save = async (params: any) => {
  return _axios.post<Page<Slot>>('/api/v1/slots', params)
}
export default {
  fetchPage,
  save,
}