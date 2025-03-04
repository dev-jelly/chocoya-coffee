import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * NextAuth의 Session 타입을 확장하여 사용자 ID를 포함시킵니다.
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
} 