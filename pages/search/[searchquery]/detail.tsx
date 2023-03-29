import { GetServerSideProps } from "next";
import ServiceLayout from "@/components/service_layout";
import { useRouter } from "next/router";
import BookInfo from "@/components/Info/BookInfo";
import { QueryClient } from "react-query";
import { getMemberMemoList } from "@/pages/api/membermemo/member.memo.get";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getSimilarList } from "@/pages/api/search/search.similar.book";
import Link from "next/link";
import Image from "next/image";

//[검색어] 를 받기 위해 getServerSideProps 사용
// url에 넘어온 쿼리를 받는 방식은 getStaticProps에서 hook(useRouter)을 사용할 수 없어 실패

export type BookType = {
  data: object;
};

interface Props {
  similar: any;
}

function SearchQuery({ similar }: Props) {
  const settings = {
    dots: false,
    infinite: false,
    // draggable: false,
    arrows: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  const router = useRouter();
  const query = router.query; // 클릭한 책의 정보
  const data = query && query.data ? JSON.parse(query.data as string) : null;

  return (
    <ServiceLayout>
      <div className="bg-white w-full py-10 mt-20 rounded-xl">
        <div className="mx-20">
          <BookInfo state="search" apidata={data} mydata></BookInfo>
        </div>
      </div>
      <div className="bg-white w-full py-10 px-20 mt-10 rounded-xl">
        <p className="text-xl font-semibold mb-4">독자들의 코멘트</p>
        <Slider {...settings}>
          <div>
            <div className="mx-2 p-5 rounded-lg bg-gray-100">
              {/* profile */}
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div className="flex gap-x-2 items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 border" />
                  <p className="text-lg font-medium">이순신</p>
                </div>
                <div className="px-2 py-1 bg-white border rounded-full text-sm text-yellow-400 flex">
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
                  <p> 3.4점</p>
                </div>
              </div>
              {/* content */}
              <div className="line-clamp-5">
                여기서 끝이 아니다~~
                밤대추풋고추생강계피당귀향로타임로즈마리백미흑미오곡잡곡설탕구운소금히말라야소금말돈소금후추대파쪽파양파실파잣은행초콜릿된장콩장쌈장두반장응가애호박늙은호박단호박딸
                기양배추파파야두리안등의열대과일등을몽땅찜기에때려놓고50시간푹끓인후여기서끝이아니다돼지고기소고기말고기양고기닭고기꿩고기쥐고기하마고기악어고기코끼리고기사람고기개고기물고기불고기바람고기환단고기참
                치꽁치넙치뭉치면살고흝어지면참다랑어를갈아넣고여기서끝이아니다비린내를제거하기위해월계수청주잭다니엘피노누아와인머루주매화수막걸리커피콩을넣고여기서끝이아니다잡내제거를위해랍스타곰발바닥제비집아델리
                펭귄의꼳휴돼지불알베니스상인의겨드랑이살한근토끼발닭모이주머니최고급와규스테이크마이아르겉껍질테운부분으로잡내를제거하고여기서끝이아니다에비양삼다수아이시스아리수보리수빼어날수라싸수아름다울미백미현
                미흑미별미를넣고여기서끝이아니다
              </div>
            </div>
          </div>
          <div>
            <div className="mx-2 p-5 rounded-lg bg-gray-100">
              {/* profile */}
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div className="flex gap-x-2 items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 border" />
                  <p className="text-lg font-medium">이순신</p>
                </div>
                <div className="px-2 py-1 bg-white border rounded-full text-sm text-yellow-400 flex">
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
                  <p> 3.4점</p>
                </div>
              </div>
              {/* content */}
              <div className="line-clamp-5">
                여기서 끝이 아니다~~
                밤대추풋고추생강계피당귀향로타임로즈마리백미흑미오곡잡곡설탕구운소금히말라야소금말돈소금후추대파쪽파양파실파잣은행초콜릿된장콩장쌈장두반장응가애호박늙은호박단호박딸
                기양배추파파야두리안등의열대과일등을몽땅찜기에때려놓고50시간푹끓인후여기서끝이아니다돼지고기소고기말고기양고기닭고기꿩고기쥐고기하마고기악어고기코끼리고기사람고기개고기물고기불고기바람고기환단고기참
                치꽁치넙치뭉치면살고흝어지면참다랑어를갈아넣고여기서끝이아니다비린내를제거하기위해월계수청주잭다니엘피노누아와인머루주매화수막걸리커피콩을넣고여기서끝이아니다잡내제거를위해랍스타곰발바닥제비집아델리
                펭귄의꼳휴돼지불알베니스상인의겨드랑이살한근토끼발닭모이주머니최고급와규스테이크마이아르겉껍질테운부분으로잡내를제거하고여기서끝이아니다에비양삼다수아이시스아리수보리수빼어날수라싸수아름다울미백미현
                미흑미별미를넣고여기서끝이아니다
              </div>
            </div>
          </div>
          <div>
            <div className="mx-2 p-5 rounded-lg bg-gray-100">
              {/* profile */}
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div className="flex gap-x-2 items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 border" />
                  <p className="text-lg font-medium">이순신</p>
                </div>
                <div className="px-2 py-1 bg-white border rounded-full text-sm text-yellow-400 flex">
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
                  <p> 3.4점</p>
                </div>
              </div>
              {/* content */}
              <div className="line-clamp-5">
                여기서 끝이 아니다~~
                밤대추풋고추생강계피당귀향로타임로즈마리백미흑미오곡잡곡설탕구운소금히말라야소금말돈소금후추대파쪽파양파실파잣은행초콜릿된장콩장쌈장두반장응가애호박늙은호박단호박딸
                기양배추파파야두리안등의열대과일등을몽땅찜기에때려놓고50시간푹끓인후여기서끝이아니다돼지고기소고기말고기양고기닭고기꿩고기쥐고기하마고기악어고기코끼리고기사람고기개고기물고기불고기바람고기환단고기참
                치꽁치넙치뭉치면살고흝어지면참다랑어를갈아넣고여기서끝이아니다비린내를제거하기위해월계수청주잭다니엘피노누아와인머루주매화수막걸리커피콩을넣고여기서끝이아니다잡내제거를위해랍스타곰발바닥제비집아델리
                펭귄의꼳휴돼지불알베니스상인의겨드랑이살한근토끼발닭모이주머니최고급와규스테이크마이아르겉껍질테운부분으로잡내를제거하고여기서끝이아니다에비양삼다수아이시스아리수보리수빼어날수라싸수아름다울미백미현
                미흑미별미를넣고여기서끝이아니다
              </div>
            </div>
          </div>
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
  context
) => {
  const data = context.query.data;

  /** 🍉 react-query */
  const queryClient = new QueryClient();

  const similar = await getSimilarList(JSON.parse(data as string).categoryId);

  //해당 책 모든 유저의 기록
  // await queryClient.prefetchQuery(["info"], () =>
  //   getMemberMemoList(JSON.parse(data as string).isbn13)
  // );

  return {
    props: { similar: similar },
  };
};
