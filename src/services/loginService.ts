import _axios from './index.ts'

// 로그인
const login = async (params: any) => {
  return _axios.post<any>('/api/v1/login/sign-in', params)
}

// 로그아웃
const logout = async (params: any) => {
  return _axios.post<any>('/api/v1/login/sign-out', params)
}

// 리프레시 토큰 재발급
const refresh = async () => {
  return _axios.post<any>('/api/v1/login/refresh')
}

export default {
  login,
  logout,
  refresh,
}