import { PrismaClient } from "@prisma/client";
//멤버 스크린네임 찾기 위해 파이어베이스 불러옴
import MemberCtrl from "@/controllers/member.ctrl";
import MemberModel from "@/models/member/member.model";
const prisma = new PrismaClient();

interface Props {
  data: any;
}

export default function List({ data }: Props) {
  return { data };
}

/** 유저들이 가장 많이 읽은 (state:wish 가 아닌 책) 책 */
export async function getManyReadUser() {
  const read = await prisma.bookMemo.groupBy({
    by: ["userId"],
    _count: {
      userId: true,
    },
    orderBy: {
      _count: {
        userId: "desc",
      },
    },
    where: {
      state: {
        notIn: "wish",
      },
    },
    take: 6,
  });

  //닉네임, 프로필사진 찾기(파이어베이스)
  const findResult = (uid: string) => MemberModel.findByDisplayName(uid);

  const newUserArr = await Promise.all(
    read.map(async (user) => {
      const userInfo = await findResult(user.userId!);

      const data = {
        displayName: userInfo.name,
        photoURL: userInfo.photoURL,
        screenName: userInfo.screenName,
        count: user._count.userId,
        userId: user.userId,
      };

      return data;
    })
  );

  // console.log("🍮 = userData : ", userData); //여기가 비어있다
  const data = { read: newUserArr };
  return {
    data,
  };
}
