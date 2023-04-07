import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";

interface Props {
  apidata: any;
  slide: number;
  score: any;
}

const BookListSlider = ({ apidata, slide, score }: Props) => {
  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: slide,
    slidesToScroll: slide,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <>
      {apidata && (
        <Slider {...settings}>
          {apidata?.map((book: any) => (
            <Link
              // as={`/search/isbn=${book.isbn}&isbn13=${
              //   book.isbn13 ? book.isbn13 : "null"
              // }/detail`}
              href={{
                pathname: `/bookproject/search/isbn=${book.isbn}&isbn13=${
                  book.api.isbn13 ? book.api.isbn13 : "null"
                }/detail`,
                query: { data: JSON.stringify(book.api) },
              }}
              key={book.api.title}
              className=""
            >
              <Image
                alt="책표지"
                src={book.api.cover}
                width={500}
                height={500}
                className="object-cover object-center border bg-gray-100 mx-auto w-36 h-44 lg:w-44 lg:h-60"
              />
              <div className="w-36 lg:w-44 mt-4 mx-auto">
                {/* 별점 존재시 점수 노출 */}
                {book.score && (
                  <div className="text-sm line-clamp-1 bg-yellow-50 text-yellow-400 px-2 py-1 rounded-full flex gap-x-1 items-center w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {"평균 " + book.score.score.toFixed(1) + "점"}
                  </div>
                )}
                <div className=" text-base line-clamp-1 font-semibold">
                  {book.api.title}
                </div>
                <div className=" text-sm line-clamp-1">{book.api.author}</div>
              </div>
            </Link>
          ))}
        </Slider>
      )}
    </>
  );
};

export default BookListSlider;
