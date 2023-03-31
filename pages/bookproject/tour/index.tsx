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
import { getSearchDetail } from "@/pages/api/bookproject/search/search.detail";

import { useAuth } from "@/contexts/auth_user.context";
import Image from "next/image";

interface Props {
  /** 인기순위 순서로 뽑은 책 상세내역 **/
  rankbook: any;
  scorebook: any;
  categorybook: any;
}
function Tour({ rankbook, scorebook, categorybook }: Props) {
  /** 순위에 맞춰 저장된 책 apidata List*/
  const rankData = JSON.parse(rankbook);
  const scoreData = JSON.parse(scorebook);
  const categoryData = JSON.parse(categorybook);
  const { authUser } = useAuth();

  let length: number = 6;
  if (categoryData.length < 6) {
    // setLength(categoryData.length);
    length = categoryData.length;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
  };
  const mysettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: length,
    slidesToScroll: length,
  };
  return (
    <ServiceLayout>
      <p className="px-4 mt-10 mb-5 text-lg font-semibold">둘러보기</p>

      {/* 가장 좋아하는 장르 순위 */}
      {authUser && (
        <div className=" bg-white w-full h-fit py-10 px-10 rounded-xl border">
          <div className="flex gap-x-5 items-end mb-8">
            <div className="text-xl font-semibold flex gap-x-2">
              {authUser?.displayName}님이 가장 좋아하는
              <p className="text-yellow-400"> {categoryData[0]?.field}</p> 장르
              Best
            </div>
            <p className="text-gray-500 text-sm">
              가장 많이 저장한 장르의 책을 유저들 추천 순으로 소개할게요
            </p>
          </div>
          <Slider {...mysettings}>
            {categoryData.map((category: any) => (
              <Link
                key={category.api.isbn}
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
                  className="object-cover object-center border bg-gray-100 w-44 mx-auto h-60"
                />
                <div className="w-44 mt-4 mx-auto">
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

      {/* 저장순 */}
      <div className="mt-10 bg-white w-full h-fit py-10 px-10 rounded-xl border">
        <div className="flex gap-x-5 items-end mb-8">
          <div className="text-xl font-semibold ">
            가장 많이 읽은 바로 그 책
          </div>
          <p className="text-gray-500 text-sm">
            유저들이 가장 많이 저장한 책은 읽어보셨나요?
          </p>
        </div>
        <Slider {...settings}>
          {rankData.map((rank: any) => (
            <Link
              key={rank.isbn}
              href={{
                pathname: `/bookproject/search/isbn=${rank.isbn}&isbn13=${
                  rank.isbn13 ? rank.isbn13 : "null"
                }/detail`,
                query: { data: JSON.stringify(rank) },
              }}
              className=""
            >
              <Image
                alt="책표지"
                src={rank.cover}
                width={500}
                height={500}
                className="object-cover object-center border bg-gray-100 w-44 mx-auto h-60"
              />
              <div className="w-44 mt-4 mx-auto">
                <div className="text-base line-clamp-1 font-semibold">
                  {rank.title}
                </div>
                <div className="text-sm line-clamp-1">{rank.author}</div>
              </div>
            </Link>
          ))}
        </Slider>
      </div>

      {/* 추천순 */}
      <div className="mt-10 bg-white w-full h-fit py-10 px-10 rounded-xl border">
        <div className="flex gap-x-5 items-end mb-8">
          <div className="text-xl font-semibold ">모두가 추천하는 그 책</div>
          <p className="text-gray-500 text-sm">
            유저들이 별점을 가장 높게 준 책, 믿고 읽어보세요!
          </p>
        </div>
        <Slider {...settings}>
          {scoreData.map((score: any) => (
            <Link
              key={score.api.isbn}
              href={{
                pathname: `/bookproject/search/isbn=${score.api.isbn}&isbn13=${
                  score.api.isbn13 ? score.api.isbn13 : "null"
                }/detail`,
                query: { data: JSON.stringify(score.api) },
              }}
              className=""
            >
              <Image
                alt="책표지"
                src={score.api.cover}
                width={500}
                height={500}
                className="object-cover object-center border bg-gray-100 w-44 mx-auto h-60"
              />
              <div className="w-44 mt-4 mx-auto">
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
                  {"평균 " + score.score.score.toFixed(1) + "점"}
                </div>
                <div className="mt-2 text-base line-clamp-1 font-semibold">
                  {score.api.title}
                </div>
                <div className="text-sm line-clamp-1">{score.api.author}</div>
              </div>
            </Link>
          ))}
        </Slider>
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
      rankbooklist.push(bookinfo.data.apidata);
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
    },
  };
};

export default Tour;
