import { GetStaticProps, NextPage } from "next";
import ServiceLayout from "@/components/service_layout";
import { useRouter } from "next/router";
import { searchResult } from "../api/search/search.result";
import { getBookList } from "../api/book.list";
interface Props {
  result: {};
  propsquery: string;
}

const Search: NextPage<Props> = ({}: Props) => {
  // const router = useRouter();
  // const data = router.query.query;

  return (
    <>
      <ServiceLayout>
        <div>검색결과 :</div>
      </ServiceLayout>
    </>
  );
};
export default Search;
