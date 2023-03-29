import { useAuth } from "@/contexts/auth_user.context";
import { useState, useEffect } from "react";
// import DatePicker from "@/components/DatePicker/DatePicker";

import dynamic from "next/dynamic";
import MyBookInfo from "../Popup/MyBookInfo";
const DatePicker = dynamic(() => import("@/components/DatePicker/DatePicker"));

interface Props {
  data: any;
}
const SearchInfo = ({ data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [bookState, setBookState] = useState<string>("finish"); //  finish, reading

  /** MyBookInfo 컴포넌트에서 받은 정보(별점, 읽은기간) */
  const [getDataList, setDataList] = useState<string | any>(null);
  const authUser = useAuth();

  const uid = authUser.authUser?.uid ?? "undefine";
  const isbn13 = data?.isbn13 ? data.isbn13 : "undefine";

  const getData = (info: any) => {
    setDataList(info);
  };

  // 데이터 전송
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function response() {
    setOpen(false);

    const postdata = {
      uid: uid,
      state: bookState,
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      isbn13: isbn13,
      score: getDataList ? getDataList.score : 0,
      start: getDataList ? getDataList.start : null,
      end: getDataList ? getDataList.end : null,
      field: JSON.stringify([
        data?.categoryName.split(">")[1],
        data?.categoryName.split(">")[2],
      ]),
      fieldcount: data?.categoryName.split(">").length > 1 ? 1 : 0,
      cover: data.cover,
    };
    console.log(postdata);
    await fetch("/api/mybook/mybook.add", {
      method: "POST",
      body: JSON.stringify(postdata),
      headers: {
        Accept: "application / json",
      },
    });
  }

  // 찜하기의 경우 클릭하면 바로 입력 : 추후에 두 번째 클릭은 찜 삭제로 처리
  useEffect(() => {
    console.log("책 상태 변경");
    if (bookState === "wish" && uid !== "undefine") {
      const result = confirm(
        "🖤찜 리스트에 들어갔어요! 나의 서재로 이동할까요?"
      );
      if (result) {
        console.log(authUser.authUser?.email?.replace("@", ""));
        document.location = `/${authUser.authUser?.email?.replace(
          "@",
          ""
        )}?uid=${uid}`;
      }
      response();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookState]);
  return (
    <div className="">
      <div className="flex gap-x-4">
        <button
          onClick={() => {
            if (uid !== "undefine") {
              setBookState("wish");
            } else {
              alert("로그인 후 이용해주세요💦");
            }
          }}
          className="bg-gray-100 text-gray-500 text-lg font-semibold px-4 py-2 flex gap-x-2 items-center rounded-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>

          <p>찜하기</p>
        </button>
        <button
          onClick={() => {
            setOpen(!open);
          }}
          className="relative bg-yellow-300 text-white text-lg font-semibold px-4 py-2 flex gap-x-2 items-center rounded-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m6-6H6"
            />
          </svg>
          <p>내 서재에 추가</p>
        </button>
      </div>
      {open && <MyBookInfo getData={getData} response={response} mydata />}
    </div>
  );
};
export default SearchInfo;
