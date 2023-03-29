import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/** reactQuery로 불러오기 위해 fetch에 쿼리를 붙여서 GET */
/** mymemo.get.ts의 getMymemoList와 동일한 코드 */
// export default async function handler(req: any, res: any) {
//   const list = await prisma.memoList.findMany({
//     where: { isbn: req.query.isbn },
//     orderBy: [
//       {
//         id: "desc",
//       },
//     ],
//   });

//   console.log("DB의 메모리스트 : ", list);
//   res.status(200).json({ message: "testget 성공", data: list });
// }

//____________________________________________________________

interface Props {
  data: any;
  // mydata: any;
}

export default function List({ data }: Props) {
  return { data };
}

/** uid와 isbn에 따른 책 상세페이지 메모 리스트 출력 */
export async function getMemberMemoList(isbn13: any) {
  const list = await prisma.memoList.findMany({
    where: {
      isbn13: isbn13,
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
  });
  console.log(">책 검색할때 유저들의 해당 메모 조회 --END");

  const data = { list };
  console.log(list);
  return {
    data,
  };
}
