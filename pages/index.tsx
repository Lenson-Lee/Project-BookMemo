import ServiceLayout from "@/components/bookProject/service_layout";
import type { GetStaticProps } from "next";
import { GoogleAuthProvider } from "firebase/auth";
import { getBookList } from "@/pages/api/bookproject/book.list";
import BookListSlider from "@/components/bookProject/List/bookListSlider";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

const provider = new GoogleAuthProvider();

function Home() {
  return (
    <>
      <Link href="/bookproject" className=" w-full">
        <div className="mt-40 flex-col flex justify-center items-center">
          <Image
            width={500}
            height={500}
            src={"/images/bear.jpg"}
            alt="갓생걸"
            className="w-1/3 h-1/3 object-cover object-center"
          />
          <p className="text-2xl">
            약간의 공사중입니다. 통행에 불편을 드려 죄송합니다🙏🙏
          </p>
          <p className="mt-4 text-2xl p-3 rounded-full bg-yellow-400 text-white font-semibold">
            클릭시 이동합니다 💨
          </p>
        </div>
      </Link>
    </>
  );
}

export default Home;
