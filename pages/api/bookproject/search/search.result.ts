interface Props {
  data: any;
}

export default function List({ data }: Props) {
  return data;
}

// 검색결과전체
export async function searchResult(target: any) {
  // console.log("target ===========================");
  // console.log(target);
  const TTB = process.env.ALADIN_TTBKEY;

  const request = await fetch(
    `
    http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${TTB}&Query=${encodeURI(
      target
    )}&QueryType=${"Keyword"}&MaxResults=${"20"}&start=${"1"}&SearchTarget=Book&output=js&Version=20131101&Cover=Big
  `
  );
  const response = await request.json();
  const data = response.item;

  return {
    data,
  };
}
