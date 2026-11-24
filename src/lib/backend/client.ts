// 백엔드 API 호출 공통 함수
// 주소 앞부분(http://localhost:8080)과 res.json() 을 매번 쓰지 않도록 모아둠
// options: { method: "DELETE" } 처럼 GET 이외의 요청도 보낼 수 있게
export const apiFetch = (url: string, options?: RequestInit) => {
  // body가 있으면(POST, PUT) JSON으로 보낸다고 헤더에 표시
  if (options?.body) {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    options.headers = headers;
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, options).then(
    async (res) => {
      // 에러 응답도 백엔드가 RsData { resultCode, msg } JSON으로 줌 → 먼저 꺼냄
      const rsData = await res.json();

      // res.ok: 응답코드가 200~299 이면 true
      // 4xx, 5xx 이면 응답객체(rsData)를 그대로 던짐 → catch에서 rsData.msg 사용 가능
      if (!res.ok) throw rsData;

      return rsData;
    },
  );
};
