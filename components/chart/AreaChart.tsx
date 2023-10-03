import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const customOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      align: "end" as const,
    },
    title: {
      display: true,
      position: "top" as const,
      text: "Chart.js Line Chart",
      align: "start" as const,
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const customData = {
  labels,
  datasets: [
    {
      fill: true,
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      tension: 0.4,
    },
    {
      fill: true,
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: ["#5F59F7"],
      backgroundColor: "rgba(94, 89, 247, 0.5)",
      tension: 0.4,
    },
  ],
};

type AreaProps = {
  data?: {
    labels: any;
    datasets: any;
  };
  options?: any;
  width?: string;
  height?: string;
  className?: string;
};

const AreaChart = ({ data, options, width, height, className }: AreaProps) => {
  return (
    <div className="w-full flex items-center gap-2 overflow-x-hidden overflow-y-auto">
      <Line
        data={data ? data : customData}
        height={height}
        width={width}
        options={options ? options : customOptions}
        className={className}
      />
    </div>
  );
};

export default AreaChart;
