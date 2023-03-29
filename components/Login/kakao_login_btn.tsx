import Image from "next/image";

interface Props {
  onClick: () => void;
}

export const KakaoLoginBtn = function ({ onClick }: Props) {
  return (
    <>
      <button
        onClick={onClick}
        className="bg-yellow-300 rounded-full px-7 py-2 mx-auto flex justify-center gap-x-5 text-white text-lg"
      >
        <Image
          src="/google.svg"
          alt="google 로고"
          width={500}
          height={500}
          className="p-1 rounded-full bg-white"
        />
        <p>Kakao 계정으로 시작하기</p>
      </button>
    </>
  );
};
