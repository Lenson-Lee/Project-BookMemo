import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";

interface Props {
  data: any;
}

const BookListSlider = ({ data }: Props) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
  };

  return (
    <>
      {/* react-slider css import시 오류발생 */}
      {/* 책 리스트 슬라이더로 출력 */}
      {data && (
        <Slider {...settings}>
          {data?.data.item.map((book: any) => (
            <Link
              // as={`/search/isbn=${book.isbn}&isbn13=${
              //   book.isbn13 ? book.isbn13 : "null"
              // }/detail`}
              href={{
                pathname: `/search/isbn=${book.isbn}&isbn13=${
                  book.isbn13 ? book.isbn13 : "null"
                }/detail`,
                query: { data: JSON.stringify(book) },
              }}
              key={book.title}
              className=""
            >
              <Image
                alt="책표지"
                src={book.cover}
                width={500}
                height={500}
                className="object-cover object-center border bg-gray-100 mx-auto w-44  h-60"
              />
              <div className="w-44 mt-4 mx-auto">
                <div className=" text-base line-clamp-1 font-semibold">
                  {book.title}
                </div>
                <div className=" text-sm line-clamp-1">{book.author}</div>
              </div>
            </Link>
          ))}
        </Slider>
      )}
    </>
  );
};

export default BookListSlider;
