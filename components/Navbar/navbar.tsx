import { useAuth } from "@/contexts/auth_user.context";
import Link from "next/link";
import SearchBar from "../SearchBar/searchbar";
import { signIn, useSession, signOut } from "next-auth/react";
import Image from "next/image";

const navbar = function () {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loading, authUser, signOut, signInWithGoogle } = useAuth();

  const logOutBtn = (
    <div className="flex gap-x-4 items-center ">
      <button className="flex items-center gap-x-2">
        <Image
          src={authUser?.photoURL ?? "https://bit.ly/broken-link"}
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
    <div className="bg-white border-b">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-3 py-5">
        <Link
          href="/"
          className="font-dangam flex items-start justify-center text-center text-3xl font-semibold text-yellow-300"
        >
          My Book{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        </Link>
        <div className="flex gap-x-16">
          <Link
            href={{
              pathname: `/${authUser?.email?.replace("@gmail.com", "")}`,
              query: { uid: authUser?.uid },
            }}
            className="text-lg font-semibold"
          >
            나의 서재
          </Link>
          <Link
            href={{ pathname: "/tour", query: { uid: authUser?.uid } }}
            className="text-lg font-semibold"
          >
            둘러보기
          </Link>
        </div>
        <SearchBar />
        <div className="flex items-center gap-x-2">
          {loading || authUser === null ? logInBtn : logOutBtn}
          {/* <div className="border border-gray-300 rounded-lg px-3 py-1 font-semibold">
            회원가입
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default navbar;
