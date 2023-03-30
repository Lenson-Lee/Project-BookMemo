import { GetServerSideProps } from "next";
import ServiceLayout from "@/components/service_layout";
import { useRouter } from "next/router";
import BookInfo from "@/components/Info/BookInfo";
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { getMemberMemoList } from "@/pages/api/membermemo/member.memo.get";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getSimilarList } from "@/pages/api/search/search.similar.book";
import Link from "next/link";
import Image from "next/image";
import react, { useState } from "react";

import { useAuth } from "@/contexts/auth_user.context";
import { getComment } from "@/pages/api/comment/comment.get";
import Sample from "@/components/List/commentSampleList";
//[검색어] 를 받기 위해 getServerSideProps 사용
// url에 넘어온 쿼리를 받는 방식은 getStaticProps에서 hook(useRouter)을 사용할 수 없어 실패

interface Props {
  similar: any;
  commentDB: any;
}
interface AddType {
  userId: string;
  displayName: string;
  isbn: string;
  isbn13: string;
  content: string;
  score: any;
}
function SearchQuery({ similar, commentDB }: Props) {
  const settings = {
    dots: false,
    infinite: false,
    // draggable: false,
    arrows: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  const authUser = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const query = router.query; // 클릭한 책의 정보

  const querydata =
    query && query.data ? JSON.parse(query.data as string) : null;
  console.log(commentDB);
  const [open, setOpen] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [score, setScore] = useState<number>(0);

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

  /** useQuery로 값 추가되었을 때 갱신 */
  const queryFn = async () => {
    const res = await fetch(
      `/api/comment/comment.query.get?isbn=${querydata?.isbn}`
    );
    const commentlist = await res.json();
    return commentlist.data;
  };

  const { data } = useQuery(["comment"], queryFn, {
    staleTime: 10,
  });

  /** 기록 추가 (데이터 POST) */
  async function submitQuery(addData: AddType) {
    const response = await fetch(`/api/comment/comment.add`, {
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
      queryClient.invalidateQueries("comment");
      console.log("useMutation > POST");
    },
  });
  //
  return (
    <ServiceLayout>
      <div className="bg-white w-full py-10 mt-20 rounded-xl">
        <div className="mx-20">
          <BookInfo state="search" apidata={querydata} mydata></BookInfo>
        </div>
      </div>
      <div className="bg-white w-full py-10 px-20 mt-10 rounded-xl">
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold mb-4">독자들의 코멘트</p>
          <div className="flex gap-x-2">
            <button
              onClick={() => {
                // setOpen(true);
              }}
              className="border text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg px-2 py-1 text-sm h-fit"
            >
              나의 코멘트 보기
            </button>
            <button
              onClick={() => {
                setOpen(true);
              }}
              className="border text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg px-2 py-1 text-sm h-fit"
            >
              코멘트 추가
            </button>
          </div>
        </div>
        {open && (
          <div className="fixed z-50 bg-black/25 left-0 right-0 top-0 h-screen">
            <div className="max-w-screen-md mx-auto mt-44 bg-white border rounded-xl pt-16 pb-10 px-20">
              <div className="text-xl font-semibold">{querydata.title}</div>
              <div className="mt-2 flex gap-x-2">
                <div className="text-sm">{querydata.author}</div>
                <div className="text-sm">{querydata.categoryName}</div>
              </div>
              <div className="mt-4 flex gap-x-4 items-center text-sm">
                <p className="px-2 py-1 rounded-lg bg-yellow-100 text-amber-500">
                  별점주기
                </p>
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
              {/* edit zone */}
              <textarea
                onChange={(e) => {
                  setComment(e.currentTarget.value);
                }}
                placeholder={
                  "    ハ____ハ    ｡ ﾟﾟ･ ｡ ･ﾟﾟ ｡\n ꒰   ⬩ ω ⬩  ꒱  ˚｡          ｡˚\n |   つ~ 코멘트　ﾟ ･｡･ﾟ"
                }
                className="mt-8 outline-none resize-none w-full h-96 bg-gray-100 rounded-lg p-5"
              />
              {/* button zone */}
              <div className="mt-5 flex gap-x-4 justify-center">
                <button
                  onClick={() => {
                    setOpen(false);
                    setStar([false, false, false, false, false]);
                    setComment("");
                  }}
                  className=" bg-gray-300 text-white font-semibold px-4 py-1 rounded-lg text-lg"
                >
                  취소하기
                </button>

                <button
                  onClick={() => {
                    postMutation.mutate({
                      userId: authUser.authUser?.uid ?? "undefine",
                      isbn: querydata.isbn,
                      isbn13: querydata.isbn_13,
                      content: comment,
                      score: score,
                      displayName: authUser.authUser?.displayName ?? "홍길동",
                    });
                    //   if (targetMemo) {
                    //     updateMutation.mutate({
                    //       id: targetMemo.id,
                    //       content: memo.length > 0 ? memo : targetMemo.content,
                    //       keywords:
                    //         keywordArr.length > 0
                    //           ? JSON.stringify(keywordArr)
                    //           : targetMemo.keyword,
                    //     });
                    // } else {
                    //   postMutation.mutate({
                    //     userId: authUser.authUser?.uid ?? "undefine",
                    //     isbn: isbn,
                    //     isbn13: isbn_13,
                    //     content: memo,
                    //     keywords: JSON.stringify(keywordArr),
                    //   });
                    // }
                  }}
                  className=" bg-yellow-300 text-white font-semibold px-4 py-1 rounded-lg text-lg"
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>
        )}
        <Slider {...settings}>
          {data &&
            data.map((item: any) => {
              console.log(item);
              return (
                <div key={item.id} className="mt-2">
                  <div className="mx-2 p-5 rounded-lg bg-gray-100 h-56">
                    {/* profile */}
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                      <div className="flex gap-x-2 items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 border" />
                        <p className="text-lg font-medium">
                          {item?.displayName}
                        </p>
                      </div>
                      {/* 좋아요 */}
                      <div className="px-2 py-1 bg-white border rounded-full text-sm text-rose-400 flex gap-x-1 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                        </svg>

                        <p>{item.score}</p>
                      </div>
                    </div>
                    {/* content */}
                    <div className="line-clamp-5">{item.content}</div>
                  </div>
                </div>
              );
            })}
          {data === null && <Sample />}
        </Slider>
      </div>
      <div className="bg-white w-full py-10 px-20 mt-10 rounded-xl">
        <div className="flex gap-x-5 items-end mb-8 ">
          <p className="text-xl font-semibold">이런 책은 어떠세요?</p>

          <p className="text-gray-500 text-sm">
            유사한 카테고리의 책을 엄선해 봤어요
          </p>
        </div>
        <div className="grid grid-cols-5 gap-x-2 gap-y-8">
          {similar.similar.item.map((book: any, index: number) => (
            <Link
              href={{
                pathname: `/search/isbn=${book.isbn}&isbn13=${
                  book.isbn13 ? book.isbn13 : "null"
                }/detail`,
                query: { data: JSON.stringify(book) },
              }}
              key={book.title}
              className=""
            >
              <Image
                alt="책표지"
                src={book.cover}
                width={500}
                height={500}
                className="object-cover object-center border bg-gray-100 w-44 mx-auto h-60"
              ></Image>
              <div className="w-44 mt-4 mx-auto">
                <div className="line-clamp-2 text-base font-medium">
                  {book.title}
                </div>
                <div className="line-clamp-1 text-sm mt-1 font-light">
                  {book.author}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ServiceLayout>
  );
}

export default SearchQuery;

//서버사이드로 해당 isbn의 데이터 받아오기
export const getServerSideProps: GetServerSideProps<Props> = async (
  context: any
) => {
  const data = context.query.data;
  const isbn = JSON.parse(data).isbn;
  /** 🍉 react-query */
  const queryClient = new QueryClient();

  /** 유사한 책 소개 리스트 */
  const similar = await getSimilarList(JSON.parse(data as string).categoryId);

  //해당 책 모든 유저 코멘트의 기록(react-query)
  await queryClient.prefetchQuery(["comment"], () => getComment(isbn));
  const comment = JSON.parse(JSON.stringify(dehydrate(queryClient))).queries[0]
    .state.data.data.document;

  return {
    props: { similar: similar, commentDB: comment },
  };
};
