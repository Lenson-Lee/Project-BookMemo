import ServiceLayout from "@/components/bookProject/service_layout";
import BookInfo from "@/components/bookProject/Info/BookInfo";
import { getBookDetail } from "@/pages/api/bookproject/mybook/mybook.get.detail";
import { getMymemoList } from "@/pages/api/bookproject/mymemo/mymemo.get";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth_user.context";
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { getDate, getMonth, getYear, parseISO } from "date-fns";

interface Props {
  serverdata: any;
  userData: any;
}
interface AddType {
  userId: string;
  isbn: string;
  isbn13: string;
  content: string;
  keywords: any;
}

//나의 서재 책 상세정보
function DetailQuery({ serverdata, userData }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { apidata, mydata } = JSON.parse(serverdata);
  const { title, categoryName, author, isbn, isbn13 } = apidata;

  const [master, setMaster] = useState<boolean>(false); // 현재 페이지의 uid와 내 계정의 uid가 일치할 때 추가/수정/삭제 가능

  const [open, setOpen] = useState<boolean>(false);
  const [keywordInput, setKeywordInput] = useState<string>(""); // 분류되지 않은키워드 문자열

  /** ','로 구분한 단어들 배열 */
  const [keywordArr, setKeywordArr] = useState<any>([]);
  const [memo, setMemo] = useState<string>("");

  /** 수정하려는 메모 저장, 모달창에 데이터 띄움 */
  const [targetMemo, setTargetMemo] = useState<any>(null);
  /** DB에서 넘어온 해당 책의 메모 리스트 */
  const authUser = useAuth();
  const isbn_13 = isbn13 ? isbn13 : "undefine";

  const calcDay = (day: any) => {
    return (
      getYear(day) + "년 " + (getMonth(day) + 1) + "월 " + getDate(day) + "일 "
    );
  };

  useEffect(() => {
    // console.log("🙆‍♀️ ISBN 있나요?", queries);
    // console.log("🙆‍♀️ apidata 있나요?", apidata);
    // console.log("🙆‍♀️ mydata 있나요?", mydata);
    if (!router.isReady) return;
  }, [router.isReady, mydata]);

  useEffect(() => {
    console.log(router.query);
    if (router.query.uid === authUser?.authUser?.uid) {
      setMaster(true);
    } else {
      setMaster(false);
    }
  }, [router.query, authUser?.authUser?.uid]);
  /** useQuery로 값 추가되었을 때 갱신 */
  const udata = JSON.parse(userData);
  const queryFn = async () => {
    const res = await fetch(
      `/api/bookproject/mymemo/mymemo.query.get?userId=${udata.uid}&isbn=${udata.isbn}`
    );
    const data = await res.json();
    return data.data;
  };

  const { data } = useQuery(["memo"], queryFn, {
    staleTime: 10,
  });

  //

  /** 기록 추가 (데이터 POST) */
  async function submitQuery(addData: AddType) {
    const response = await fetch(`/api/bookproject/mymemo/mymemo.add`, {
      method: "POST",
      body: JSON.stringify(addData),
      headers: {
        Accept: "application / json",
      },
    });
    setOpen(false);
    return response.json();
  }
  const postMutation = useMutation((addData: AddType) => submitQuery(addData), {
    onSuccess: () => {
      // postTodo가 성공하면 todos로 맵핑된 useQuery api 함수를 실행합니다.
      queryClient.invalidateQueries("memo");
      console.log("useMutation > POST");
    },
  });
  //

  /** 기록 수정 (데이터 UPDATE) */
  async function updateQuery(updateData: {
    id: number;
    content: string;
    keywords: any;
  }) {
    const response = await fetch(`/api/bookproject/mymemo/mymemo.update`, {
      method: "put",
      body: JSON.stringify(updateData),
      headers: {
        Accept: "application / json",
      },
    });
    return response.json();
  }
  const updateMutation = useMutation(
    (updateData: { id: number; content: string; keywords: any }) =>
      updateQuery(updateData),
    {
      onSuccess: () => {
        // postTodo가 성공하면 todos로 맵핑된 useQuery api 함수를 실행합니다.
        queryClient.invalidateQueries("memo");
        console.log("useMutation > UPDATE");
        setOpen(false);
      },
    }
  );
  //

  /** 기록 삭제 (데이터 Delete) */
  async function deleteQuery(deleteData: { id: number }) {
    const response = await fetch(`/api/bookproject/mymemo/mymemo.delete`, {
      method: "delete",
      body: JSON.stringify(deleteData),
      headers: {
        Accept: "application / json",
      },
    });
    return response.json();
  }
  const deleteMutation = useMutation(
    (deleteData: { id: number }) => deleteQuery(deleteData),
    {
      onSuccess: () => {
        // postTodo가 성공하면 todos로 맵핑된 useQuery api 함수를 실행합니다.
        queryClient.invalidateQueries("memo");
        console.log("useMutation > DELETE");
        setOpen(false);
      },
    }
  );

  /** 키워드 공백 제거 및 끊기  */
  useEffect(() => {
    let arr: any = [];

    if (keywordInput.split(",").length > 0) {
      const word = keywordInput.split(",");
      word.forEach((element, index) => {
        /** 양끝 공백 제거 */
        let trim = element.trim();
        if (trim.length === 0) {
          //문자가 비어있음
          return;
        } else if (trim.length > 10) {
          alert("키워드 최대 글자 수가 초과되었습니다.");
        }
        arr.push(trim);
      });
      /** 중복값 제거 */
      const set: any = new Set(arr);
      const uniqueArr: any = [...set];
      setKeywordArr(uniqueArr);
      //
    }
  }, [keywordInput]);

  return (
    <ServiceLayout>
      <div className="mt-10 lg:mt-20 mb-10 bg-white w-full h-fit px-6 pt-6 pb-10 lg:pt-10 lg:pb-10 lg:px-20 rounded-xl border">
        <BookInfo
          state="mybook"
          apidata={apidata}
          mydata={mydata}
          master={master}
        ></BookInfo>
      </div>
      {/*  */}
      <div className="mt-10 mb-10 bg-white w-full h-fit px-6 pt-6 pb-10 lg:pt-10 lg:pb-10 lg:px-20 rounded-xl border">
        <div className="flex justify-between">
          <div className="text-xl font-semibold">
            {router.query.name + "님의 독서 기록"}
          </div>
          {master && (
            <button
              onClick={() => {
                setOpen(true);
              }}
              className="bg-yellow-300 hover:bg-yellow-400 text-white text-sm font-semibold rounded-lg px-4 py-1"
            >
              기록추가
            </button>
          )}
          {open && (
            <div className="fixed bg-black/25 z-10 left-0 right-0 top-0 h-screen">
              <div className="max-w-screen-lg mx-auto mt-5 lg:mt-44 bg-white shadow-lg border rounded-xl pt-16 px-6 pb-20 lg:pb-10 lg:px-20">
                <div className="text-xl font-semibold">{title}</div>
                <div className="mt-2 lg:flex gap-x-2">
                  <div className="text-sm">{author}</div>
                  <div className="text-sm">{categoryName}</div>
                </div>
                <div className="mt-5 flex gap-x-2 items-center text-xs lg:text-sm">
                  <label htmlFor="keyword">키워드 추가</label>
                  <input
                    name="keyword"
                    onChange={(e) => {
                      setKeywordInput(e.currentTarget.value);
                    }}
                    defaultValue={
                      targetMemo ? JSON.parse(targetMemo.keywords) : ""
                    }
                    className="border-b p-2 w-4/5 outline-none bg-white focus:border-yellow-400"
                    placeholder="키워드를 , 로 구분하여 입력해주세요 (ex : 희곡, 에세이, 힐링물)"
                  />
                </div>
                <div className="mt-2 flex gap-x-1 text-sm font-semibold">
                  {keywordArr.map((e: string, index: number) => {
                    return (
                      <div
                        key={e + index}
                        className="px-2 bg-yellow-50 text-yellow-400 border border-yellow-400 rounded-full"
                      >
                        {e}
                      </div>
                    );
                  })}
                </div>

                {/* edit zone */}
                <textarea
                  onChange={(e) => {
                    setMemo(e.currentTarget.value);
                  }}
                  defaultValue={targetMemo ? targetMemo.content : ""}
                  className="mt-4 lg:mt-10 outline-none resize-none w-full h-80 bg-gray-100 rounded-lg p-5"
                />
                {/* button zone */}
                <div className="mt-5 flex gap-x-4 justify-center">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setKeywordInput("");
                      setMemo("");
                      setKeywordArr([]);
                      setTargetMemo(null);
                    }}
                    className=" bg-gray-300 text-white font-semibold px-4 py-1 rounded-lg text-base lg:text-lg"
                  >
                    취소하기
                  </button>

                  <button
                    onClick={() => {
                      if (memo === "") {
                        alert("내용을 적어주세요 ʕ o̴̶̷᷄Ⱉo̴̶̷̥᷅⠕ʔ");
                        return;
                      } else if (targetMemo) {
                        updateMutation.mutate({
                          id: targetMemo.id,
                          content: memo.length > 0 ? memo : targetMemo.content,
                          keywords:
                            keywordArr.length > 0
                              ? JSON.stringify(keywordArr)
                              : targetMemo.keyword,
                        });
                      } else {
                        postMutation.mutate({
                          userId: authUser.authUser?.uid ?? "undefine",
                          isbn: isbn,
                          isbn13: isbn_13,
                          content: memo,
                          keywords: JSON.stringify(keywordArr),
                        });
                      }
                      setTargetMemo(null);
                      setKeywordArr([]);
                      setKeywordInput("");
                      alert(`
                        ₍ᐢ๑- ˔ -ᐢ₎   ♡
                      _(  っ  /￣￣￣/
                       (´　 ＼/＿＿＿/)
                       ——————–  🖤 완료되었습니다.
                       `);
                    }}
                    className=" bg-yellow-300 text-white font-semibold px-4 py-1 rounded-lg text-base lg:text-lg"
                  >
                    {targetMemo ? "수정하기" : "저장하기"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* List Zone */}
        <div className="mt-10 space-y-4">
          {data?.map((item: any, index: number) => {
            return (
              <div
                key={item.createdAt + index}
                className="bg-gray-50 rounded-lg w-full p-6 lg:p-10"
              >
                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">
                    {calcDay(parseISO(item.createdAt))}
                  </div>
                  {master && (
                    <div className="flex gap-x-2 text-gray-400 text-sm">
                      <button
                        onClick={() => {
                          setOpen(true);
                          setTargetMemo(item);
                        }}
                        className="hover:text-gray-500"
                      >
                        수정하기
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("해당 기록을 지우시겠습니까?")) {
                            deleteMutation.mutate({
                              id: item.id,
                            });
                          }
                        }}
                        className="hover:text-gray-500"
                      >
                        삭제하기
                      </button>
                    </div>
                  )}
                </div>

                {/* white-space : pre-wrap  \n인식하여 공백설정 */}
                <div className="mt-5 text-base whitespace-pre-wrap  text-gray-700">
                  {item.content}
                </div>

                <div className="mt-5 space-x-2 text-sm">
                  {JSON.parse(item.keywords).map((kw: string) => {
                    return (
                      <div
                        key={kw}
                        className="px-2 bg-yellow-50 text-sm text-yellow-400 border border-yellow-400 rounded-full inline"
                      >
                        {kw}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ServiceLayout>
  );
}

// mydata 넘어오는데 detail.get의 target이 새로고침하면 undefine이 잡혀서 오류 => Link as를 삭제하니 해결
export const getServerSideProps: GetServerSideProps<Props> = async (
  context: any
) => {
  /**MybookList >라우트에서 넘어온 쿼리 */

  /** apidata, mydata 받기 */
  const result = await getBookDetail({
    isbn: context.query?.isbn,
    isbn13: context.query?.isbn13,
    uid: context.query?.uid,
  });

  const userData = {
    uid: context.query?.uid,
    isbn: context.query?.isbn,
  };

  /** useQuery로 값 추가되었을 때 갱신 */
  // const queryFn = async () => {
  //   const res: any = await fetch(
  //     `/api/bookproject/mymemo/mymemo.query.get?userId=${context.query?.uid}&isbn=${context.query?.isbn}`
  //   );
  //   const data = await res.json();
  //   return data.data;
  // };

  /** 🍉 react-query */
  /** 조회한 uid와 책 정보에 따라 메모리스트 조회 **/
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["memo"], () => getMymemoList(userData));

  return {
    props: {
      serverdata: JSON.stringify(result.data),
      memodata: JSON.parse(JSON.stringify(dehydrate(queryClient))).queries[0]
        .state.data,
      userData: JSON.stringify(userData),
    },
  };
};
export default DetailQuery;
