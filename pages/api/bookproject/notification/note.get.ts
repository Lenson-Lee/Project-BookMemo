import MemberModel from "@/models/member/member.model";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//
export default async function getNotification(req: any, res: any) {
  const userArr = await prisma.notification.findMany({
    where: {
      userId: req.query.userId,
    },
    orderBy: [{ id: "desc" }],
  });

  //닉네임, 프로필사진 찾기(파이어베이스)
  const findResult = (uid: string) => MemberModel.findByDisplayName(uid);

  const note = await Promise.all(
    userArr.map(async (user) => {
      /** 파이어베이스 접속 - 닉네임/ 프로필이미지 찾기 */
      const userInfo = await findResult(user.writerId!);

      /** 해당 게시글 정보 가져오기 */
      // const contentQuery = async (): Promise<any> => {
      //   let contentInfo: any;
      //   if (user.type === "like") {
      //     console.log("🛫 comment에 찾으러 떠나요");
      //     contentInfo = await prisma.comment.findUnique({
      //       where: {
      //         id: user.contentId,
      //       },
      //     });
      //   }
      //   return contentInfo;
      // };
      // console.log("🛫 : ", contentQuery);

      const data = { ...user };
      data["photoURL"] = userInfo.photoURL;
      data["name"] = userInfo.name;
      // data["contentInfo"] = contentInfo;
      return data;
    })
  );

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
