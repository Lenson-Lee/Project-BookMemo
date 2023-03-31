import { useEffect, useState } from "react";
import { InAuthUser } from "@/models/in_auth_user";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import FirebaseClient from "@/models/firebase_client";

import { useSession } from "next-auth/react";
export default function useNextAuth() {
  //Auth User 값을 반환
  const { data: session } = useSession();

  const [authUser, setAuthUser] = useState<InAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function signInNextAuth(): Promise<void> {
    //index.tsx의 구글 로그인 버튼에서는 promise를 사용했기 때문에 then/catch 를 사용했지만
    //여기서는 바로 async/await를 사용하기 때문에 try/catch 사용

    //구글과 다르게 joinㅍ ㅔ이지에서 바로 통신 들어가ㅗㄹ게요
    //api -> members.add 에서 method : POST 설정 후 컨틀홀러로 이동
    // member.ctrl.add에서 중복 계정 확인 후 member.model에 데이터 전송
    //최종적인 파이어베이스 저장은 멤버모델에서 실행
    //model에서 DB에 존재하는지 확인 후 추가한다. 근데 우리도 파이어배이스에 넣으니까
    //모델은 사용해도 될듯!

    //그리고 next-auth는 session을 이용해서 세션프로바이더를 만들어두었다
    try {
      const signInResult = session ? session.user : null;

      if (session) {
        console.info("🤦‍♀️세션 들어왔으니 members.add api로 갈게요");
        console.info(session);

        //파이어베이스 add
        const resp = await fetch("/api/bookproject/members.add", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: "sampleUserID",
            email: session?.user.email ? session.user.email : "test",
            displayName: session ? "sample.name" : "이름이 없을 수가 있나요",
            photoURL: "sample.photo",
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
    setLoading(true);
  };
  const signOut = () => FirebaseClient.getInstance().Auth.signOut().then(clear);

  // 로그인 상태가 변경되었을 때(로그아웃 되었을때는 비우고 종료)
  const AuthStateChanged = async (authState: User | null) => {
    if (authState === null) {
      // setAuthUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    // setAuthUser({
    //   uid: authState.uid,
    //   email: authState.email,
    //   photoURL: authState.photoURL,
    //   displayName: authState.displayName,
    // });
    setLoading(false);
  };

  // 로그인을 하고 나면 정보변경시점에 데이터를 받아낼 수 있음
  useEffect(() => {
    const unsubscribe =
      FirebaseClient.getInstance().Auth.onAuthStateChanged(AuthStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    // authUser,
    loading,
    signOut,
  };
}
