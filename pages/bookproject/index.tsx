import { useState, useEffect, useRef } from "react";
import type { GetServerSideProps } from "next";
import { GoogleAuthProvider } from "firebase/auth";

import { getMostComment } from "@/pages/api/bookproject/comment/comment.most.get";
import { getBookList } from "@/pages/api/bookproject/book.list";

import ServiceLayout from "@/components/bookProject/service_layout";
import ApiBookListSlider from "@/components/bookProject/List/apiBookListSlider";
import BookListSlider from "@/components/bookProject/List/bookListSlider";
import CommentSlider from "@/components/bookProject/List/comment/commentListSlider";
import {
  getHighScoreBook,
  getMostPopularBook,
} from "../api/bookproject/tour/tour.get.popular";
import { getManyReadUser } from "../api/bookproject/tour/tour.get.rankuser";
import { getSearchDetail } from "../api/bookproject/search/search.detail";
import Image from "next/image";
import Link from "next/link";

const provider = new GoogleAuthProvider();

interface Props {
  Bestseller: {}; //베스트셀러
  ItemNewAll: {}; //신간 전체
  comment: any;

  rankbook: any; //저장 많은 순
  scorebook: any; //별점 높은 순
  readuser: any; //독서왕 순위
}

function Home({
  Bestseller,
  ItemNewAll,
  comment,
  rankbook,
  scorebook,
  readuser,
}: Props) {
  const data = JSON.parse(comment).data.newUserArr;

  const rankData = JSON.parse(rankbook);
  const readUserData = JSON.parse(readuser).data.read;
  const scoreData = JSON.parse(scorebook);

  const [state, setState] = useState<string>("star");
  /** 상태별로 별점순/저장순 DB 출력 */
  const [stateDB, setStateDB] = useState<any>(scoreData);

  /** 유저 클릭 시 선택옵션 출력 */
  const modalEl = useRef();
  const [openUser, setOpenUser] = useState<boolean>(false);
  const [openUserID, setOpenUserID] = useState<string>("");

  const [isDropMenuOpen, setDropMenuOpen] = useState(false);

  const toggleDropMenu = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation(); // 이벤트 캡쳐링 방지
    setOpenUser(!openUser);
  };
  return (
    <div
      onClick={() => {
        setOpenUser(false);
      }}
    >
      <ServiceLayout>
        <div className="mt-5 h-96 w-full rounded-xl flex justify-center bg-gradient-to-r from-yellow-100 to-rose-300 cursor-pointer">
          <Image
            width={500}
            height={500}
            src={"/images/bookImage.png"}
            alt="메인이미지"
            className="object-cover object-center w-72 "
          />
          <div className="pl-36 text-right w-1/2 text-white my-auto">
            <div className="flex gap-x-2 justify-end">
              <span className="bg-rose-400 px-3 rounded-full text-sm font-semibold">
                마이북
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold">
              오늘의 독서를 기록해보세요!
            </p>
            <p className="mt-5 text-lg">
              {/* 기록은 의미 있는 독서의 시작이에요! */}
              책을 읽다가 감명 깊었던 내용이 기억나지 않는 경험이 있으신가요?
            </p>
            <p className="text-lg">
              마이북에서 중요한 부분을 기록하고 공유해 보세요!
            </p>
          </div>
          {/* <Image
            width={500}
            height={500}
            src={"/images/bookImage(2).png"}
            alt="메인이미지"
            className="object-cover object-center w-[36rem]"
          /> */}
        </div>
        <div className="mt-10 mb-10 bg-white w-full h-fit px-6 pt-6 pb-10 lg:py-10 lg:px-10 rounded-xl border">
          <div className="lg:flex gap-x-5 items-end mb-4 lg:mb-8">
            <div className="text-xl font-semibold ">🥇 베스트셀러</div>
            <p className="text-gray-500 text-sm">
              실시간 베스트셀러를 알려드려요.
            </p>
          </div>
          <ApiBookListSlider apidata={Bestseller} slide={6} />
        </div>

        <div className="mt-10 flex justify-between gap-x-4">
          {/* 저장순 / 별점순 select해서 데이터 변경 */}
          <div className="bg-white w-2/3 h-fit px-6 pt-6 pb-10 lg:py-10 lg:px-10 rounded-xl border">
            <div className="lg:flex gap-x-4 items-end mb-8">
              <div className="text-xl font-semibold ">
                👀 유저들의 안목을 믿어보세요!
              </div>
              <div className="text-gray-400 text-sm flex gap-x-1">
                <button
                  onClick={() => {
                    setState("star");
                    setStateDB(scoreData);
                  }}
                  className={
                    (state === "star"
                      ? "bg-yellow-300 text-white"
                      : "bg-gray-100") + " px-2 rounded-lg "
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
                    (state === "save"
                      ? "bg-yellow-300 text-white"
                      : "bg-gray-100") + " px-2 rounded-lg "
                  }
                >
                  저장 많은 순
                </button>
              </div>
            </div>

            <BookListSlider slide={4} apidata={stateDB} score={true} />
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
            <div className="space-y-1 text-md my-auto">
              {readUserData &&
                readUserData.map((user: any, index: number) => (
                  <div
                    onClick={(e: any) => {
                      toggleDropMenu(e);
                      setOpenUserID(user.userId);
                    }}
                    key={user.userId + index}
                    className={
                      (openUser && openUserID === user.userId
                        ? "bg-gray-100 "
                        : "") +
                      "hover:bg-gray-50 p-2 rounded-lg flex justify-between items-center cursor-pointer relative"
                    }
                  >
                    {openUser && openUserID === user.userId && (
                      <div className="absolute z-10 right-0 -bottom-12 text-sm text-gray-500 hover:text-gray-600 hover:border-gray-300 backdrop-blur-md bg-white/25 p-5 rounded-lg border">
                        <Link
                          href={{
                            pathname: `/bookproject/${user.screenName}`,
                            query: { uid: user.userId, name: user.displayName },
                          }}
                        >
                          서재 보러 가기
                        </Link>
                      </div>
                    )}
                    <div className="flex gap-x-2 items-center">
                      <div className="mr-2">{index + 1}</div>
                      {user.photoURL && (
                        <Image
                          src={user.photoURL}
                          alt="프로필 이미지"
                          width={500}
                          height={500}
                          className="w-8 h-8 rounded-full border bg-gray-100"
                        />
                      )}
                      <p className="max-w-1/6 line-clamp-1">
                        {user.displayName[0] + " * * 님"}
                      </p>
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

        <div className="mt-10 mb-10 bg-white w-full h-fit px-6 pt-6 pb-10 lg:py-10 lg:px-10 rounded-xl border">
          <div className="lg:flex gap-x-5 items-end mb-4 lg:mb-8">
            <div className="text-xl font-semibold ">👨‍👩‍👧‍👦 인기 있는 코멘트</div>
            <p className="text-gray-500 text-sm">
              좋아요가 많은 코멘트를 소개합니다!
            </p>
          </div>
          <CommentSlider data={data} />
        </div>

        <div className="mt-10 bg-white w-full h-fit py-10 px-10 rounded-xl border">
          <div className="lg:flex gap-x-5 items-end mb-8">
            <div className="text-xl font-semibold ">
              🍞 따끈따끈 갓 나온 신간
            </div>
            <p className="text-gray-500 text-sm">지금 막 나온 신간이에요</p>
          </div>

          <ApiBookListSlider apidata={ItemNewAll} slide={6} />
        </div>
      </ServiceLayout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const Bestseller = await getBookList("Bestseller");
  const ItemNewAll = await getBookList("ItemNewAll");

  const Comment = await getMostComment();
  const comment = JSON.stringify(Comment);

  /** fieldcount총합으로 순서 출력*/
  const rankList = await getMostPopularBook();
  /** 전체 유저가 저장한 별점 평균 높은순으로 출력 */
  const scoreList = await getHighScoreBook();
  /** 가장 많이 독서활동을 한 사람 목록 */
  const readUser = await getManyReadUser();

  //______________________________________________________________________________
  let rankbooklist: any = [];
  let scorebooklist: any = [];

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
  }

  return {
    props: {
      Bestseller: Bestseller.data.item,
      ItemNewAll: ItemNewAll.data.item,
      comment,

      rankbook: JSON.stringify(rankbooklist),
      scorebook: JSON.stringify(scorebooklist),
      readuser: JSON.stringify(readUser),
    },
  };
};
export default Home;
