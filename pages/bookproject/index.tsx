import ServiceLayout from "@/components/bookProject/service_layout";
import type { GetServerSideProps, GetStaticProps } from "next";
import { GoogleAuthProvider } from "firebase/auth";
import { getBookList } from "@/pages/api/bookproject/book.list";
import BookListSlider from "@/components/bookProject/List/bookListSlider";
import CommentSlider from "@/components/bookProject/List/comment/commentListSlider";
import { useEffect } from "react";
import { getMostComment } from "../api/bookproject/comment/comment.most.get";
const provider = new GoogleAuthProvider();

interface Props {
  ItemNewSpecial: {}; //주목할만한 신간
  Bestseller: {}; //베스트셀러
  ItemNewAll: {}; //신간 전체
  comment: any;
}

function Home({ Bestseller, ItemNewSpecial, ItemNewAll, comment }: Props) {
  const data = JSON.parse(comment).data.document;

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
            <div className="text-xl font-semibold ">인기 있는 코멘트</div>
            <p className="text-gray-500 text-sm">
              이런 감상평이 있는 책은 어때요?
            </p>
          </div>
          <CommentSlider data={data} />
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

export const getServerSideProps: GetServerSideProps = async () => {
  const ItemNewSpecial = await getBookList("ItemNewSpecial");
  const Bestseller = await getBookList("Bestseller");
  const ItemNewAll = await getBookList("ItemNewAll");
  const Comment = await getMostComment();
  const comment = JSON.stringify(Comment);

  return {
    props: { ItemNewSpecial, Bestseller, ItemNewAll, comment },
  };
};
export default Home;
