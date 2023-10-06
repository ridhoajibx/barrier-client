import { Inter } from "next/font/google";
import DashboardLayouts from "@/components/layouts/DashboardLayouts";
import {
  MdArrowDropDown,
  MdCardMembership,
  MdOutlineDirectionsCarFilled,
  MdPeople,
} from "react-icons/md";
import { GetServerSideProps } from "next";
import { deleteCookie, getCookies } from "cookies-next";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import { getAuthMe, selectAuth } from "@/redux/features/AuthenticationReducers";
import { useEffect, useState } from "react";
import Doughnutcharts from "@/components/chart/Doughnutcharts";
import AreaChart from "@/components/chart/AreaChart";
import Navbar from "@/components/layouts/header/Navbar";
import { selectDailyManagement } from "@/redux/features/dashboard/dailyReducers";

const inter = Inter({ subsets: ["latin"] });

interface LegendVisibility {
  [key: string]: boolean;
}

interface PageProps {
  page: string;
  token: any;
  refreshToken: any;
}

type Props = {
  pageProps: PageProps;
};

const Home = ({ pageProps }: Props) => {
  const { token, refreshToken } = pageProps;

  const dispatch = useAppDispatch();
  const { data, pending, error } = useAppSelector(selectAuth);
  // daily-data
  const { dailyReport } = useAppSelector(selectDailyManagement);
  console.log(data, "data-auth");

  useEffect(() => {
    if (!token) {
      return;
    }
    dispatch(
      getAuthMe({
        token,
        callback: () => {
          deleteCookie("accessToken");
          deleteCookie("refreshToken");
          deleteCookie("roles");
        },
      })
    );
  }, [token]);

  // chart
  let areaData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        fill: true,
        label: "Guest",
        borderRadius: 0,
        data: [10, 34, 23, 35, 21, 44, 63],
        borderColor: "#FF8859",
        backgroundColor: "rgba(255, 136, 89, 0.5)",
        tension: 0.4,
      },
      {
        fill: true,
        label: "Employee",
        borderRadius: 0,
        data: [12, 44, 23, 33, 22, 54, 73],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.3)",
        tension: 0.4,
      },
    ],
  };

  let areaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
      },
      legend: {
        display: true,
        position: "top" as const,
        align: "end" as const,
        labels: {
          boxWidth: 15,
          usePointStyle: false,
          pointStyle: "circle",
        },
      },
      title: {
        display: false,
        position: "top" as const,
        text: "Arrival Weekly",
        align: "start" as const,
        font: {
          size: 16,
          weight: "normal",
        },
      },
    },
  };

  let barData = {
    labels: [
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
    ],
    datasets: [
      {
        label: "Solved",
        borderRadius: 0,
        data: [0.1, 0.3, 0.2, 0.4, 0.7, 0.6, 0.5],
        backgroundColor: "#52B788",
        barThickness: 30,
      },
      {
        label: "Unsolved",
        borderRadius: 0,
        data: [0.07, 0.3, 0.15, 0.2, 0.5, 0.3, 0.8],
        backgroundColor: "#95D5B2",
        barThickness: 30,
      },
    ],
  };

  let barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        titleFont: {
          size: 20,
        },
        bodyFont: {
          size: 16,
        },
      },
      legend: {
        display: true,
        position: "top",
        align: "center",
        labels: {
          boxWidth: 15,
          usePointStyle: false,
          pointStyle: "circle",
        },
      },
      title: {
        position: "top",
        align: "start",
        display: false,
        text: "Plan vs Realization by Month 2022",
        color: "#333",
        font: {
          size: 18,
          weight: "normal",
        },
      },
    },
    elements: {
      bar: {
        percentage: 0.3,
        categoryPercentage: 1,
      },
    },
  };

  let doughnutData = {
    labels: ["Employee", "Guest"],
    datasets: [
      {
        label: "# Votes",
        data: [20, 80],
        backgroundColor: ["#0E5CBE", "#E9B824"],
        borderColor: ["#0E5CBE", "#E9B824"],
        borderWidth: 0,
      },
    ],
  };

  const valueDoughnut = ({ data, index }: any) => {
    const total = data.reduce((a: number, b: number) => a + b, 0);
    let currentValue = data[index];
    let percentage = Math.floor((currentValue / total) * 100 + 0.5);
    return {
      value: currentValue,
      percent: percentage,
    };
  };

  let doughnutOptions = {
    cutout: 90,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        responsive: true,
        display: false,
        position: "right",
        align: "center",
        labels: {
          boxWidth: 5,
          boxHeight: 20,
          borderRadius: 5,
          font: {
            size: 16,
          },
          generateLabels: (chart: any) => {
            const { labels, datasets } = chart.data;
            if (labels.length > 0) {
              return labels.map((label: any, i: any) => {
                const { borderColor, backgroundColor, data } = datasets[0];
                const total = data.reduce((a: number, b: number) => a + b, 0);

                const formattedLabel = data.map((val: number, i: any) => {
                  let currentValue = val;
                  let percentage = Math.floor(
                    (currentValue / total) * 100 + 0.5
                  );
                  return {
                    value: currentValue,
                    label,
                    percentage,
                    backgroundColor: backgroundColor[i],
                    borderColor: borderColor[i],
                    borderRadius: 5,
                  };
                });

                return {
                  text: `${formattedLabel[i].label} \n ${formattedLabel[i].percentage}% \n ${formattedLabel[i].value}`,
                  fillStyle: formattedLabel[i].backgroundColor,
                  hidden: !chart.getDataVisibility(i),
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      parsing: {
        key: "id",
      },
      title: {
        display: false,
        position: "top",
        align: "start",
        text: "Employee / Guest",
        font: {
          size: 16,
          weight: 300,
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
      tooltip: {
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 16,
        },
        callbacks: {
          label: function (item: any) {
            let dataset = item.dataset;
            const total = dataset.data.reduce(function (
              sum: number,
              current: any
            ) {
              return sum + Number(current);
            },
            0);
            let currentValue = item.parsed;
            let percentage = Math.floor((currentValue / total) * 100 + 0.5);
            return `${item.label} : ${currentValue} ${
              currentValue > 1 ? "people" : "person"
            } - ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <DashboardLayouts
      userDefault="/images/logo.png"
      token={token}
      refreshToken={refreshToken}
      header={"header"}
      title={"title"}>
      <div className="relative w-full bg-gray overflow-auto">
        <Navbar />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 md:p-6 2xl:p-10">
          <div className="w-full lg:col-span-2">
            <div className="w-full mb-3">
              <button
                type="button"
                onClick={() => console.log("weekly")}
                className="inline-flex p-2 text-lg lg:text-2xl font-semibold focus:outline-none gap-2 items-center">
                <span>Weekly Report</span>
                <MdArrowDropDown className="w-6 lg:w-8 h-6 lg:h-8" />
              </button>

              {/* header */}
              <div className="w-full bg-white rounded-lg shadow-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
                <div className="w-full p-2">
                  <h3 className="text-xs lg:text-sm text-gray-5">
                    Weekly Arrival
                  </h3>
                  <div className="w-full flex items-center gap-1">
                    <span>
                      <MdOutlineDirectionsCarFilled className="w-6 h-6 text-primary" />
                    </span>
                    <div className="flex gap-1 items-center">
                      <span className="font-bold text-lg">45</span>
                      <span>Vehicles</span>
                    </div>
                  </div>
                </div>
                <div className="w-full p-2">
                  <h3 className="text-xs lg:text-sm text-gray-5">Employee</h3>
                  <div className="w-full flex items-center gap-1">
                    <span>
                      <MdPeople className="w-6 h-6 text-primary" />
                    </span>
                    <div className="flex gap-1 items-center">
                      <span className="font-bold text-lg">32</span>
                      <span>People</span>
                    </div>
                  </div>
                </div>
                <div className="w-full p-2">
                  <h3 className="text-xs lg:text-sm text-gray-5">
                    Avarage Stay
                  </h3>
                  <div className="w-full flex items-center gap-1">
                    <span>
                      <MdCardMembership className="w-6 h-6 text-primary" />
                    </span>
                    <div className="flex gap-1 items-center">
                      <span className="font-bold text-lg">8</span>
                      <span>Hours</span>
                    </div>
                  </div>
                </div>
                <div className="w-full p-2">
                  <h3 className="text-xs lg:text-sm text-gray-5">Guest</h3>
                  <div className="w-full flex items-center gap-1">
                    <span>
                      <MdCardMembership className="w-6 h-6 text-primary" />
                    </span>
                    <div className="flex gap-1 items-center">
                      <span className="font-bold text-lg">32</span>
                      <span>Areas</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full p-4 bg-white rounded-lg shadow-card">
                <h3 className="font-thin text-lg text-gray-5">
                  Arrival Weekly
                </h3>
                <AreaChart
                  data={areaData}
                  height="400"
                  options={areaOptions}
                  className=""
                />
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="w-full bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base border border-gray p-4 rounded-lg">
              <h3 className="p-4 border-b border-gray text-lg lg:text-2xl font-semibold">
                Today Report
              </h3>
              <div className="w-full bg-white p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4 border-b border-gray">
                <div className="w-full p-2 text-sm">
                  <h3 className="text-xs lg:text-sm text-gray-5">
                    Weekly Arrival
                  </h3>
                  <div className="w-full flex items-center gap-1">
                    <span>
                      <MdOutlineDirectionsCarFilled className="w-6 h-6 text-primary" />
                    </span>
                    <div className="flex gap-1 items-center">
                      <span className="font-bold">45</span>
                      <span>Vehicles</span>
                    </div>
                  </div>
                </div>
                <div className="w-full p-2 text-sm">
                  <h3 className="text-xs lg:text-sm text-gray-5">Employee</h3>
                  <div className="w-full flex items-center gap-1">
                    <span>
                      <MdPeople className="w-6 h-6 text-primary" />
                    </span>
                    <div className="flex gap-1 items-center">
                      <span className="font-bold">32</span>
                      <span>People</span>
                    </div>
                  </div>
                </div>
                <div className="w-full p-2 text-sm">
                  <h3 className="text-xs lg:text-sm text-gray-5">Guest</h3>
                  <div className="w-full flex items-center gap-1">
                    <span>
                      <MdCardMembership className="w-6 h-6 text-primary" />
                    </span>
                    <div className="flex gap-1 items-center">
                      <span className="font-bold">32</span>
                      <span>Areas</span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg p-4">Employee / Guest</h3>
              <div className="w-full flex items-center gap-2">
                <div className="w-2/3">
                  <Doughnutcharts
                    data={doughnutData}
                    options={doughnutOptions}
                    className="w-full max-w-max"
                    height="300px"
                  />
                </div>
                <div className="w-1/3">
                  {doughnutData?.datasets?.map((chart, index) => {
                    return (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="w-full flex items-center gap-2 text-left">
                          <div
                            style={{
                              borderColor: chart.borderColor[0],
                              backgroundColor: chart.backgroundColor[0],
                            }}
                            className="w-1.5 h-14 border rounded-sm"></div>
                          <div>
                            <p className="text-sm">{doughnutData?.labels[0]}</p>
                            <p className="text-sm font-semibold">
                              {`${
                                valueDoughnut({
                                  data: chart?.data,
                                  index: 0,
                                }).percent
                              }%`}
                            </p>
                            <p className="text-xs font-semibold text-gray-5">
                              {valueDoughnut({
                                data: chart?.data,
                                index: 0,
                              }).value > 1
                                ? `${
                                    valueDoughnut({
                                      data: chart?.data,
                                      index: 0,
                                    }).value
                                  } people`
                                : `${
                                    valueDoughnut({
                                      data: chart?.data,
                                      index: 0,
                                    }).value
                                  } person`}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex items-center gap-2">
                          <div
                            style={{
                              borderColor: chart.borderColor[1],
                              backgroundColor: chart.backgroundColor[1],
                            }}
                            className="w-1.5 h-14 border rounded-sm"></div>

                          <div>
                            <p className="text-sm">{doughnutData?.labels[1]}</p>
                            <p className="text-sm font-semibold">
                              {`${
                                valueDoughnut({
                                  data: chart?.data,
                                  index: 1,
                                }).percent
                              }%`}
                            </p>
                            <p className="text-xs font-semibold text-gray-5">
                              {valueDoughnut({
                                data: chart?.data,
                                index: 1,
                              }).value > 1
                                ? `${
                                    valueDoughnut({
                                      data: chart?.data,
                                      index: 1,
                                    }).value
                                  } areas`
                                : `${
                                    valueDoughnut({
                                      data: chart?.data,
                                      index: 1,
                                    }).value
                                  } area`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayouts>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  // Parse cookies from the request headers
  const cookies = getCookies({ req, res });

  // Access cookies using the cookie name
  const token = cookies["accessToken"] || null;
  const refreshToken = cookies["refreshToken"] || null;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }

  return {
    props: { token, refreshToken },
  };
};
