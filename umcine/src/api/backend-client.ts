import ky from "ky";
import { env } from "../config/env";

// 우리 백엔드(Spring)용 클라이언트예요. 회원 · 평점처럼 우리 서비스에만 있는 데이터를 불러와요.
export const backendClient = ky.create({
  baseUrl: `${env.backendApiBaseUrl}/`,
});
