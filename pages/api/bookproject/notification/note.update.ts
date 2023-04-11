import MemberModel from "@/models/member/member.model";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//
export default async function getNotification(req: any, res: any) {
  const uid: string = req.query.userId;
  const userArr = await prisma.notification.findMany({
    where: {
      userId: uid,
    },
    // data: { isChecked: 1 },
  });
  console.log(userArr);
  console.log(">> note.get >> 사용자 notification 조회 완료");

  /**
   *
   *
   * 조회하면 상태 1로 변경
   *
   *
   */

  res.status(200).json({ message: "알림 확인했어요." });
}
