import MemberModel from "@/models/member/member.model";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getMostComment() {
  //좋아요순 코멘트 조회
  const document = await prisma.comment.findMany({
    orderBy: [{ like: "desc" }],
    take: 12,
  });

  //파이어베이스 데이터와 함께 넣을 곳
  // let userData: any = [];

  // document.forEach(async (user) => {
  //   //닉네임, 프로필사진 찾기(파이어베이스)
  //   const findResult = await MemberModel.findByDisplayName(user.userId!);

  //   //변수에 주입
  //   userData.push({
  //     displayName: findResult.name,
  //     photoURL: findResult.photoURL,
  //     data: user,
  //   });
  // });

  console.log(">comment.most.get 끝 --END");
  const data = { document };
  return { data };
}
