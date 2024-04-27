import _axios from './index.ts'
import axios from 'axios'


interface UserRequest extends Pagaable {
  id: string | null
  name: string | null
}

interface User {
  id: string
  password: string
  name: string
  roleId: string
  enabled: boolean
  memo: string
}

const fetchPage = async (params: UserRequest) => {
  return _axios.get<Page<User>>('/api/v1/users/page', { params })
}

const save = async (params: any) => {
  return _axios.post<Page<User>>('/api/v1/users', params)
}
export default {
  fetchPage,
  save,
}