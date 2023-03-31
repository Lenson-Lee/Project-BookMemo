import Slider from "react-slick";
import { useMutation, useQueryClient } from "react-query";

interface Props {
  data: any;
}

interface LikeType {
  id: number;
  like: number;
}

const CommentSlider = ({ data }: Props) => {
  console.log(data);

  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  /** 좋아요 클릭 이벤트 */

  const queryClient = useQueryClient();
  async function likeQuery(likeData: LikeType) {
    const response = await fetch(`/api/bookproject/comment/comment.like.add`, {
      method: "POST",
      body: JSON.stringify(likeData),
      headers: {
        Accept: "application / json",
      },
    });
    return response.json();
  }
  const likeMutation = useMutation(
    (likeData: LikeType) => likeQuery(likeData),
    {
      onSuccess: () => {
        // postTodo가 성공하면 todos로 맵핑된 useQuery api 함수를 실행합니다.
        queryClient.invalidateQueries("comment");
        console.log("like useMutation > POST");
      },
    }
  );

  return (
    <Slider {...settings}>
      {data &&
        data.map((item: any, index: number) => {
          return (
            <div key={item.id + index} className="mt-2">
              <div className="mx-2 p-5 rounded-lg bg-gray-100 h-56">
                {/* profile */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <div className="flex gap-x-2 items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-700 border" />
                    <p className="text-lg font-medium">{item?.displayName}</p>
                  </div>
                  {/* 좋아요 💔1인당 1회만 가능하도록 해야한다 */}
                  <button
                    // onClick={() => {
                    //   likeMutation.mutate({
                    //     id: item.id,
                    //     like: item.like + 1,
                    //   });
                    // }}
                    className="px-2 py-1 bg-white border rounded-full text-sm text-rose-400 flex gap-x-1 items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                    </svg>
                    <p>좋아요</p>
                    <p>{item.like}</p>
                  </button>
                </div>
                {/* content */}
                <div className="line-clamp-5">{item.content}</div>
              </div>
            </div>
          );
        })}
    </Slider>
  );
};

export default CommentSlider;
