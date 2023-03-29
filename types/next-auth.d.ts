import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     next-auth 로그인 버튼 타입 오류로 작성했음
  */
  interface Session {
    user: {
      image: string;
      name: string;
      email: string;
    };
  }
}
