import ServiceLayout from "@/components/bookProject/service_layout";
import Image from "next/image";
import { useAuth } from "@/contexts/auth_user.context";

const UserInfo = () => {
  const { loading, authUser, signOut, signInWithGoogle } = useAuth();

  /** 로그인 상태 유저 정보 + 로그아웃 버튼*/
  const logOutBtn = (
    <div className="">
      <div className="flex-col items-center justify-center">
        <Image
          src={authUser?.photoURL ?? "/images/undefined.svg"}
          className="w-20 h-20 rounded-full border"
          alt={"유저프로필사진"}
          width={500}
          height={500}
        />
        <p className="font-semibold mt-4 text-center">
          {authUser?.displayName + "님" ?? "unknown"}
        </p>
      </div>
      <button
        className="mt-4 block mx-auto border rounded-lg text-xs text-gray-600 px-2 py-1 h-fit cursor:pointer"
        onClick={signOut}
      >
        로그아웃
      </button>
    </div>
  );

  const logInBtn = (
    <>
      <button
        className="rounded-lg px-3 py-1 font-semibold bg-yellow-300 hover:bg-yellow-400 text-white"
        onClick={signInWithGoogle}
      >
        로그인
      </button>
      <button
        onClick={signInWithGoogle}
        className="rounded-lg px-3 py-1 font-semibold bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-400"
      >
        회원가입
      </button>
    </>
  );
  return (
    <>
      <ServiceLayout>
        <div className="bg-white rounded-xl border mt-10 py-20 flex items-center justify-center gap-x-2">
          {loading || authUser === null ? logInBtn : logOutBtn}
          {/* <div className="border border-gray-300 rounded-lg px-3 py-1 font-semibold">
            회원가입
          </div> */}
        </div>
      </ServiceLayout>
    </>
  );
};

export default UserInfo;
