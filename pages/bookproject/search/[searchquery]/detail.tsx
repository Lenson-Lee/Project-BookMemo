import { GetServerSideProps } from "next";
import ServiceLayout from "@/components/bookProject/service_layout";
import { useRouter } from "next/router";
import BookInfo from "@/components/bookProject/Info/BookInfo";
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getSimilarList } from "@/pages/api/bookproject/search/search.similar.book";
import Link from "next/link";
import Image from "next/image";
import react, { useState, useEffect } from "react";

import { useAuth } from "@/contexts/auth_user.context";
import { getComment } from "@/pages/api/bookproject/comment/comment.get";
import Sample from "@/components/bookProject/List/comment/commentSampleList";
//[검색어] 를 받기 위해 getServerSideProps 사용
// url에 넘어온 쿼리를 받는 방식은 getStaticProps에서 hook(useRouter)을 사용할 수 없어 실패

interface Props {
  similar: any;
  commentDB: any;
}
interface AddType {
  title: string;
  userId: string;
  displayName: string;
  isbn: string;
  isbn13: string;
  content: string;
  score: any;
}
interface LikeType {
  id: number;
  like: number;
}
function SearchQuery({ similar, commentDB }: Props) {
  const settings = {
    dots: true,
    infinite: false,
    arrows: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const authUser = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const query = router.query; // 클릭한 책의 정보

  const querydata =
    query && query.data ? JSON.parse(query.data as string) : null;

  const [open, setOpen] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [score, setScore] = useState<number>(0);

  /** useQuery로 값 추가되었을 때 갱신 */
  const queryFn = async () => {
    const res = await fetch(
      `/api/bookproject/comment/comment.query.get?isbn=${querydata?.isbn}`
    );
    const commentlist = await res.json();
    return commentlist.data;
  };
  const { data } = useQuery(["comment"], queryFn, {
    staleTime: 1000,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  /** 기록 추가 (데이터 POST) */
  async function submitQuery(addData: AddType) {
    const response = await fetch(`/api/bookproject/comment/comment.add`, {
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

  /** 좋아요 클릭 이벤트 */
  async function likeQuery(likeData: LikeType) {
    const response = await fetch(`/api/bookproject/comment/comment.like.add`, {
      method: "POST",
      body: JSON.stringify(likeData),
      headers: {
        Accept: "application / json",
      },
    });
    return response.json();
  }
  const likeMutation = useMutation(
    (likeData: LikeType) => likeQuery(likeData),
    {
      onSuccess: () => {
        // postTodo가 성공하면 todos로 맵핑된 useQuery api 함수를 실행합니다.
        queryClient.invalidateQueries("comment");
        console.log("like useMutation > POST");
      },
    }
  );

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady]);
  //
  return (
    <ServiceLayout>
      <div className="mt-10 lg:mt-20 mb-10 bg-white w-full h-fit px-6 pt-6 pb-10 lg:pt-10 lg:pb-10 lg:px-20 rounded-xl border">
        <BookInfo state="search" apidata={querydata} mydata></BookInfo>
      </div>
      <div className="mt-10 lg:mt-20 mb-10 bg-white w-full h-fit px-6 pt-6 pb-10 lg:pt-10 lg:pb-10 lg:px-20 rounded-xl border">
        <div className="lg:flex justify-between items-center">
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
          <div className="fixed bg-black/25 z-10 left-0 right-0 top-0 h-screen">
            <div className="max-w-screen-lg mx-auto mt-5 lg:mt-44 bg-white shadow-lg border rounded-xl pt-16 px-6 pb-20 lg:pb-10 lg:px-20">
              <div className="text-xl font-semibold">{querydata.title}</div>
              <div className="mt-2 flex gap-x-2">
                <div className="text-sm">{querydata.author}</div>
                <div className="text-sm">{querydata.categoryName}</div>
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
                    setComment("");
                  }}
                  className=" bg-gray-300 text-white font-semibold px-4 py-1 rounded-lg text-lg"
                >
                  취소하기
                </button>

                <button
                  onClick={() => {
                    postMutation.mutate({
                      title: querydata.title,
                      userId: authUser.authUser?.uid ?? "undefine",
                      isbn: querydata.isbn,
                      isbn13: querydata.isbn_13,
                      content: comment,
                      score: score,
                      displayName: authUser.authUser?.displayName ?? "홍길동",
                    });
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
            data.map((item: any, index: number) => {
              return (
                <div key={item.id + index} className="mt-2">
                  <div className="mx-2 p-5 rounded-lg bg-gray-100 h-56">
                    {/* profile */}
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                      <div className="flex gap-x-2 items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 border" />
                        <p className="text-lg font-medium">
                          {item?.displayName}
                        </p>
                      </div>
                      {/* 좋아요 💔1인당 1회만 가능하도록 해야한다 */}
                      <button
                        onClick={() => {
                          likeMutation.mutate({
                            id: item.id,
                            like: item.like + 1,
                          });
                        }}
                        className="px-2 py-1 bg-white border rounded-full text-sm text-rose-400 flex gap-x-1 items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                        </svg>
                        <p>좋아요</p>
                        <p>{item.like}</p>
                      </button>
                    </div>
                    {/* content */}
                    <div className="line-clamp-5">{item.content}</div>
                  </div>
                </div>
              );
            })}
        </Slider>
        {data?.length < 1 && <Sample />}
      </div>
      <div className="mt-10 lg:mt-20 mb-10 bg-white w-full h-fit px-6 pt-6 pb-10 lg:pt-10 lg:pb-10 lg:px-20 rounded-xl border">
        <div className="lg:flex gap-x-5 items-end mb-8 ">
          <p className="text-xl font-semibold">이런 책은 어떠세요?</p>

          <p className="text-gray-500 text-sm">
            유사한 카테고리의 책을 엄선해 봤어요
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-2 gap-y-8">
          {similar.similar.item.map((book: any, index: number) => (
            <Link
              href={{
                pathname: `/bookproject/search/isbn=${book.isbn}&isbn13=${
                  book.isbn13 ? book.isbn13 : "null"
                }/detail`,
                query: { data: JSON.stringify(book) },
              }}
              key={book.title + index}
              className=""
            >
              <Image
                alt="책표지"
                src={book.cover}
                width={500}
                height={500}
                className="object-cover object-center border bg-gray-100 mx-auto w-36 h-44 lg:w-44 lg:h-60"
              ></Image>
              <div className="w-36 lg:w-44 mt-4 mx-auto">
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
