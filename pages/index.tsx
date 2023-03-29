import ServiceLayout from "@/components/service_layout";
import type { GetStaticProps } from "next";
import { GoogleAuthProvider } from "firebase/auth";
import { getBookList } from "./api/book.list";
import BookListSlider from "@/components/List/bookListSlider";
import Head from "next/head";

const provider = new GoogleAuthProvider();

interface Props {
  ItemNewSpecial: {}; //주목할만한 신간
  Bestseller: {}; //베스트셀러
  ItemNewAll: {}; //신간 전체
  // ItemEditorChoice: {}; //편집자 추천 > 카테고리로만 조회 가능이 무슨 뜻?
}

function Home({ Bestseller, ItemNewSpecial, ItemNewAll }: Props) {
  return (
    <>
      <ServiceLayout>
        <div className="mt-10 mb-10 bg-white w-full h-fit py-10 px-10 rounded-xl border">
          <div className="flex gap-x-5 items-end mb-8">
            <div className="text-xl font-semibold ">베스트셀러</div>
            <p className="text-gray-500 text-sm">실시간 베스트셀러</p>
          </div>
          <BookListSlider data={Bestseller} />
        </div>
        <div className="mt-10 mb-10 bg-white w-full h-fit py-10 px-10 rounded-xl border">
          <div className="flex gap-x-5 items-end mb-8">
            <div className="text-xl font-semibold ">주목할만한 신간</div>
            <p className="text-gray-500 text-sm">모두가 관심갖고 있어요</p>
          </div>
          <BookListSlider data={ItemNewSpecial} />
        </div>
        <div className="mt-10 bg-white w-full h-fit py-10 px-10 rounded-xl border">
          <div className="flex gap-x-5 items-end mb-8">
            <div className="text-xl font-semibold ">따끈따끈 갓 나온 신간</div>
            <p className="text-gray-500 text-sm">지금 막 나온 신간이에요</p>
          </div>
          <BookListSlider data={ItemNewAll} />
        </div>
      </ServiceLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const ItemNewSpecial = await getBookList("ItemNewSpecial");
  const Bestseller = await getBookList("Bestseller");
  const ItemNewAll = await getBookList("ItemNewAll");
  return {
    props: { ItemNewSpecial, Bestseller, ItemNewAll },
  };
};
export default Home;
