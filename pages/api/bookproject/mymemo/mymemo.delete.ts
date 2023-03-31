import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const { id } = JSON.parse(req.body);

  console.log("🚨 삭제했어요 id :", id);
  const document = await prisma.memoList.delete({
    where: { id: id },
  });

  res.status(200).json({ message: "삭제 끝났어용" });
}
