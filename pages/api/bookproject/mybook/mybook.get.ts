import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const { userId, state, page, size } = JSON.parse(req.body);

  //
  if (state === "wish") {
    const count = await prisma.bookMemo.count({
      where: {
        userId: userId,
        state: "wish",
      },
    });
    console.log("🐰wish 총 갯수 : ", count);

    const result = await prisma.bookMemo.findMany({
      where: {
        userId: userId,
        state: "wish",
      },
      orderBy: [
        {
          id: "desc",
        },
      ],
    });

    let totalpages =
      (count - (count % size)) / size + (count % size > 0 ? 1 : 0);

    res.status(200).json({ result, count, totalpages });
    return;
  }
  //

  const count = await prisma.bookMemo.count({
    where: {
      userId: userId,
      state: state,
    },
  });

  //페이징 되어야하는 버튼 수
  let totalpages = (count - (count % size)) / size + (count % size > 0 ? 1 : 0);

  console.log("mybook.get 끝");
  const result = await prisma.bookMemo.findMany({
    skip: page === 1 ? 0 : (page - 1) * size,
    take: size,
    where: {
      userId: userId,
      state: state,
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
  });
  res.status(200).json({ result, totalpages, count });
}
