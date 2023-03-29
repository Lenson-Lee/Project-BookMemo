import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const {
    uid,
    state,
    title,
    author,
    isbn,
    isbn13,
    score,
    start,
    end,
    field,
    fieldcount,
    cover,
  } = JSON.parse(req.body);

  //중복테스트. 배열에 내용이 있으면 중복
  const overTest = await prisma.bookMemo.findMany({
    where: { isbn: isbn, state: state, userId: uid },
  });

  /** 동일한 책이 상태만 다르게 존재할 경우 상태 변경 ㅜㅜ 근데 where 절에서 state에 조건을 두 개 다는 법을 몰라서 코드를 두 개 작성함 ㅜㅜ*/
  const stateReading = await prisma.bookMemo.findMany({
    where: { isbn: isbn, state: "reading", userId: uid },
  });
  const stateFinish = await prisma.bookMemo.findMany({
    where: { isbn: isbn, state: "finish", userId: uid },
  });

  // 중복되는 책 존재 (같은 isbn, 같은 상태)
  if (overTest.length > 0) {
    console.error("🚨이미 서재에 저장된 책입니다.");
  } else if (stateReading[0]) {
    const document = await prisma.bookMemo.update({
      where: {
        id: stateReading[0].id,
      },
      data: {
        state: state,
      },
    });
    console.error("💙도서 상태를 변경하였습니다.");
  }
  // 중복되는 책 상태변경 (같은 isbn, 다른 상태)
  else if (stateFinish[0]) {
    const document = await prisma.bookMemo.update({
      where: {
        id: stateFinish[0].id,
      },
      data: {
        state: state,
      },
    });
    console.error("💙도서 상태를 변경하였습니다.");
  }
  // 신규 책 등록
  else {
    const document = await prisma.bookMemo.create({
      data: {
        userId: uid,
        state: state,
        title: title,
        auth: author,
        isbn: isbn,
        isbn13: isbn13,
        score: score,
        start: start,
        end: end,
        field: field,
        fieldcount: fieldcount,
        cover: cover,
      },
    });
    console.log("🤍서재에 저장되었습니다.");
  }

  res.status(200).json({ message: "포스트 끝났어용" });
}
