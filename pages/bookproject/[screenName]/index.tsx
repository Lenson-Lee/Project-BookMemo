import MyBookList from "@/components/bookProject/List/mybookList";
import MyAllKeywordList from "@/components/bookProject/List/myAllKeywordList";
import MyAllMemoList from "@/components/bookProject/List/myAllMemoList";
import ServiceLayout from "@/components/bookProject/service_layout";
import Chart from "@/components//bookProject/Chart/Chart";
import BarChart from "@/components//bookProject/Chart/BarChart";
import { getMyTotalData } from "@/pages/api/bookproject/mymemo/mymemo.get";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth_user.context";
import getNotification from "@/pages/api/bookproject/notification/note.get";

interface Props {
  alldata: any; //장르 차트를 위한 카운트
}

function Mybook({ alldata }: Props) {
  const [openNote, setOpenNote] = useState<boolean>(false);
  const [note, setNote] = useState([]); //알림 정보

  const router = useRouter();
  const authUser = useAuth();
  /** 키워드 중복 제거 */
  const [uniqueKwList, setUniqueKwList] = useState<any>([]);

  /** 메모모음 */
  const memodata = alldata.data.memolist.memolist;
  const memotitle = alldata.data.memolist.titleArr;

  /** 월별 기록활동 카운트(기록포함) */
  const monthdata = alldata.data.month;

  const monthMemocount =
    monthdata.thisMonth.length - monthdata.lastMonth.length;

  /** react-query로 실시간 갱신 */
  /** 통계, 총 메모, 총 키워드 조회 */
  const queryFn = async () => {
    const res = await fetch(
      `/api/bookproject/mymemo/mymemo.total.get?userId=${router.query.uid}`
    );
    const data = await res.json();
    return data.data;
  };
  const { data } = useQuery(["info"], queryFn, {
    staleTime: 10 * 1000,
  });

  /** 사용자 notification 가져오기 */
  const getData = async () => {
    const response = await fetch(
      `/api/bookproject/notification/note.get?userId=${authUser.authUser?.uid}`
    )
      .then((res) => res.json())
      .then((jsondata) => {
        setNote(jsondata.note);
        return jsondata.result;
      })
      .catch((err) => {
        console.log("🙏🙏알림 DB 실패해요🙏🙏", err);
      });
  };

  /** router query를 받고 시작 */
  useEffect(() => {
    if (!router.isReady) return;
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    /** 키워드 총 집합을 위한 배열 */
    let keywordArr: any = [];
    data?.keywords.map((item: any) => {
      const data = JSON.parse(item.keywords);
      data.map((i: any) => {
        keywordArr.push(i);
      });
    });

    /** 중복 키워드 제거 */
    const set: any = new Set(keywordArr);
    const uniqueArr: any = [...set];
    setUniqueKwList(uniqueArr);
  }, [data]);
  return (
    <ServiceLayout>
      <p className="px-4 mt-10 mb-5 text-lg font-semibold">
        {router.query.uid === authUser.authUser?.uid
          ? "나의 서재"
          : `${router.query.name}님의 서재`}
      </p>

      {note.length > 0 && router.query.uid === authUser.authUser?.uid && (
        <div className="bg-white w-full p-6 lg:py-5 lg:px-10 rounded-xl border mb-4 cursor-pointer">
          <div
            onClick={() => {
              setOpenNote(!openNote);
            }}
            className="flex justify-between items-center"
          >
            <div className="flex gap-x-2 items-center text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 "
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z"
                  clipRule="evenodd"
                />
              </svg>

              <p>알림</p>
            </div>
            {openNote === false && <p className="text-sm">더보기</p>}
            {openNote === true && <p className="text-sm">닫기</p>}
          </div>
          {openNote && (
            <div className="mt-4">
              {note.length > 0 &&
                note?.map((item: any) => {
                  return (
                    <div
                      key={item.id}
                      className="flex gap-x-4 border-b py-2 my-2 cursor-pointer text-gray-600"
                    >
                      <p className="text-md font-light py-1 line-clamp-1">
                        {item.type === "like" &&
                          item.name +
                            " 님이 나의 코멘트에 좋아요를 눌렀습니다."}
                      </p>
                    </div>
                  );
                })}
              {/* <div className="flex gap-x-4 border-b py-2 my-2 cursor-pointer text-gray-600">
              <p> 2023.03.03</p>
              <p> 아가미 - 구병모 책에 남긴 회원님의 코멘트에</p>
              <p> 김** 님이 좋아요를 눌렀습니다.</p>
            </div>
            <div className="flex gap-x-4 border-b py-2 my-2 cursor-pointer text-gray-400">
              <p> 2023.03.03</p>
              <p> 아가미 - 구병모 책에 남긴 회원님의 코멘트에</p>
              <p> 김** 님이 좋아요를 눌렀습니다.</p>
            </div> */}
            </div>
          )}
        </div>
      )}

      <div className="lg:flex gap-x-4 mb-4">
        <div className="bg-white w-full lg:w-1/2 p-6 lg:py-10 lg:px-10 rounded-xl border">
          <div className="lg:flex gap-x-5 items-end">
            <p className="text-xl font-semibold">많이 읽은 장르</p>
            <p className="text-gray-500 text-xs">
              다 읽은 책, 읽고 있는 책 기준
            </p>
          </div>
          <div className="w-4/5 mx-auto mt-6 lg:mt-12 flex items-center">
            <Chart count={alldata.data.count.ctgcount} />
          </div>
        </div>
        <div className="mt-4 lg:mt-0 bg-white w-full lg:w-1/2 p-6 lg:py-10 lg:px-10 rounded-xl border">
          <div className="lg:flex gap-x-5 items-end">
            <p className="text-xl font-semibold">이달의 기록현황</p>
            {monthMemocount > 0 ? (
              <p className="text-gray-500 text-xs">
                지난달보다 기록활동이 {monthMemocount}회 증가했어요!
              </p>
            ) : null}
          </div>
          <div className="w-full lg:w-2/3 mx-auto mt-10">
            <BarChart count={monthdata} />
          </div>
        </div>
      </div>
      <div className="lg:flex gap-x-4">
        <div className="bg-white w-full h-fit p-6 lg:py-10 lg:px-10 rounded-xl border">
          <MyBookList
            uid={router.query.uid}
            name={router.query.name}
            screenName={router.query.screenName}
          />
        </div>
        <div className="mt-4 lg:mt-0 w-full lg:w-1/3 space-y-4">
          <div className="h-fit p-10 bg-white rounded-xl border">
            <MyAllKeywordList keywordList={uniqueKwList} />
          </div>
          <div className="h-fit p-10 bg-white rounded-xl border">
            <MyAllMemoList
              memodata={memodata}
              memotitle={memotitle}
              router={router.query}
            />
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
}

// 사용자의 메모 데이터 조회
export const getServerSideProps: GetServerSideProps<Props> = async (
  context: any
) => {
  const uid = context.query.uid;
  /** 🍉 react-query */
  const queryClient = new QueryClient();

  //get all
  await queryClient.prefetchQuery(["info"], () => getMyTotalData(uid));

  //너무 길어서 줄여볼겡
  const dehData = JSON.parse(JSON.stringify(dehydrate(queryClient)));
  return {
    props: {
      alldata: dehData.queries[0].state.data,
    },
  };
};

export default Mybook;
