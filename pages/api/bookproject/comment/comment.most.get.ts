import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Props {
  data: any;
}

export default function List({ data }: Props) {
  return { data };
}

export async function getComment() {
  //인기순 코멘트 조회
  const document = await prisma.comment.findMany({
    orderBy: [{ like: "desc" }],
  });

  //해당 책 코멘트별 책 제목 조회

  const data = { document };
  console.log(">comment.most.get 끝 --END");
  return { data };
}
