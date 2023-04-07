import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";

interface Props {
  apidata: any;
  slide: number;
}

//알라딘에서 받아온 api 순정 데이터 렌더(bookListSlider와 형태가 조금 달라서 따로 작성)
const apiBookListSlider = ({ apidata, slide }: Props) => {
  console.log(apidata, slide);
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
      <Slider {...settings}>
        {apidata.map((book: any, index: number) => (
          <Link
            key={book.isbn + index}
            href={{
              pathname: `/bookproject/search/isbn=${book.isbn}&isbn13=${
                book.isbn13 ? book.isbn13 : "null"
              }/detail`,
              query: { data: JSON.stringify(book) },
            }}
            className=""
          >
            <Image
              alt="책표지"
              src={book.cover}
              width={500}
              height={500}
              className="object-cover object-center border bg-gray-100 w-36 h-44 lg:w-44 lg:h-60 mx-auto"
            />
            <div className="w-36 lg:w-44 mt-4 mx-auto">
              <div className="mt-2 text-base line-clamp-1 font-semibold">
                {book.title}
              </div>
              <div className="text-sm line-clamp-1">{book.author}</div>
            </div>
          </Link>
        ))}
      </Slider>
    </>
  );
};

export default apiBookListSlider;
