import ServiceLayout from "@/components/bookProject/service_layout";
import { GetServerSideProps } from "next";
import {
  getHighScoreBook,
  getMostCategoryBook,
  getMostPopularBook,
} from "@/pages/api/bookproject/tour/tour.get.popular";
import Link from "next/link";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useAuth } from "@/contexts/auth_user.context";
import { useState } from "react";
import Image from "next/image";

import { getSearchDetail } from "@/pages/api/bookproject/search/search.detail";
import { getManyReadUser } from "@/pages/api/bookproject/tour/tour.get.rankuser";

interface Props {
  /** 인기순위 순서로 뽑은 책 상세내역 **/
  rankbook: any;
  scorebook: any;
  categorybook: any;
  readuser: any;
}
function Tour({ rankbook, scorebook, categorybook, readuser }: Props) {
  /** 순위에 맞춰 저장된 책 apidata List*/
  const rankData = JSON.parse(rankbook);
  const scoreData = JSON.parse(scorebook);
  const categoryData = JSON.parse(categorybook);
  const readUserData = JSON.parse(readuser).data.read;
  console.log(readUserData);
  // console.log(readUserData);//findByScreenName 사용하면 될듯
  const { authUser } = useAuth();

  const [state, setState] = useState<string>("star");
  /** 상태별로 별점순/저장순 DB 출력 */
  const [stateDB, setStateDB] = useState<any>(scoreData);

  let length: number = 6;
  if (categoryData.length < 6) {
    // setLength(categoryData.length);
    length = categoryData.length;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  const mysettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: length,
    slidesToScroll: length,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  return (
    <ServiceLayout>
      <p className="px-4 mt-10 mb-5 text-lg font-semibold">둘러보기</p>

      {/* 가장 좋아하는 장르 순위 */}
      {authUser && (
        <div className="bg-white w-full h-fit px-6 pt-6 pb-10 lg:py-10 lg:px-10 rounded-xl border">
          <div className="lg:flex gap-x-5 items-end mb-8">
            <div className="text-xl font-semibold lg:flex gap-x-2">
              💛 {authUser?.displayName}님이 가장 좋아하는
              <div className="flex gap-x-2">
                <p className="text-yellow-400"> {categoryData[0]?.field}</p>
                <p>장르 Best</p>
              </div>
            </div>
            <p className="mt-2 lg:mt-0 text-gray-500 text-sm">
              유저들의 저장순, 추천순으로 소개할게요
            </p>
          </div>
          <Slider {...mysettings}>
            {categoryData.map((category: any, index: number) => (
              <Link
                key={category.api.isbn + index}
                href={{
                  pathname: `/bookproject/search/isbn=${
                    category.api.isbn
                  }&isbn13=${
                    category.api.isbn13 ? category.api.isbn13 : "null"
                  }/detail`,
                  query: { data: JSON.stringify(category.api) },
                }}
                className=""
              >
                <Image
                  alt="책표지"
                  src={category.api.cover}
                  width={500}
                  height={500}
                  className="object-cover object-center border bg-gray-100 w-36 h-44 lg:w-44 lg:h-60 mx-auto"
                />
                <div className="w-36 lg:w-44 mt-4 mx-auto">
                  <div className="text-sm line-clamp-1 bg-yellow-50 text-yellow-400 px-2 py-1 rounded-full flex gap-x-1 items-center w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {"평균 " + category.score.score.toFixed(1) + "점"}
                  </div>
                  <div className="mt-2 text-base line-clamp-1 font-semibold">
                    {category.api.title}
                  </div>
                  <div className="text-sm line-clamp-1">
                    {category.api.author}
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      )}
      <div className="mt-10 flex justify-between gap-x-4">
        {/* 저장순 / 별점순 select해서 데이터 변경 */}
        <div className="bg-white w-2/3 h-fit px-6 pt-6 pb-10 lg:py-10 lg:px-10 rounded-xl border">
          <div className="lg:flex gap-x-4 items-end mb-8">
            <div className="text-xl font-semibold ">
              👀 유저들의 안목을 믿어보세요!
            </div>
            <div className="text-gray-500 divide-x space-x-4">
              <button
                onClick={() => {
                  setState("star");
                  setStateDB(scoreData);
                }}
                className={
                  (state === "star" ? "text-yellow-400 " : "") + " text-md"
                }
              >
                별점 높은 순
              </button>
              <button
                onClick={() => {
                  setState("save");
                  setStateDB(rankData);
                }}
                className={
                  (state === "save" ? "text-yellow-400 " : "") + " text-md pl-4"
                }
              >
                저장 많은 순
              </button>
            </div>
          </div>
          <Slider {...settings}>
            {stateDB.map((rank: any, index: number) => (
              <Link
                key={rank.api.isbn + index}
                href={{
                  pathname: `/bookproject/search/isbn=${rank.api.isbn}&isbn13=${
                    rank.api.isbn13 ? rank.api.isbn13 : "null"
                  }/detail`,
                  query: { data: JSON.stringify(rank.api) },
                }}
                className=""
              >
                <Image
                  alt="책표지"
                  src={rank.api.cover}
                  width={500}
                  height={500}
                  className="object-cover object-center border bg-gray-100 w-36 h-44 lg:w-44 lg:h-60 mx-auto"
                />
                <div className="w-36 lg:w-44 mt-4 mx-auto">
                  {/* 별점 존재시 점수 노출 */}
                  {rank?.score && (
                    <div className="text-sm line-clamp-1 bg-yellow-50 text-yellow-400 px-2 py-1 rounded-full flex gap-x-1 items-center w-fit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {"평균 " + rank?.score.score.toFixed(1) + "점"}
                    </div>
                  )}
                  <div className="text-base line-clamp-1 font-semibold">
                    {rank.api.title}
                  </div>
                  <div className="text-sm line-clamp-1">{rank.api.author}</div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>

        {/* 기록왕 */}
        <div className="bg-white w-2/3 px-6 pt-6 pb-10 lg:py-10 lg:px-10 rounded-xl border">
          <div className=" gap-x-5 items-end mb-8">
            <div className="text-xl font-semibold lg:flex gap-x-2">
              🏆 응원해요 독서왕!
            </div>
            <p className="mt-2 lg:mt-0 text-gray-500 text-sm">
              열심히 활동한 분들을 소개할게요
            </p>
          </div>
          {/* list */}
          <div className="space-y-5 text-md my-auto">
            {readUserData &&
              readUserData.map((user: any, index: number) => (
                <div
                  key={user.userId + index}
                  className="flex justify-between items-center"
                >
                  <div className="flex gap-x-2 items-center">
                    <div className="mr-2">{index + 1}</div>
                    {user.photoURL && (
                      <Image
                        src={user.photoURL}
                        alt="프로필 이미지"
                        width={500}
                        height={500}
                        className="w-8 h-8 rounded-full bg-gray-100"
                      />
                    )}
                    <p className="max-w-1/6 line-clamp-1">{user.displayName}</p>
                  </div>
                  <div className="flex gap-x-1">
                    <span className="">읽은 책</span>
                    <span className="mr-1">{user.count + " 권"}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const uid = context.query.uid;

  /** fieldcount총합으로 순서 출력*/
  const rankList = await getMostPopularBook();
  /** 전체 유저가 저장한 별점 평균 높은순으로 출력 */
  const scoreList = await getHighScoreBook();
  /** 가장 많이 독서활동을 한 사람 목록 */
  const readUser = await getManyReadUser();

  /** 찜한 책 포함 내가 주로 읽는 책 1등 추출 후 랭킹별 책 출력 */
  let mostCategoryList: any;
  if (uid) {
    mostCategoryList = await getMostCategoryBook(uid);
  }

  //______________________________________________________________________________
  let rankbooklist: any = [];
  let scorebooklist: any = [];
  let categorybooklist: any = [];
  /** popular 순서로 상세정보 GET 한 후 배열에 push */

  // api 받아오기 반복문
  // async await {for } -> 데이터별로해도 된다
  for (let i = 0; i < 12; i++) {
    //저장 많은 책 랭킹
    if (rankList.data.popular[i]) {
      const bookinfo = await getSearchDetail({
        isbn13: rankList.data.popular[i].isbn13,
      });
      rankbooklist.push({ api: bookinfo.data.apidata });
    }

    //별점 높은 책 랭킹
    if (scoreList.data.highscore[i]) {
      const bookinfo = await getSearchDetail({
        isbn13: scoreList.data.highscore[i].isbn13,
      });
      scorebooklist.push({
        api: bookinfo.data.apidata,
        score: scoreList.data.highscore[i]._avg,
      });
    }

    //좋아하는 장르 책 별점 순위
    if (mostCategoryList?.data.highscore[i]) {
      const bookinfo = await getSearchDetail({
        isbn13: mostCategoryList.data.highscore[i].isbn13,
      });
      categorybooklist.push({
        api: bookinfo.data.apidata,
        score: mostCategoryList.data.highscore[i]._avg,
        field: mostCategoryList.data.field,
      });
    }
  }
  return {
    props: {
      rankbook: JSON.stringify(rankbooklist),
      scorebook: JSON.stringify(scorebooklist),
      categorybook: JSON.stringify(categorybooklist),
      readuser: JSON.stringify(readUser),
    },
  };
};

export default Tour;
