// 본인 서버에서 내려주는 응답 구조
interface APIResponse<T> {
  code: number
  message: string // 메시지
  payload: T // 데이터 내용
}
