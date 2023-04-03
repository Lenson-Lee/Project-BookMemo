import ServiceLayout from "@/components/bookProject/service_layout";
import type { GetStaticProps } from "next";
import { GoogleAuthProvider } from "firebase/auth";
import { getBookList } from "@/pages/api/bookproject/book.list";
import BookListSlider from "@/components/bookProject/List/bookListSlider";
import Head from "next/head";
import Link from "next/link";

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
        <Link href="/bookproject">이동하기</Link>
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
