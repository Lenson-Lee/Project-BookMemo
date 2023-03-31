interface Props {
  data: {};
}

export default function List({ data }: Props) {
  return data;
}

// 알라딘 책 리스트 조회
export async function getBookList(target: string) {
  const TTB = process.env.ALADIN_TTBKEY;
  const request = await fetch(`
  http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${TTB}&QueryType=${target}&MaxResults=12&start=1&SearchTarget=${"Book"}&output=js&Version=20131101&Cover=Big
  `);

  const response = await request.json();
  const data = response;

  return {
    data,
  };
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   console.log("api 진입");

//   const data = await axios
//     .get(
//       "http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=ttbdmstjs74371420001&QueryType=Bestseller&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101"
//     )
//     .then((res) => {
//       console.log(res.data);
//       console.log("=========== API 결과 끝 ===========");
//       return res.data;
//     });
//   return { props: { data } };
// }
