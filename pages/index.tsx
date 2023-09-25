import Image from "next/image";
import { Inter } from "next/font/google";
import DashboardLayouts from "@/components/layouts/DashboardLayouts";
import { AreaCharts } from "@/components/chart/AreaChart";
import {
  MdArrowDropDown,
  MdCarRental,
  MdCardMembership,
  MdExpandMore,
  MdOutlineDirectionsCarFilled,
  MdPeople,
} from "react-icons/md";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <DashboardLayouts
      userDefault="/images/logo.png"
      token={""}
      header={"header"}
      title={"title"}>
      <div className="w-full bg-gray p-6">
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
}
