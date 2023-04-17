import { useAuth } from "@/contexts/auth_user.context";
import Link from "next/link";
import SearchBar from "../SearchBar/searchbar";
import { signIn, useSession, signOut } from "next-auth/react";
import Image from "next/image";

const navbar = function () {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loading, authUser, signOut, signInWithGoogle } = useAuth();
  // <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t py-4 px-10">
  //   <div className="flex justify-between">
  //     <div className="">
  //       <p className="text-center text-lg">📒</p>
  //       <p className="text-gray-500 text-xs">나의 서재</p>
  //     </div>
  // <div className="">
  //   <p className="text-center text-lg">👀</p>
  //   <p className="text-gray-500 text-xs">둘러보기</p>
  // </div>
  //     <div className="">
  //       <p className="text-center text-lg">🔍</p>
  //       <p className="text-gray-500 text-xs">검색</p>
  //     </div>
  //     <div className="">
  //       <p className="text-center text-lg">👨‍🦲</p>
  //       <p className="text-gray-500 text-xs">계정</p>
  //     </div>
  //   </div>
  // </div>;
  const logOutBtn = (
    <div className="flex gap-x-4 items-center ">
      <button className="flex items-center gap-x-2">
        <Image
          src={authUser?.photoURL ?? "/images/undefined.svg"}
          className="w-10 h-10 rounded-full border"
          alt={"유저프로필사진"}
          width={500}
          height={500}
        />
        <p className="font-semibold">
          {authUser?.displayName + "님" ?? "unknown"}
        </p>
      </button>
      <button
        className="border rounded-lg text-xs text-gray-600 px-2 py-1 h-fit cursor:pointer"
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
    <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t py-4 px-6">
      <div className="flex justify-between">
        <Link
          href={{
            pathname: `/bookproject`,
          }}
          className="font-semibold"
        >
          <div className="">
            <p className="text-center text-lg">🏠</p>
            <p className="text-gray-500 text-xs text-center">홈</p>
          </div>
        </Link>
        <Link
          href={{
            pathname: `/bookproject/${authUser?.email?.replace(
              "@gmail.com",
              ""
            )}`,
            query: { uid: authUser?.uid },
          }}
          className="font-semibold"
        >
          <div className="">
            <p className="text-center text-lg">📒</p>
            <p className="text-gray-500 text-xs">나의 서재</p>
          </div>
        </Link>
        <Link
          href={{
            pathname: "/bookproject/tour",
            query: { uid: authUser?.uid },
          }}
          className="font-semibold"
        >
          <div className="">
            <p className="text-center text-lg">👀</p>
            <p className="text-gray-500 text-xs">둘러보기</p>
          </div>
        </Link>
        <Link
          href={{
            pathname: "/bookproject/search",
          }}
          className="font-semibold"
        >
          <div className="">
            <p className="text-center text-lg">🔍</p>
            <p className="text-gray-500 text-xs">검색</p>
          </div>
        </Link>
        <Link
          href={{
            pathname: "/bookproject/userInfo",
          }}
          className="font-semibold"
        >
          <div className="">
            <p className="text-center text-lg">👨‍🦲</p>
            <p className="text-gray-500 text-xs">계정</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default navbar;
