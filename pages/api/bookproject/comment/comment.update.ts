import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const { id, content } = JSON.parse(req.body);

  const document = await prisma.comment.update({
    where: { id: id },
    data: { content },
  });

  console.info("🤍코멘트 수정되었습니다.");
  res.status(200).json({ message: "포스트 끝났어용" });
}
