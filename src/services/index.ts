import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestTransformer, AxiosResponse } from 'axios'
import { hideSpinner, showSpinner } from '../redux/spinnerSlice.ts'
import { alertOpen } from '../redux/alertSlice.ts'
import { store } from '../redux/store.ts'
import qs from 'qs'
import moment from 'moment'
import { deleteToken, setToken } from '../redux/authSlice.ts'
import { removeCookieToken } from '../storage/cookie.ts'

const replacer = function(this: any, key: string, value: any) {
  if (this[key] instanceof Date) {
    return moment(this[key]).format('YYYY-MM-DD HH:mm:ss')
  }
  return value
}

interface CustomAxios extends AxiosInstance {
  get<T = unknown, R = AxiosResponse<APIResponse<T>>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;

  post<T = unknown, R = AxiosResponse<APIResponse<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
}

const _axios: CustomAxios = axios.create({
//baseURL: 'http://localhost:3000', // 프론트 URL
  headers: {
    'Content-Type': 'application/json',
  },
  transformRequest: [(data) => JSON.stringify(data, replacer), ...(axios.defaults.transformRequest as AxiosRequestTransformer[])],

})

// 요청 인터셉터
_axios.interceptors.request.use(config => {
  store.dispatch(showSpinner())
  console.log('🤢 request -> ', config)

  let token: string | null = null
  token = store.getState().auth.accessToken

  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})


// 응답 인터셉터
_axios.interceptors.response.use(
  config => {
    store.dispatch(hideSpinner())
    console.log('😡 response -> ', config)

    // 응답 헤더에서 'Authorization' 헤더의 값을 가져와서 토큰 추출
    const authorizationHeader = config.headers.Authorization
    let token = null
    if (authorizationHeader) {
      const match = authorizationHeader.match(/Bearer\s+(.*)/)
      if (match && match.length === 2) {
        token = match[1]
      }
    }

    if (token) {
      store.dispatch(setToken(token))
    }

    return config
  },
  async err => {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status

      // 리프레시 토큰 만료
      if (status == 401) {
        //store.dispatch(alertOpen({ message: '인증이 만료되었습니다. 다시 로그인을 진행해 주시기 바랍니다.', severity: 'error' }))
        //TODO 확인 레이어 팝업 구현하기
        store.dispatch(deleteToken())
        removeCookieToken()
        return location.href = '/'
      }
      // 비지니스 로직 에러
      else if (status == 422) {
        store.dispatch(alertOpen({ message: err.response?.data.message, severity: 'error' }))
      }

    }
    //store.dispatch(alertOpen({ message: err.response.data.message, severity: 'error' }))
    store.dispatch(hideSpinner())
    return Promise.reject(err)
  },
)


export default _axios