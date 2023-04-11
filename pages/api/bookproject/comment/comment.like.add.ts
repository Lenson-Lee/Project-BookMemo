import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const { id, like, userId, writerId, contentId, replyId, type, isChecked } =
    JSON.parse(req.body);

  const document = await prisma.comment.update({
    where: { id: id },
    data: { like: like },
  });
  console.log("좋아요가 반영되었습니다.");

  //좋아요 알림 추가 (Notification table)
  const nottification = await prisma.notification.create({
    data: {
      userId,
      writerId,
      contentId,
      replyId,
      type,
      isChecked,
    },
  });
  console.log("좋아요 클릭 안내 DB 추가되었습니다.");

  res.status(200).json({ message: "좋아요 눌렀어용" });
}
