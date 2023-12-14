/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable @next/next/no-img-element */
import { Inter } from "next/font/google";
import DashboardLayouts from "@/components/layouts/DashboardLayouts";
import { Fragment, useEffect, useMemo, useState } from "react";
import SelectTables from "@/components/tables/layouts";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { SearchInput } from "@/components/forms/SearchInput";
import DropdownSelect from "@/components/dropdown/DropdownSelect";
import ReactDatePicker from "react-datepicker";
import { MdImage, MdOutlineCalendarToday } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import {
  getAuthMe,
  selectAuth,
  webRefresh,
} from "@/redux/features/AuthenticationReducers";
import { deleteCookie, getCookies } from "cookies-next";
import { GetServerSideProps } from "next";
import Navbar from "@/components/layouts/header/Navbar";
import { useRouter } from "next/router";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { LogGateProps } from "@/utils/propTypes";
import Modal from "@/components/modal/Modal";
import { ModalHeader } from "@/components/modal/ModalComponent";
import {
  getLogGate,
  selectLogGateManagement,
} from "@/redux/features/log-gate/logGateReducers";

const inter = Inter({ subsets: ["latin"] });

interface PageProps {
  page: string;
  token: any;
  refreshToken: any;
  roles?: any | string;
}

type Props = {
  pageProps: PageProps;
};

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

const StatusOptions: Options[] = [
  {
    value: "open",
    label: "Open",
  },
  {
    value: "close",
    label: "Close",
  },
];

const valueNull = (value: any) => {
  return <div className={`italic font-light text-slate-400`}> {value}</div>;
};

