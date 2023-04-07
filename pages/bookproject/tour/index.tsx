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
import ApiBookListSlider from "@/components/bookProject/List/apiBookListSlider";
import BookListSlider from "@/components/bookProject/List/bookListSlider";
import { getBookList } from "@/pages/api/bookproject/book.list";

interface Props {
  /** 주로 읽는 장르 인기순위 순서로 뽑은 책 상세내역 **/
  categorybook: any;
  ItemNewSpecial: {}; //주목할만한 신간
}
function Tour({ categorybook, ItemNewSpecial }: Props) {
  /** 순위에 맞춰 저장된 책 apidata List*/
  const categoryData = JSON.parse(categorybook);
  // console.log(readUserData);//findByScreenName 사용하면 될듯
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
      <div className="flex gap-x-4 mt-10 mb-10">
        <div className="bg-white w-full h-fit px-6 pt-6 pb-10 lg:py-10 lg:px-10 rounded-xl border">
          <div className="lg:flex gap-x-5 items-end mb-4 lg:mb-8">
            <div className="text-xl font-semibold ">👏 주목할만한 신간</div>
            <p className="text-gray-500 text-sm">모두가 관심갖고 있어요</p>
          </div>

          <ApiBookListSlider apidata={ItemNewSpecial} slide={6} />
        </div>

        <div className="bg-white w-1/3 h-fit px-6 pt-6 pb-10 lg:py-10 lg:px-10 rounded-xl border"></div>
      </div>
    </ServiceLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const uid = context.query.uid;
  /** 주목할만한 신간 */
  const ItemNewSpecial = await getBookList("ItemNewSpecial");
  /** 찜한 책 포함 */
  let mostCategoryList: any; //제일 좋아하는 장르
  let categorybooklist: any = []; // 좋아하는 장르 순위별로 넣을 배열

  if (uid) {
    mostCategoryList = await getMostCategoryBook(uid);
  }

  // api 받아오기 반복문
  // async await {for } -> 데이터별로해도 된다
  for (let i = 0; i < 12; i++) {
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
      categorybook: JSON.stringify(categorybooklist),
      ItemNewSpecial: ItemNewSpecial.data.item,
    },
  };
};

export default Tour;
