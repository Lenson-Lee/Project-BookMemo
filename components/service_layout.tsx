/** 서비스의 전체적인 구조 담당 */

import Head from "next/head";
import Navbar from "./Navbar/navbar";

interface Props {
  children: React.ReactNode;
}
const ServiceLayout = function ({ children }: Props) {
  return (
    <>
      <Head>
        <title>Book Project</title>
      </Head>
      <div className="bg-gray-50 font-pretendard pb-20">
        <Navbar />
        <div className="max-w-screen-xl mx-auto">
          <div>{children}</div>

          <footer className="mt-20 flex justify-center gap-x-10">
            <p className="text-gray-300 text-sm">GitHub : Lenson-Lee</p>
            <p className="text-gray-300 text-sm">문의 : dmstjs7437@naver.com</p>
            <p className="text-gray-300 text-sm">
              도서 DB 제공 : 알라딘 인터넷서점(www.aladin.co.kr)
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default ServiceLayout;
