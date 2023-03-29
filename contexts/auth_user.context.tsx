import React, { createContext, useContext } from "react";
import useFirebaseAuth from "@/hooks/use_firebase_auth";
import { InAuthUser } from "@/models/in_auth_user";

interface InAuthUserContext {
  authUser: InAuthUser | null;
  loading: boolean; //로그인 진행중인지 체크
  signInWithGoogle: () => void; //구글을 이용한 로그인 동작(클릭 등)
  signOut: () => void;
}

const AuthUserContext = createContext<InAuthUserContext>({
  authUser: null,
  loading: true, //로그인진행중
  signInWithGoogle: async () => ({ user: null, creadential: null }),

  signOut: () => {},
});

// Provider : context 속에 매번 변경되는 children만 뽑아서 쓸 수 있다
// 보통 프로바이더를 만들 떄는 이런 작업을 반복한다.
export const AuthUserProvider = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleAuth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={googleAuth}>
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuth = () => useContext(AuthUserContext);
