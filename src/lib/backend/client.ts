// 백엔드 API 호출 공통 함수
// 주소 앞부분(http://localhost:8080)과 res.json() 을 매번 쓰지 않도록 모아둠
// options: { method: "DELETE" } 처럼 GET 이외의 요청도 보낼 수 있게
export const apiFetch = (url: string, options?: RequestInit) =>
  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, options).then(
    (res) => res.json(),
  );
