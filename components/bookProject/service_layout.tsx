/** 서비스의 전체적인 구조 담당 */

import Head from "next/head";
import Navbar from "./Navbar/navbar";
import Mobile from "./Navbar/mobile";

interface Props {
  children: React.ReactNode;
}
const ServiceLayout = function ({ children }: Props) {
  return (
    <>
      <Head>
        <title>Book Project</title>
      </Head>
      <div className="bg-gray-50 da min-h-screen font-pretendard dark:text-black">
        <Navbar />
        <div className="px-3 lg:px-0 max-w-screen-xl mx-auto">
          <div>{children}</div>

          <footer className="mt-10 lg:mt-20 pb-36 lg:pb-20 px-10 space-y-2 lg:space-y-0 lg:px-0 lg:flex justify-center gap-x-10 ">
            <p className="text-gray-300 text-sm">GitHub : Lenson-Lee</p>
            <p className="text-gray-300 text-sm">문의 : dmstjs7437@naver.com</p>
            <p className="text-gray-300 text-sm">
              도서 DB 제공 : 알라딘 인터넷서점(www.aladin.co.kr)
            </p>
          </footer>
        </div>
        {/* 반응형 네비게이션 */}
        <Mobile />
      </div>
    </>
  );
};

export default ServiceLayout;
