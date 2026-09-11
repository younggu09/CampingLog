import { backendUrl } from "../config";

class TokenManager {
  private isRefreshing = false;
  private refreshTokenPromise: Promise<string> | null = null;

  async fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    let accessToken = localStorage.getItem("Authorization");

    const makeRequest = async (token: string) => {
      return fetch(url, {
        ...options,
        credentials: "same-origin", // HttpOnly 쿠키 전송용
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    };

    let response = await makeRequest(accessToken || "");
    console.log(response.status);

    if (response.status === 401) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenPromise = this.refreshAccessToken();
      }

      try {
        accessToken = await this.refreshTokenPromise!;
        // 토큰 갱신 완료 후 다시 요청
        console.log("토큰 발급 후 재요청");
        response = await makeRequest(accessToken);
      } catch (error) {
        this.isRefreshing = false;
        this.refreshTokenPromise = null;
        throw error; // 토큰 갱신 실패 시 예외 처리
      }

      this.isRefreshing = false;
      this.refreshTokenPromise = null;
    }

    return response;
  }

  private async refreshAccessToken(): Promise<string> {
    console.log("refresh 재발급 시작");
    const response = await fetch(`${backendUrl}/api/members/refresh`, {
      method: "POST",
      credentials: "same-origin", // HttpOnly 쿠키 전송용
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Refresh token expired or invalid");
    }

    const token =
      response.headers.get("Authorization") ||
      response.headers.get("authorization");

    if (!token) {
      throw new Error("No authorization token received from server");
    }

    const jwt = token.startsWith("Bearer ") ? token.slice(7) : token;
    localStorage.setItem("Authorization", jwt);
    console.log(token);

    return jwt; // Bearer 제거된 순수 JWT 토큰 반환
  }
}

const tokenManager = new TokenManager();
export default tokenManager;
