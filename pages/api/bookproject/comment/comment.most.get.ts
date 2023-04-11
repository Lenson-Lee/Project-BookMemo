import MemberModel from "@/models/member/member.model";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getMostComment() {
  //좋아요순 코멘트 조회
  const document = await prisma.comment.findMany({
    orderBy: [{ like: "desc" }],
    take: 12,
  });

  //닉네임, 프로필사진 찾기(파이어베이스)
  const findResult = (uid: string) => MemberModel.findByDisplayName(uid);

  const newUserArr = await Promise.all(
    document.map(async (user) => {
      const userInfo = await findResult(user.userId!);

      const data = { ...user };
      data["photoURL"] = userInfo.photoURL;

      return data;
    })
  );
  console.log(">comment.most.get 끝 --END");
  const data = { newUserArr };
  return { data };
}
