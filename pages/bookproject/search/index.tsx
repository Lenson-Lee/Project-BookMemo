import SearchBar from "@/components/bookProject/SearchBar/searchbar";
import ServiceLayout from "@/components/bookProject/service_layout";

const Search = () => {
  // const router = useRouter();
  // const data = router.query.query;
  return (
    <>
      <ServiceLayout>
        <div className="w-full h-9/10 py-20">
          <p className="mb-6 text-center text-lg font-semibold">
            책 제목, 저자 등 검색해 보세요 🤔
          </p>
          <SearchBar />
        </div>
      </ServiceLayout>
    </>
  );
};
export default Search;
