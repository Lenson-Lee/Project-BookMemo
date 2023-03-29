import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/** reactQuery로 불러오기 위해 fetch에 쿼리를 붙여서 GET */
/** mymemo.get.ts의 getMymemoList와 동일한 코드 */
export default async function handler(req: any, res: any) {
  const list = await prisma.memoList.findMany({
    where: {
      userId: req.query.userId,
      isbn: req.query.isbn,
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
  });

  console.log(">mymemo.query.get useQuery로 책의 메모리스트 불러오기 끝 --END");
  res.status(200).json({ message: "testget 성공", data: list });
}
