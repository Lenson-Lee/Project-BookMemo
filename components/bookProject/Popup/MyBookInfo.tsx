import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const DatePicker = dynamic(
  () => import("@/components/bookProject/DatePicker/DatePicker")
);

/**
 * 등록/수정 할 때 사용자 독서정보 팝업
 *  */

interface Props {
  /** 상태에 전송 */
  getData: (data: any) => void;
  /** DB에 전송 */
  response: () => void;
  /** 수정하는 경우 기본값 넣고 시작 */
  mydata: any;
}
const MyBookInfo = ({ getData, response, mydata }: Props) => {
  const [bookState, setBookState] = useState<string>("finish"); //  finish, reading

  const [score, setScore] = useState<number>(0);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  /** 별점 클릭 UI */
  const [star, setStar] = useState([false, false, false, false, false]);
  /** 별 클릭 시 해당 갯수만큼 star 참/거짓 변경 */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectScore = (target: any) => {
    /** score의 갯수에 따라 숫자 변경 */
    let count = 0;
    let click = [...star];
    for (let i = 0; i < 5; i++) {
      click[i] = i < target ? true : false;
      if (i < target) {
        click[i] = true;
        count++;
      } else {
        click[i] = false;
      }
    }
    setStar(click);
    setScore(count);
  };

  const getStart = (target: any) => {
    setStart(target);
  };

  const getEnd = (target: any) => {
    setEnd(target);
  };

  useEffect(() => {
    /**클릭시 부모에게 전달 */
    getData({ score: score, start: start, end: end, bookState: bookState });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, start, end, bookState]);

  useEffect(() => {
    //mydata가 기본 Props로 들어가서 항상 true가 들어감. id로 유무 식별
    if (mydata.id) {
      selectScore(mydata.score);
      setStart(mydata.start);
      setEnd(mydata.end);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="shadow-lg mt-4 bg-white border rounded-xl pt-8 pb-10 px-12 absolute z-50">
        <div className="flex gap-x-10 items-end  mb-4">
          <button
            onClick={() => {
              setBookState("finish");
            }}
          >
            <span
              className={
                (bookState === "finish" ? "bg-yellow-300 " : "hidden") +
                " relative flex h-2 w-2 rounded-full  mb-1 mx-auto"
              }
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-300"></span>
            </span>

            <p
              className={
                bookState === "finish"
                  ? "text-black font-medium"
                  : "text-gray-400 "
              }
            >
              다 읽은 책
            </p>
          </button>
          <button
            onClick={() => {
              setBookState("reading");
            }}
          >
            <span
              className={
                (bookState === "reading" ? "bg-yellow-300 " : "hidden") +
                " relative flex h-2 w-2 rounded-full  mb-1 mx-auto"
              }
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-300"></span>
            </span>

            <p
              className={
                bookState === "reading"
                  ? "text-black font-medium"
                  : "text-gray-400 "
              }
            >
              읽고 있는 책
            </p>
          </button>
        </div>
        <div className="relative border-t pt-4 space-y-4 mb-6">
          <div className="lg:flex text-sm gap-x-2">
            <div className="flex items-center justify-center">
              <DatePicker getStart={getStart} getEnd state="start" />
              <p>부터</p>
            </div>
            {bookState === "finish" ? (
              <div className="mt-2 lg:mt-0 flex items-center justify-center">
                <DatePicker getStart getEnd={getEnd} state="end" />
                <p>까지</p>
              </div>
            ) : null}
          </div>
          <div className="flex gap-x-4 items-center text-sm">
            <p className="">별점주기</p>
            <div className="flex">
              {star.map((el, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      selectScore(index + 1);
                    }}
                    className={
                      star[index] ? "text-yellow-300" : "text-gray-200"
                    }
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            onClick={response}
            className="absolute right-0 bg-yellow-300 text-white px-5 py-1 rounded-lg text-sm"
          >
            등록
          </button>
        </div>
      </div>
    </>
  );
};

export default MyBookInfo;
