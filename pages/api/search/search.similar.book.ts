interface Props {
  data: {};
}

export default function List({ data }: Props) {
  return data;
}

// 알라딘 편집자 추천 유사한 책
export async function getSimilarList(category: string) {
  const TTB = process.env.ALADIN_TTBKEY;
  const request = await fetch(`
  http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${TTB}&QueryType=${"ItemEditorChoice"}&CategoryId=${category}&MaxResults=10&start=1&SearchTarget=${"Book"}&&output=js&Version=20131101&Cover=Big
  `);

  const response = await request.json();
  const similar = response;

  return {
    similar,
  };
}
