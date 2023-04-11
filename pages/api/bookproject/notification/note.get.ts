import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//
export default async function getComment(req: any, res: any) {
  const note = await prisma.notification.findMany({
    where: {
      userId: req.userId,
    },
    orderBy: [{ id: "desc" }],
  });

  console.log(">> note.get >> 사용자 notification 조회 완료");

  /**
   *
   *
   * 조회하면 상태 1로 변경
   *
   *
   */

  res.status(200).json({ note });
}
