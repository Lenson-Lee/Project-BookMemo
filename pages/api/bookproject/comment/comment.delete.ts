import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const body = JSON.parse(req.body);
  console.log(body);

  const deleted = await prisma.comment.delete({
    where: {
      id: body.id,
    },
  });

  console.log(deleted);
  res.status(200).json({ message: "삭제 끝났어용" });
}
