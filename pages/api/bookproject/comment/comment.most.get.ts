import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getMostComment() {
  //인기순 코멘트 조회
  const document = await prisma.comment.findMany({
    orderBy: [{ like: "desc" }],
    take: 12,
  });
  //해당 책 코멘트별 책 제목 조회
  const data = { document };
  console.log(">comment.most.get 끝 --END");
  return { data };
}