export default function LogGate({ pageProps }: Props) {
  const router = useRouter();
  const { pathname, query } = router;
  const { token, refreshToken, roles } = pageProps;

  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);

  // data rfid
  const { logs, pending } = useAppSelector(selectLogGateManagement);

  const url = process.env.API_ENDPOINT;

  useEffect(() => {
    if (token) {
      dispatch(
        getAuthMe({
          token,
          callback: () => {
            dispatch(
              webRefresh({
                token: refreshToken,
                isSuccess: () => {
                  router.replace({ pathname, query });
                },
                isError: () => {
                  deleteCookie("role");
                  deleteCookie("accessToken");
                  deleteCookie("refreshToken");
                },
              })
            );
          },
        })
      );
    }
  }, [token, refreshToken]);

  const dateFormat = (value: any) => {
    let format: any = null;
    if (value) {
      format = moment(new Date(value)).format("DD/MM/YYYY, HH:mm");
    }
    return format;
  };

  const timeFormat = (value: any) => {
    let format: any = null;
    if (value) {
      format = moment(new Date(value)).format("HH:mm");
    }
    return format;
  };

  const [pages, setPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);

  const [search, setSearch] = useState<string | any>(null);
  const [sort, setSort] = useState<Options | any>(null);
  const [status, setStatus] = useState<Options | any>(null);

  const [dataTable, setDataTable] = useState<any[] | any>([]);
  const [isSelected, setIsSelected] = useState<any[] | any>([]);
  const [isCaptured, setIsCaptured] = useState<Object | any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const now = new Date();
  const [start, setStart] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [end, setEnd] = useState(
    new Date(now.getFullYear(), now.getMonth() + 1, 0)
  );
  const [dateRange, setDateRange] = useState<Date[]>([start, end]);
  const [startDate, endDate] = dateRange;

  // modal
  const [isPicture, setIsPicture] = useState<boolean>(false);

  const isOpenPicture = (value: any) => {
    setIsCaptured(value);
    setIsPicture(true);
  };

  const isClosePicture = () => {
    setIsCaptured({});
    setIsPicture(false);
  };

  // data-table
  useEffect(() => {
    if (query?.page) setPages(Number(query?.page) || 1);
    if (query?.limit) setLimit(Number(query?.limit) || 10);
    if (query?.search) setSearch((query?.search as any) || "");
    if (query?.sort) {
      if (query?.sort == "ASC") {
        setSort({ value: query?.sort, label: "A-Z" });
      } else {
        setSort({ value: query?.sort, label: "Z-A" });
      }
    }
    if (query?.status) {
      setStatus({ value: query?.status, label: query?.status });
    }
    if (query?.timeIn) {
      setStart(new Date(query?.timeIn as any));
    }
    if (query?.timeOut) {
      setEnd(new Date(query?.timeOut as any));
    }
  }, [
    query?.page,
    query?.limit,
    query?.search,
    query?.sort,
    query?.status,
    query?.timeIn,
    query?.timeOut,
  ]);

  useEffect(() => {
    let qr: any = {
      page: pages,
      limit: limit,
    };

    if (search) qr = { ...qr, search: search };
    if (sort) qr = { ...qr, sort: sort?.value };
    if (status) qr = { ...qr, types: status?.value };
    if (startDate)
      qr = {
        ...qr,
        timeIn: moment(startDate).format("YYYY-MM-DD HH:mm"),
      };
    if (endDate)
      qr = {
        ...qr,
        timeOut: moment(endDate).format("YYYY-MM-DD HH:mm"),
      };

    router.replace({ pathname, query: qr });
  }, [pages, limit, search, sort, status, startDate, endDate]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [
        {
          time: {
            $gte:
              moment(
                query?.timeIn
                  ? query?.timeIn
                  : new Date(now.getFullYear(), now.getMonth(), 1)
              ).format("YYYY-MM-DD") + "T00:00:00.000Z",
            $lte:
              moment(
                query?.timeOut
                  ? query?.timeOut
                  : new Date(now.getFullYear(), now.getMonth() + 1, 0)
              ).format("YYYY-MM-DD") + "T23:59:59.000Z",
          },
        },
        { gateStatus: { $contL: query?.status } },
        {
          $or: [
            { adminUsername: { $contL: query?.search } },
            { adminFullname: { $contL: query?.search } },
            { adminRole: { $contL: query?.search } },
            { gateStatus: { $contL: query?.search } },
          ],
        },
      ],
    };

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    qb.search(search);
    if (!query?.sort) {
      qb.sortBy({
        field: `time`,
        order: "DESC",
      });
    } else {
      qb.sortBy({
        field: `adminFullname`,
        order: !sort?.value ? "ASC" : sort.value,
      });
    }
    qb.query();
    return qb;
  }, [
    query?.page,
    query?.limit,
    query?.search,
    query?.sort,
    query?.timeIn,
    query?.timeOut,
    query?.status,
  ]);

  useEffect(() => {
    if (token) {
      dispatch(getLogGate({ token, params: filters?.queryObject }));
    }
  }, [token, filters]);

  useEffect(() => {
    const newArr: LogGateProps[] | any[] = [];
    let newPageCount: number | any = 0;
    let newTotal: number | any = 0;
    const { data, pageCount, total } = logs;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
      newPageCount = pageCount;
      newTotal = total;
    }
    setDataTable(newArr);
    setPageCount(newPageCount);
    setTotal(newTotal);
  }, [logs]);

  const columns = useMemo<ColumnDef<LogGateProps, any>[]>(
    () => [
      {
        accessorKey: "gateStatus",
        cell: ({ row, getValue }) => {
          if (getValue() == "Open") {
            return (
              <div className="w-55 text-danger">
                {getValue() ? getValue() : "-"}
              </div>
            );
          } else if (getValue() == "Close") {
            return (
              <div className="w-55 text-green-500">
                {getValue() ? getValue() : "-"}
              </div>
            );
          }
          return (
            <div className="w-55 text-green-500">
              {getValue() ? getValue() : "-"}
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Status</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "time",
        cell: ({ row, getValue }) => {
          let time = dateFormat(getValue());
          return <div className="w-55">{getValue() ? time : "-"}</div>;
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Time</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "adminFullName",
        cell: ({ row, getValue }) => {
          return <div className="w-55">{getValue() ? getValue() : "-"}</div>;
        },
        header: (props) => (
          <div className="w-full text-left uppercase">User</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "adminRole",
        cell: ({ row, getValue }) => {
          return <div>{getValue() || "-"}</div>;
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Role</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "id",
        cell: ({ row, getValue }) => {
          return (
            <div className="w-full flex items-center justify-center gap-2">
              <button
                type="button"
                className={`flex items-center gap-1 p-2 rounded-md border border-gray-5 hover:bg-gray active:scale-90`}
                onClick={() => isOpenPicture(row?.original)}>
                <span>
                  <MdImage className="w-4 h-4" />
                </span>
              </button>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-center uppercase">Actions</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
    ],
    []
  );

  return (
    <DashboardLayouts
      userDefault="/images/logo.png"
      logo="/images/logo.png"
      token={token}
      refreshToken={refreshToken}
      header={"Log - Gate"}
      title={"Log Gate"}
      roles={roles}>
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
                isClearable
              />
            </div>

            <div className="w-full flex flex-col lg:flex-row items-center gap-2">
              <DropdownSelect
                customStyles={stylesSelect}
                value={status}
                onChange={setStatus}
                error=""
                className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                classNamePrefix=""
                formatOptionLabel=""
                instanceId="2"
                isDisabled={false}
                isMulti={false}
                placeholder="Status..."
                options={StatusOptions}
                icon="MdSearch"
                isClearable
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

      {/* picture cctv */}
      <Modal size="full" onClose={isClosePicture} isOpen={isPicture}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={isClosePicture}>
            <h3 className="text-lg font-semibold ">
              Gate In & Gate Out Captures
            </h3>
          </ModalHeader>
          <div className="w-full flex flex-row justify-between px-10 py-5 gap-10 mb-3">
            <div className="text-center w-1/2">
              <h3 className="text-lg font-semibold ">Gate In</h3>
              <img
                src={
                  isCaptured?.gateImageIn
                    ? `${url}gate/files/${isCaptured.gateImageIn}`
                    : "/images/image-default.png"
                }
                alt={`Image`}
                className="w-full object-cover rounded-xl"
              />
            </div>
            <div className="text-center w-1/2">
              <h3 className="text-lg font-semibold ">Gate Out</h3>

              <img
                src={
                  isCaptured?.gateImageOut
                    ? `${url}gate/files/${isCaptured.gateImageOut}`
                    : "/images/image-default.png"
                }
                alt={`Image`}
                className="w-full object-cover rounded-xl"
              />
            </div>
          </div>
        </Fragment>
      </Modal>
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
  const roles = cookies["roles"] || null;
  const refreshToken = cookies["refreshToken"] || null;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }

  if (!roles || roles == "security") {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: { token, refreshToken, roles },
  };
};
