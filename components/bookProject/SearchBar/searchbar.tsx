import { useState } from "react";

const SearchBar = () => {
  const [searchquery, setQuery] = useState<string>();

  return (
    <form
      action={`/bookproject/search/${searchquery}`}
      method="post"
      className="w-full rounded-full px-4 border-2 border-yellow-400 bg-white flex items-center justify-between"
    >
      {/* <div className="w-2/5 rounded-full px-4 border-2 border-yellow-400 flex items-center justify-between"> */}
      <input
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        className="px-3 py-2 w-full outline-none font-light"
        placeholder="검색어를 입력해 주세요"
      />
      <button type="submit" className="text-yellow-400 p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-7 h-7"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
