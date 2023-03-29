import { useEffect, useState } from "react";
import { InAuthUser } from "@/models/in_auth_user";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import FirebaseClient from "@/models/firebase_client";

export default function useFirebaseAuth() {
  //Auth User 값을 반환
  const [authUser, setAuthUser] = useState<InAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    //index.tsx의 구글 로그인 버튼에서는 promise를 사용했기 때문에 then/catch 를 사용했지만
    //여기서는 바로 async/await를 사용하기 때문에 try/catch 사용
    try {
      const signInResult = await signInWithPopup(
        FirebaseClient.getInstance().Auth,
        provider
      );

      if (signInResult.user) {
        //파이어베이스 add
        const resp = await fetch("/api/members.add", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: signInResult.user.uid,
            email: signInResult.user.email,
            displayName: signInResult.user.displayName,
            photoURL: signInResult.user.photoURL,
          }),
        });

        console.info({ status: resp.status });
        const respData = await resp.json();
        console.info(respData);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /** 로그아웃 > 모든걸 초기화 */
  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };
  const signOut = () => FirebaseClient.getInstance().Auth.signOut().then(clear);

  // 로그인 상태가 변경되었을 때(로그아웃 되었을때는 비우고 종료)
  const AuthStateChanged = async (authState: User | null) => {
    if (authState === null) {
      setAuthUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setAuthUser({
      uid: authState.uid,
      email: authState.email,
      photoURL: authState.photoURL,
      displayName: authState.displayName,
    });
    setLoading(false);
  };

  // 로그인을 하고 나면 정보변경시점에 데이터를 받아낼 수 있음
  useEffect(() => {
    const unsubscribe =
      FirebaseClient.getInstance().Auth.onAuthStateChanged(AuthStateChanged);

    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithGoogle,
    signOut,
  };
}
