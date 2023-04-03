import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Props {
  data: any;
}

export default function List({ data }: Props) {
  return { data };
}
//
export async function getComment(req: any) {
  const document = await prisma.comment.findMany({
    where: {
      isbn: req,
    },
    orderBy: [{ id: "desc" }],
  });

  const data = { document };
  console.log(">comment.get 끝 --END");
  return { data };
}
