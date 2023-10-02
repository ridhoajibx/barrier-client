import { Inter } from "next/font/google";
import DashboardLayouts from "@/components/layouts/DashboardLayouts";
import { AreaCharts } from "@/components/chart/AreaChart";
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
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

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

  return (
    <DashboardLayouts
      userDefault="/images/logo.png"
      token={token}
      header={"header"}
      title={"title"}>
      <div className="w-full p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="w-full lg:col-span-2">
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
                <h3 className="text-xs lg:text-sm text-gray-5">Avarage Stay</h3>
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
                    <span>Guests</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full p-2 bg-white rounded-lg shadow-card">
              <AreaCharts />
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
