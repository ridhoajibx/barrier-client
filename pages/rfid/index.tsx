import Image from "next/image";
import { Inter } from "next/font/google";
import DashboardLayouts from "@/components/layouts/DashboardLayouts";
import { useEffect, useMemo, useState } from "react";
import SelectTables from "@/components/tables/layouts";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { SearchInput } from "@/components/forms/SearchInput";
import DropdownSelect from "@/components/dropdown/DropdownSelect";
import ReactDatePicker from "react-datepicker";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import { getAuthMe, selectAuth } from "@/redux/features/AuthenticationReducers";
import { deleteCookie, getCookies } from "cookies-next";
import { GetServerSideProps } from "next";
import Navbar from "@/components/layouts/header/Navbar";

const inter = Inter({ subsets: ["latin"] });

interface PageProps {
  page: string;
  token: any;
  refreshToken: any;
}

type Props = {
  pageProps: PageProps;
};

interface RfidProps {
  rfid?: number | string | any;
  fullName?: string | any;
  vehiclesType?: string | any;
  vehiclesNumber?: string | any;
  arrival?: string | any;
  departure?: string | any;
}

interface Options {
  value: string | any;
  label: string | any;
}

const sortOpt: Options[] = [
  { value: "ASC", label: "A-Z" },
  { value: "DESC", label: "Z-A" },
];

const stylesSelectSort = {
  indicatorsContainer: (provided: any) => ({
    ...provided,
    flexDirection: "row-reverse",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided: any) => {
    return {
      ...provided,
      color: "#7B8C9E",
    };
  },
  clearIndicator: (provided: any) => {
    return {
      ...provided,
      color: "#7B8C9E",
    };
  },
  singleValue: (provided: any) => {
    return {
      ...provided,
      color: "#5F59F7",
    };
  },
  control: (provided: any, state: any) => {
    return {
      ...provided,
      background: "",
      padding: ".6rem",
      borderRadius: ".75rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 40,
      flexDirection: "row-reverse",
    };
  },
  menuList: (provided: any) => provided,
};

const stylesSelect = {
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided: any) => {
    return {
      ...provided,
      color: "#7B8C9E",
    };
  },
  clearIndicator: (provided: any) => {
    return {
      ...provided,
      color: "#7B8C9E",
    };
  },
  singleValue: (provided: any) => {
    return {
      ...provided,
      color: "#5F59F7",
    };
  },
  control: (provided: any, state: any) => {
    // console.log(provided, "control")
    return {
      ...provided,
      background: "",
      padding: ".6rem",
      borderRadius: ".75rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 40,
      // flexDirection: "row-reverse"
    };
  },
  menuList: (provided: any) => provided,
};

const exData: RfidProps[] | any[] = [
  {
    rfid: "1234DSA",
    fullName: "Jumakri Ridho Fauzi",
    vehiclesNumber: "B 1234 CWA",
    vehiclesType: "sedan",
    arrival: new Date(),
    departure: new Date(),
  },
  {
    rfid: "1234DSA",
    fullName: "Jumakri Ridho Fauzi",
    vehiclesNumber: "B 1234 CWA",
    vehiclesType: "sedan",
    arrival: new Date(),
    departure: new Date(),
  },
  {
    rfid: "1234DSA",
    fullName: "Jumakri Ridho Fauzi",
    vehiclesNumber: "B 1234 CWA",
    vehiclesType: "sedan",
    arrival: new Date(),
    departure: new Date(),
  },
  {
    rfid: "1234DSA",
    fullName: "Jumakri Ridho Fauzi",
    vehiclesNumber: "B 1234 CWA",
    vehiclesType: "sedan",
    arrival: new Date(),
    departure: new Date(),
  },
];

