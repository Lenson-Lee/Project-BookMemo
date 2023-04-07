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

  //파이어베이스 데이터와 함께 넣을 곳
  let userData: any = [];

  read.forEach(async (user, index: number) => {
    //닉네임, 프로필사진 찾기(파이어베이스)
    const findResult = await MemberModel.findByDisplayName(user.userId!);
    //변수에 주입
    userData.push({
      displayName: findResult.name,
      photoURL: findResult.photoURL,
      count: user._count.userId,
      userId: user.userId,
    });
    return userData;
  });

  /** 배열 순서 확실하게 sort */
  function compareCount(a: number, b: number) {
    return b - a;
  }
  if (userData.length > 1) {
    userData.sort(compareCount);
  }

  const data = { read: userData };
  return {
    data,
  };
}
