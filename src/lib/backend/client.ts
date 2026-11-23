// 백엔드 API 호출 공통 함수
// 주소 앞부분(http://localhost:8080)과 res.json() 을 매번 쓰지 않도록 모아둠
export const apiFetch = (url: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`).then((res) =>
    res.json(),
  );