export default function Rfid({ pageProps }: Props) {
  const { token, refreshToken } = pageProps;

  const dispatch = useAppDispatch();
  const { data, pending, error } = useAppSelector(selectAuth);

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

  const dateFormat = (value: any) => {
    let format: any = null;
    if (value) {
      format = moment(new Date(value)).format("DD/MM/YYYY");
    }
    return format;
  };

  const [pages, setPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);

  const [search, setSearch] = useState<string | any>(null);
  const [sort, setSort] = useState<Options | any>(null);
  const [types, setTypes] = useState<Options | any>(null);
  const [typesOpt, setTypesOpt] = useState<Options[] | any[]>([]);

  const [dataTable, setDataTable] = useState<any[] | any>([]);
  const [isSelected, setIsSelected] = useState<any[] | any>([]);
  const [loading, setLoading] = useState<false>(false);

  const now = new Date();
  const [start, setStart] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [end, setEnd] = useState(
    new Date(now.getFullYear(), now.getMonth() + 1, 0)
  );
  const [dateRange, setDateRange] = useState<Date[]>([start, end]);
  const [startDate, endDate] = dateRange;

  const columns = useMemo<ColumnDef<RfidProps, any>[]>(
    () => [
      {
        accessorKey: "rfid",
        header: (info) => <div className="uppercase">RFID</div>,
        cell: ({ getValue, row }) => {
          return <div>{getValue()}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "fullName",
        cell: ({ row, getValue }) => {
          return <div>{getValue()}</div>;
        },
        header: (props) => (
          <div className="w-full text-left uppercase">User</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "arrival",
        cell: ({ row, getValue }) => {
          return <div>{!getValue() ? "" : dateFormat(getValue())}</div>;
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Arrival Date</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "departure",
        cell: ({ row, getValue }) => {
          return <div>{!getValue() ? "" : dateFormat(getValue())}</div>;
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Departure Date</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "vehiclesNumber",
        cell: ({ row, getValue }) => {
          return <div>{getValue()}</div>;
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Vehicle No.</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
    ],
    []
  );

  useEffect(() => {
    setDataTable(exData);
  }, [exData]);

  return (
    <DashboardLayouts
      userDefault="/images/logo.png"
      logo="/images/logo.png"
      token={token}
      refreshToken={refreshToken}
      header={"RFID"}
      title={"title"}>
      <div className="w-full bg-white h-full overflow-auto relative">
        <Navbar />
        <div className="w-full md:p-6 2xl:p-10">
          <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-2.5 p-4">
            <div className="w-full lg:col-span-2">
              <SearchInput
                className="w-full text-sm rounded-xl"
                classNamePrefix=""
                filter={search}
                setFilter={setSearch}
                placeholder="Search..."
              />
            </div>
            <div className="w-full flex flex-col lg:flex-row items-center gap-2">
              <DropdownSelect
                customStyles={stylesSelectSort}
                value={sort}
                onChange={setSort}
                error=""
                className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                classNamePrefix=""
                formatOptionLabel=""
                instanceId="1"
                isDisabled={false}
                isMulti={false}
                placeholder="Sorts..."
                options={sortOpt}
                icon="MdSort"
              />
            </div>

            <div className="w-full flex flex-col lg:flex-row items-center gap-2">
              <div className="w-full">
                <label className="w-full text-gray-5 overflow-hidden">
                  <div className="relative">
                    <ReactDatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update: any) => {
                        setDateRange(update);
                      }}
                      isClearable={false}
                      placeholderText={"Select date"}
                      todayButton
                      dropdownMode="select"
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      disabled={false}
                      clearButtonClassName="after:w-10 after:h-10 h-10 w-10"
                      className="text-sm lg:text-md w-full text-gray-5 rounded-lg border border-stroke bg-transparent py-4 pl-12 pr-6 outline-none focus:border-primary focus-visible:shadow-none "
                    />
                    <MdOutlineCalendarToday className="absolute left-4 top-4 h-6 w-6 text-gray-5" />
                  </div>
                </label>
              </div>
            </div>

            <div className="w-full flex flex-col lg:flex-row items-center gap-2">
              <DropdownSelect
                customStyles={stylesSelect}
                value={types}
                onChange={setTypes}
                error=""
                className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                classNamePrefix=""
                formatOptionLabel=""
                instanceId="1"
                isDisabled={false}
                isMulti={false}
                placeholder="All Type..."
                options={typesOpt}
                icon=""
              />
            </div>
          </div>

          <div className="w-full">
            <SelectTables
              loading={loading}
              setLoading={setLoading}
              pages={pages}
              setPages={setPages}
              limit={limit}
              setLimit={setLimit}
              pageCount={pageCount}
              columns={columns}
              dataTable={dataTable}
              total={total}
              setIsSelected={setIsSelected}
              classTable=""
            />
          </div>
        </div>
      </div>
    </DashboardLayouts>
  );
}

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
