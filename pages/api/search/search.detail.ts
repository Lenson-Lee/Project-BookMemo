/** mybook.get.detail 에 왜 상세검색결과 복사*/

export async function getSearchDetail(target: any) {
  const isbnType = target.isbn13 != "null" ? "ISBN13" : "ISBN";
  const isbnID = target.isbn13 != "null" ? target.isbn13 : target.isbn;
  const TTB = process.env.ALADIN_TTBKEY;

  const request = await fetch(
    `
  http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${TTB}&itemIdType=${isbnType}&ItemId=${isbnID}&SearchTarget=Book&output=js&Version=20131101&Cover=Big
`
  );
  const response = await request.json();
  const apidata = response?.item[0];
  console.log(">search.detail --END");

  const data = { apidata: apidata };
  return {
    data,
  };
}
