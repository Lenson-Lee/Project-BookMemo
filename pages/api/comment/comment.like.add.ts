import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const { id, like } = JSON.parse(req.body);

  const document = await prisma.comment.update({
    where: { id: id },
    data: { like: like },
  });

  console.log("좋아요가 반영되었습니다.");
  res.status(200).json({ message: "좋아요 눌렀어용" });
}
