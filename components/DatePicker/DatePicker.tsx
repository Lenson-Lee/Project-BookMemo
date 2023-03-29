/**
 * @file Clickable.js
 * @author Tiumsolutions (developers@tiumsolutions.com)
 * @brief react-datepicker 커스텀, 날짜 선택 기능. **/

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { StyleDate } from "./Style";
import { getYear, getMonth, getDate, getDay } from "date-fns";
import { ko } from "date-fns/locale";
// import { enUS } from "date-fns/locale"; //token excport 오류 발생시 변경해보기

interface Props {
  getStart: any;
  getEnd: any;
  state: string;
}
const Clickable = ({ getStart, getEnd, state }: Props) => {
  const [date, setDate] = useState(new Date());
  //요일찾기
  const findDay = (e: number) => {
    const dayList = ["일", "월", "화", "수", "목", "금", "토"];
    return dayList[e];
  };

  const days =
    getYear(date) +
    "년 " +
    (getMonth(date) + 1) +
    "월 " +
    getDate(date) +
    "일 " +
    "(" +
    findDay(getDay(date)) +
    ")";

  return (
    <>
      {/* 달력 출력 창 */}
      <StyleDate>
        <DatePicker
          locale={ko} //한국어
          selected={date} //value
          onChange={(d: any) => {
            setDate(new Date(d));
            if (state === "start") {
              getStart(new Date(d));
            } else {
              getEnd(new Date(d));
            }
          }} //날짜 선택 시 실행될 함수
          dateFormatCalendar={"yyyy년 MMM"}
          dateFormat="yyyy년 MM월 dd일"
        />
      </StyleDate>
    </>
  );
};

export default Clickable;
