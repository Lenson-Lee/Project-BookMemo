import Link from "next/link";

interface Props {
  memodata: [];
  router: any;
  memotitle: any;
}
const list = ({ memodata, router, memotitle }: Props) => {
  return (
    <>
      <div className="">
        <p className="text-xl font-semibold">최근 기록한 메모</p>
        <div className="text-sm text-gray-600 flex gap-x-1">
          <p>메모를 클릭 시 해당 책으로 이동합니다.</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        {router?.uid &&
          memodata.map((memo: any, index: number) => {
            //ㅜㅜ 추후에 쿼리를 바꿔야겠다...
            //타이틀을 index로 찾으면 제목이 섞여서.... 반복문노가다로 찾는다

            let title: string = "";
            memotitle.forEach((item: any) => {
              if (memo.isbn === item.isbn) {
                title = item.title.title;
              }
            });

            return (
              <Link
                href={{
                  pathname: `/${router?.screenName}"/mybook/${title}`,
                  query: {
                    isbn: memo.isbn,
                    isbn13: memo.isbn13 ? memo.isbn13 : "null",
                    uid: router?.uid,
                  },
                }}
                key={memo.isbn13 + index}
                className="text-sm bg-gray-100 rounded-lg w-full p-5 line-clamp-3 overflow-hidden"
              >
                <p className="text-xs line-clamp-1  text-gray-400 mb-1">
                  {title}
                </p>
                <p>{memo.content}</p>
              </Link>
            );
          })}
        {router?.uid && memodata?.length === 0 && (
          <div className="text-sm bg-gray-100 text-gray-500 rounded-lg w-full p-5 line-clamp-3 overflow-hidden">
            <p> 우선 책을 눌러 기록을 해주세요</p>
          </div>
        )}
      </div>
    </>
  );
};

export default list;
