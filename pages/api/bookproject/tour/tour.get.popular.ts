import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Props {
  data: any;
}

export default function List({ data }: Props) {
  return { data };
}

/** 유저들이 가장 많이 읽은 (state:wish 가 아닌 책) 책 */
export async function getMostPopularBook() {
  const book = await prisma.bookMemo.groupBy({
    by: ["title", "auth", "isbn", "isbn13"],
    _sum: {
      fieldcount: true,
    },
    orderBy: {
      _count: {
        fieldcount: "desc",
      },
    },
    where: {
      state: {
        notIn: "wish",
      },
    },
    take: 12,
  });

  const data = { popular: book };
  return {
    data,
  };
}

/** 평균 별점이 가장 높은 순서 (state:wish 가 아닌 책) 책 */
export async function getHighScoreBook() {
  const book = await prisma.bookMemo.groupBy({
    by: ["title", "auth", "isbn", "isbn13"],

    _avg: {
      score: true,
    },
    orderBy: {
      _avg: {
        score: "desc",
      },
    },
    where: {
      state: {
        notIn: "wish",
      },
    },
    take: 12,
  });

  const data = { highscore: book };
  return {
    data,
  };
}

/** 찜한 책 포함 내가 제일 좋아하는 장르의 책 순위 */
export async function getMostCategoryBook(uid: any) {
  /** 가장 많이 좋아하는 장르 1개 Pick */
  const ctgcount = await prisma.bookMemo.groupBy({
    by: ["field"],
    _sum: {
      fieldcount: true,
    },
    orderBy: {
      _count: {
        fieldcount: "desc",
      },
    },
    where: {
      userId: uid ? uid : "undefine",
      field: {
        notIn: [""],
      },
    },
    take: 1,
  });

  //field : ['만화','인터넷만화'] => '만화' 추출
  const bestcategory = ctgcount[0]?.field?.split(",")[0].split('"')[1];

  // '만화'가 대분류인 책 평균점수별 출력
  const score = await prisma.bookMemo.groupBy({
    by: ["title", "auth", "isbn", "isbn13"],

    _avg: {
      score: true,
    },

    orderBy: {
      _avg: {
        score: "desc",
      },
    },
    where: {
      field: {
        contains: bestcategory,
      },
    },
    take: 12,
  });

  const data = { category: ctgcount, highscore: score, field: bestcategory };
  return {
    data,
  };
}
