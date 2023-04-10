import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const { id, state, start, end, score } = JSON.parse(req.body);

  const updated = await prisma.bookMemo.update({
    where: {
      id: id,
    },
    data: {
      state: state,
      start: start,
      end: end,
      score: score,
    },
  });
  console.log("👀 update finish : ", updated);
  res.status(200).json({ message: "수정 끝났어용" });
}
