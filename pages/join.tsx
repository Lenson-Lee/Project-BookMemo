import ServiceLayout from "@/components/service_layout";
import { GoogleLoginBtn } from "@/components/Login/google_login_btn";
import { KakaoLoginBtn } from "@/components/Login/kakao_login_btn";
import { NextPage } from "next";
import { useAuth } from "@/contexts/auth_user.context";
import LoginButton from "@/components/Login/loginButton";
import { useEffect } from "react";
import { signIn, useSession, signOut } from "next-auth/react";

const JoinPage: NextPage = () => {
  const { signInWithGoogle } = useAuth();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      console.log("NextAuth 로그인 했어용", session.user);
    } else {
      console.log("로그아웃 완료", session);
    }
  }, [session]);

  async function joinAuth(form: string) {
    //로그인 하면서 일단DB에 넣어보고 있으면 종료 없으면 추가하자
    //DB에 있는지 확인하고 ? 어떻게 해야 좋을지..
    //꼭 uid를 써야할까..? 어차피 sns 연동 로그인만 가능하다면 이메일을 사용해보자
    signIn(form);

    //파이어베이스 add
    const resp = await fetch("/api/members.add", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: session?.user.email ? session.user.email : "sampleUserID",
        email: session?.user.email ? session.user.email : "test",
        displayName: session?.user.name
          ? session.user.name
          : "이름이 없을 수가 있나요",
        photoURL: session?.user.image ? session.user.image : "사진이없어요",
      }),
    });

    console.info({ status: resp.status });
    const respData = await resp.json();
    console.info(respData);
  }
  return (
    <>
      <ServiceLayout>
        {/* <LoginButton /> next-auth 연습 */}
        <GoogleLoginBtn onClick={signInWithGoogle} />

        <div className="mt-20 flex gap-x-5 w-fit items-start">
          <button
            onClick={() => {
              joinAuth("kakao");
            }}
            className="bg-yellow-300 rounded-full px-7 py-2 mx-auto flex justify-center gap-x-5 text-white text-lg"
          >
            <p>Kakao 계정으로 시작하기</p>
          </button>
          <button
            className="mx-auto h-fit bg-white border-2 border-yellow-400 text-yellow-400 px-4 py-2 rounded-full"
            onClick={() => {
              signOut();
            }}
          >
            카카오 로그아웃
          </button>
        </div>
        <div className="mt-10 flex gap-x-5">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-full"
            onClick={() => joinAuth("google")}
          >
            google Next연습용 로그인
          </button>
          <button
            className="bg-white border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full"
            onClick={() => signOut()}
          >
            google Next연습용 아웃
          </button>
        </div>
        <div className="mt-10 flex gap-x-5">
          <button
            className="bg-emerald-400 text-white px-4 py-2 rounded-full"
            onClick={() => joinAuth("naver")}
          >
            Naver 로그인
          </button>
          <button
            className="bg-white border-2 border-emerald-400 text-emerald-400 px-4 py-2 rounded-full"
            onClick={() => signOut()}
          >
            Naver 아웃
          </button>
        </div>
      </ServiceLayout>
    </>
  );
};

export default JoinPage;
