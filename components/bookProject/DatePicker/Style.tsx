import styled from "styled-components";

const StyleDate = styled.div`
  & input {
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: center;
    width: 90%;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    border-width: 0.25px;
    border-radius: 0.75rem;
    background-color: #f9fafb;
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  .react-datepicker-popper {
    border-style: solid;
    border-color: rgb(203 213 225);
    border-radius: 0rem !important;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    padding-top: 1rem;
  }
  .react-datepicker__navigation {
    padding-left: 2rem;
    padding-right: 2rem;
    top: 1.5rem;
  } /* 헤더 */
  .react-datepicker__header {
    background: white !important;
    border-bottom: none !important;
  }
  .react-datepicker__triangle {
    display: none;
  }
  .react-datepicker__month-container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 1.5rem;
    padding-bottom: 1rem;
  }
  /* 헤더 - April 2022 부분 */
  .react-datepicker__current-month {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }
  /* 헤더 - 요일 */
  .react-datepicker__day-names {
    font-size: 1rem;
    font-weight: 600;
  }
  .react-datepicker__day--selected {
    color: white !important;
    background-color: #fde047 !important;
    border-radius: 100%;
  }
  .react-datepicker__day:hover {
    border-radius: 100%;
    border-color: #facc15 !important;
    border-style: solid !important;
    border: 2px !important;
  }
  .react-datepicker__day--today {
    color: #facc15;
  }
`;
export { StyleDate };
