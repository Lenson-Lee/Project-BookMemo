import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  console.log(req.body);
  const body = JSON.parse(req.body);
  const { id, isbn, userId } = JSON.parse(req.body);

  const deleted = await prisma.bookMemo.delete({
    where: {
      id: id,
    },
  });

  // // 책과 관련된 메모도 삭제해야한다.
  const memodel = await prisma.memoList.deleteMany({
    where: {
      userId: userId,
      isbn: isbn,
    },
  });

  console.log(deleted, memodel);
  res.status(200).json({ message: "삭제 끝났어용" });
}
