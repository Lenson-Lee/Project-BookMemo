import React from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(...registerables);

interface Props {
  count: any;
}

export default function App({ count }: Props) {
  const { thisMonth, lastMonth, twolastMonth } = count;
  // console.log(thisMonth);

  const today = new Date().getMonth() + 1;
  const second = new Date().getMonth();
  const third = new Date().getMonth() - 1;

  /** chart에 들어가는 값 */

  const data = {
    labels: [third + "월", second + "월", today + "월"],
    datasets: [
      {
        borderRadius: 8,
        maxBarThickness: 40,
        data: [twolastMonth.length, lastMonth.length, thisMonth.length],

        backgroundColor: ["#f3f4f6", "#f3f4f6", "#fde047"],
        borderColor: ["#e5e7eb", "#e5e7eb", "#fbbf24"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
      }}
    />
  );
}
