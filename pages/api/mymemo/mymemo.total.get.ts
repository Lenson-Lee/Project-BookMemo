import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/** reactQuery로 불러오기 위해 fetch에 쿼리를 붙여서 GET */
/** mymemo.get.ts의 total과 동일한 코드 */

export default async function handler(req: any, res: any) {
  const uid = req.query.userId;
  /** user의 모든 키워드 데이터 조회 */
  const keywords = await prisma.memoList.groupBy({
    by: ["keywords"],
    where: {
      userId: uid,
      keywords: { notIn: "[]" },
    },
    orderBy: [
      {
        keywords: "desc",
      },
    ],
  });

  /** user의 모든 메모 데이터 조회 */
  const memolist = await prisma.memoList.findMany({
    where: {
      userId: uid,
    },
    select: {
      content: true,
      isbn: true,
      isbn13: true,
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
  });
  //타이틀 찾기

  let titleArr: any = [];
  async function getTitle(isbn: string, isbn13: string | null) {
    const title = await prisma.bookMemo.findFirst({
      where: {
        isbn: isbn,
        isbn13: isbn13,
      },
      select: { title: true },
    });
    await titleArr.push({ isbn, isbn13, title });
  }
  /** memolist 돌려서 순서에 맞춰 제목 가져오기 */
  memolist.forEach((element: any) => {
    getTitle(element.isbn, element.isbn13);
  });

  /** 나의서재 장르 카운트 (저장한 책 수(5) , 장르별 책{만화:5, 소설:4})*/
  /** 전체기간 총 도서량 */
  const sum = await prisma.bookMemo.count({
    where: {
      userId: uid,
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
  });
  /** 장르 카운트 ex: {만화 :5권}, {소설:3권} */
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
      state: {
        notIn: "wish",
      },
    },
    take: 5,
  });

  /** 월별 독서 카운트를 위한 목록 조회 */
  const getDate = (time: string) => {
    const now = new Date(new Date().setDate(1));
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    const doubleMonth = new Date(now.setMonth(now.getMonth() - 2));

    if (time === "this") {
      return now;
    } else if (time === "last") {
      return lastMonth;
    } else if (time === "doubleLast") {
      return doubleMonth;
    }
  };

  /** 월별 기록활동 카운트 createAt으로 산정 */
  const thisMonthCnt = await prisma.memoList.findMany({
    where: {
      userId: uid ? uid : "undefine",
      createdAt: {
        gte: getDate("this"),
      },
    },
  });
  const lastMonthCnt = await prisma.memoList.findMany({
    where: {
      userId: uid ? uid : "undefine",
      createdAt: {
        gte: getDate("last"),
        lte: getDate("last"),
      },
    },
  });
  const doubleLastMonthCnt = await prisma.memoList.findMany({
    where: {
      userId: uid ? uid : "undefine",
      createdAt: {
        gte: getDate("doubleLast"),
        lte: getDate("doubleLast"),
      },
    },
  });

  // console.log("🐭 총 독서 수 sum : ", sum);
  // console.log("🐹 총 카테고리 종류와 카운트 : ", ctgcount );

  const data = {
    keywords: keywords,
    memolist: { memolist: memolist, titleArr: titleArr },
    count: { sum: sum, ctgcount: ctgcount },
    month: {
      thisMonth: thisMonthCnt,
      lastMonth: lastMonthCnt,
      twolastMonth: doubleLastMonthCnt,
    },
  };

  res.status(200).json({ message: `👻 total get 성공 ${uid}`, data: data });
}
