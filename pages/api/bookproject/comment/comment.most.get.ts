import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Props {
  data: any;
}

export default function List({ data }: Props) {
  return { data };
}

export async function getComment() {
  const document = await prisma.comment.findMany({
    orderBy: [{ like: "desc" }],
  });

  const data = { document };
  console.log(">comment.most.get 끝 --END");
  return { data };
}
