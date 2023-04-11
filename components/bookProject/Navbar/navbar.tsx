import { useAuth } from "@/contexts/auth_user.context";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "../SearchBar/searchbar";

const Navbar = function () {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loading, authUser, signOut, signInWithGoogle } = useAuth();
  const [open, setOpen] = useState(false);
  const uid = authUser?.uid ?? "undefine";

  const [note, setNote] = useState([]);

  /** 사용자 notification 가져오기 */
  const getData = async () => {
    const response = await fetch("/api/bookproject/notification/note.get", {
      method: "POST",
      body: JSON.stringify({ userId: uid }),
      headers: {
        Accept: "application / json",
      },
    })
      .then((res) => res.json())
      .then((jsondata) => {
        setNote(jsondata.note);
        return jsondata.result;
      })
      .catch((err) => {
        console.log("🙏🙏알림 DB 실패해요🙏🙏", err);
      });
  };

  useEffect(() => {
    if (uid !== "undefine") {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const logOutBtn = (
    <div className="relative flex gap-x-4 items-center ">
      <button
        onClick={() => {
          setOpen(!open);
        }}
        className="relative flex items-center gap-x-2"
      >
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
        <div className="absolute top-0 -right-2 bg-rose-500 w-2 h-2 rounded-full" />
      </button>
      <button
        className="hidden lg:block border rounded-lg text-xs text-gray-600 px-2 py-1 h-fit cursor:pointer"
        onClick={signOut}
      >
        로그아웃
      </button>
      {open && (
        <div className="absolute shadow-lg right-0 top-12 border bg-white/75 backdrop-blur-lg px-4  py-2 rounded-lg w-72 cursor-pointer">
          <div
            onClick={() => {
              setOpen(false);
            }}
            className="flex justify-between items-center border-b pb-2 mb-2"
          >
            <p className="text-sm font-semibold">알림</p>
            <Link
              href={{
                pathname: `/bookproject/${authUser?.email?.replace(
                  "@gmail.com",
                  ""
                )}`,
                query: { uid: authUser?.uid },
              }}
              className="text-xs text-gray-400"
            >
              자세히
            </Link>
          </div>
          {note.length > 0 &&
            note?.map((item: any) => {
              return (
                <div key={item.id}>
                  <p className="text-sm font-light py-1 line-clamp-1">
                    {item.type === "like" &&
                      item.name + " 님이 나의 코멘트에 좋아요를 눌렀습니다."}
                  </p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );

  const logInBtn = (
    <>
      <button
        className="rounded-lg px-2 lg:px-3 py-1 text-sm lg:text-base font-semibold bg-yellow-300 hover:bg-yellow-400 text-white"
        onClick={signInWithGoogle}
      >
        로그인
      </button>
      <button
        onClick={signInWithGoogle}
        className="rounded-lg px-2 lg:px-3 py-1 text-sm lg:text-base font-semibold bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-400"
      >
        회원가입
      </button>
    </>
  );

  return (
    <div className="bg-white border-b">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-3 py-5">
        <Link
          href="/bookproject"
          className="font-dangam flex items-start justify-center text-center text-lg lg:text-3xl font-semibold text-yellow-300"
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
        <div className="hidden lg:flex lg:text-lg lg:gap-x-5">
          {uid === "undefine" && (
            <button
              onClick={() => {
                alert("로그인 후 이용해주세요💦");
              }}
              className="font-semibold"
            >
              나의 서재
            </button>
          )}
          {uid !== "undefine" && (
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
              나의 서재
            </Link>
          )}
          <Link
            href={{
              pathname: "/bookproject/tour",
              query: { uid: authUser?.uid },
            }}
            className="font-semibold"
          >
            둘러보기
          </Link>
        </div>
        <div className="hidden lg:block w-2/5">
          <SearchBar />
        </div>
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

export default Navbar;
