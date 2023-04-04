import { useAuth } from "@/contexts/auth_user.context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MyBookList = () => {
  /** 현재 페이지 */
  const [page, setPage] = useState(1);
  /** 페이지당 책 노출 수 */
  const [size, setSize] = useState(8);
  /** DB에서 넘어온 총 페이지 수 (1,2,3,4,5,6,7,8..)*/
  const [pageList, setPageList] = useState(1);
  /** 한 화면에 보이는 페이지 나열 (이전/1/2/3/4/5/다음) */
  const [maxPage, setMaxPage] = useState(5);
  const [start, setStart] = useState(1);
  // 1,2,3,4... 페이지 배열
  const [pageArr, setPageArr] = useState<any>([]);

  const [totalCount, setTotalCount] = useState();
  const [dataList, setDataList] = useState<[]>([]);
  const [state, setState] = useState<string>("finish");

  const { authUser } = useAuth();
  const router = useRouter();

  /** authUser가 들어오면 시작
      userId 값에 따라 데이터 출력 **/
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getData = async () => {
    // console.log("💔💔getData 시작");

    const data = {
      state: state,
      userId: authUser?.uid,
      page: page,
      size: size,
    };

    const response = await fetch("/api/bookproject/mybook/mybook.get", {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        Accept: "application / json",
      },
    })
      .then((res) => res.json())
      .then((jsondata) => {
        if (authUser?.uid != undefined) {
          setDataList(jsondata.result);
          setPageList(jsondata.totalpages);
          setTotalCount(jsondata.count);
        } else {
          alert("로그인 후 이용해 주세요🙏🙏");
        }
        return jsondata.result;
      })
      .catch(() => {
        console.log("실패해요ㅜㅜ");
      });
  };

  // React-query + paging
  const booklistKey = ["booklist"];

  // useQuery(booklistKey, getData, {
  //   staleTime: 10 * 1000,
  // });

  //📌authUser 들어오면 그 때 돌릴게용
  useEffect(() => {
    if (!authUser || !router.isReady) {
      return;
    }
  }, [authUser, router.isReady]);

  useEffect(() => {
    if (authUser) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  // 상태가 변하면 page = 1
  useEffect(() => {
    setPage(1);
    if (authUser) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, state]);

  useEffect(() => {
    let arr: any = [];
    if (0 < pageList && pageList > start + maxPage) {
      for (let i = start ? start : 1; i <= start + maxPage - 1; i++) {
        arr.push(i);
      }
    } else if (pageList < start + maxPage) {
      for (let i = start; i <= pageList; i++) {
        arr.push(i);
      }
    }
    setPageArr(arr);
  }, [pageList, page, start, maxPage]);

  return (
    <>
      <div className="lg:flex items-center justify-between mb-4">
        <div className="lg:flex items-end mb-4 lg:mb-0 ">
          <div className="text-xl font-semibold mr-8 mb-2 lg:mb-0 ">
            내가 저장한 책
          </div>
          <button
            onClick={() => {
              setState("finish");
            }}
            className={
              (state === "finish" ? "text-yellow-400 " : "") +
              " text-lg mr-4 font-medium"
            }
          >
            다 읽은 책
          </button>
          <button
            onClick={() => {
              setState("reading");
            }}
            className={
              (state === "reading" ? "text-yellow-400 " : "") +
              " text-lg mr-4 font-medium"
            }
          >
            읽고 있는 책
          </button>
          <button
            onClick={() => {
              console.log("wish 클릭해용");
              setState("wish");
            }}
            className={
              (state === "wish" ? "text-yellow-400 " : "") +
              " text-lg mr-4 font-medium"
            }
          >
            찜한 책
          </button>
        </div>
        <div className="flex justify-end lg:block">
          <select
            name="view"
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
            }}
            className="px-3 py-2 border rounded-lg text-sm text-gray-600 focus:border-yellow-400"
          >
            <option value={4}>4개씩 보기</option>
            <option value={8}>8개씩 보기</option>
            <option value={12}>12개씩 보기</option>
          </select>
        </div>
      </div>
      <div className="mb-8 flex gap-x-1 text-lg">
        <p className="">총</p>
        <p className="text-yellow-400 font-semibold"> {totalCount}</p>
        <p className="">권의 책이 있어요</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-8">
        {dataList.map((book: any, index: number) => (
          <Link
            href={{
              pathname: `/bookproject/${authUser?.email?.replace(
                "@gmail.com",
                ""
              )}/mybook/${book.title}`,
              query: {
                isbn: book.isbn,
                isbn13: book.isbn13 ? book.isbn13 : "null",
                uid: authUser?.uid,
              },
            }}
            key={book.isbn + index}
            className=""
          >
            <Image
              alt="책표지"
              src={book.cover}
              width={500}
              height={500}
              className="mx-auto object-cover object-center border bg-gray-100 w-36 h-44 lg:w-44 lg:h-60"
            />
            <div className="w-36 lg:w-44 mt-4 mx-auto">
              <div className="line-clamp-2 text-base font-medium">
                {book.title}
              </div>
              <div className="line-clamp-1 text-sm mt-1 font-light">
                {book.auth}
              </div>
            </div>
          </Link>
        ))}
        {dataList?.length === 0 && (
          <div>
            <div className="border bg-gray-100 text-gray-400 w-36 h-44 lg:w-44 lg:h-60 mx-auto flex items-center justify-center">
              저장한 책이 없어요 😥
            </div>
          </div>
        )}
      </div>
      {/* Paging zone __________________________________________ */}
      <div className="mt-10 lg:mt-20 flex gap-x-2 justify-center">
        {start > maxPage && (
          <button
            onClick={() => {
              setPage(start - maxPage);
              setStart(start - maxPage);
            }}
          >
            이전으로
          </button>
        )}
        {pageArr.map((item: any) => {
          return (
            <button
              key={item}
              onClick={() => {
                console.log("클릭한 버튼 : ", item);
                setPage(item);
              }}
              className={
                (page === item
                  ? "border-gray-400"
                  : "text-gray-400 border-gray-300 ") +
                " border rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer"
              }
            >
              {item}
            </button>
          );
        })}
        {pageList > start + maxPage && (
          <button
            onClick={() => {
              setPage(start + maxPage);
              setStart(start + maxPage);
            }}
          >
            다음으로
          </button>
        )}
      </div>
    </>
  );
};
export default MyBookList;
