import Image from "next/image";
import { Inter } from "next/font/google";
import DashboardLayouts from "@/components/layouts/DashboardLayouts";
import { Fragment, useEffect, useMemo, useState } from "react";
import SelectTables from "@/components/tables/layouts";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { SearchInput } from "@/components/forms/SearchInput";
import DropdownSelect from "@/components/dropdown/DropdownSelect";
import ReactDatePicker from "react-datepicker";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdOutlineCalendarToday,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import { getAuthMe, selectAuth } from "@/redux/features/AuthenticationReducers";
import { deleteCookie, getCookies } from "cookies-next";
import { GetServerSideProps } from "next";
import Navbar from "@/components/layouts/header/Navbar";
import {
  deleteRfid,
  getRfids,
  selectRfidManagement,
} from "@/redux/features/rfid/rfidReducers";
import { useRouter } from "next/router";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { RfidProps } from "@/utils/propTypes";
import {
  getVehicleTypes,
  selectVehicleTypeManagement,
} from "@/redux/features/vehicleType/vehicleTypeReducers";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import FormRFID from "@/components/forms/rfid/FormRFID";
import { ModalHeader } from "@/components/modal/ModalComponent";
import { toast } from "react-toastify";
import { FaCircleNotch } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

interface PageProps {
  page: string;
  token: any;
  refreshToken: any;
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

const RfidTypeOptions: Options[] = [
  {
    value: "employee",
    label: "employee",
  },
  {
    value: "guest",
    label: "guest",
  },
];

export default function Rfid({ pageProps }: Props) {
  const router = useRouter();
  const { pathname, query } = router;
  const { token, refreshToken } = pageProps;

  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);

  // data rfid
  const { rfids, pending } = useAppSelector(selectRfidManagement);
  // data vehicle-type
  const { vehicleTypes } = useAppSelector(selectVehicleTypeManagement);

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
  const [vehicleType, setVehicleType] = useState<Options | any>(null);
  const [vehicleTypeOpt, setVehicleTypeOpt] = useState<Options[] | any[]>([]);

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

  // modal
  const [isForm, setIsForm] = useState<any>(null);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const isOpenCreate = () => {
    setIsCreate(true);
  };

  const isCloseCreate = () => {
    setIsForm(null);
    setIsCreate(false);
  };

  const isOpenUpdate = (value: any) => {
    setIsForm({
      ...value,
      rfidType: value?.rfidType
        ? {
            value: value?.rfidType,
            label: value?.rfidType,
          }
        : null,
      vehicleType: value?.vehicleType?.id
        ? {
            ...value?.vehicleType,
            value: value?.vehicleType?.vehicleTypeName,
            label: value?.vehicleType?.vehicleTypeName,
          }
        : null,
    });
    setIsUpdate(true);
  };

  const isCloseUpdate = () => {
    setIsForm(null);
    setIsUpdate(false);
  };

  const isOpenDelete = (value: any) => {
    setIsForm(value);
    setIsDelete(true);
  };

  const isCloseDelete = () => {
    setIsForm(null);
    setIsDelete(false);
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
    if (query?.types) {
      setTypes({ value: query?.types, label: query?.types });
    }
    if (query?.vehicleType) {
      setVehicleType({ value: query?.vehicleType, label: query?.vehicleType });
    }
  }, [
    query?.page,
    query?.limit,
    query?.search,
    query?.sort,
    query?.types,
    query?.vehicleType,
  ]);

  useEffect(() => {
    let qr: any = {
      page: pages,
      limit: limit,
    };

    if (search) qr = { ...qr, search: search };
    if (sort) qr = { ...qr, sort: sort?.value };
    if (types) qr = { ...qr, types: types?.value };
    if (vehicleType) qr = { ...qr, vehicleType: vehicleType?.value };

    router.replace({ pathname, query: qr });
  }, [pages, limit, search, sort, types, vehicleType]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [
        { "vehicleType.vehicleTypeName": { $contL: query?.vehicleType } },
        { rfidType: { $contL: query?.types } },
        {
          $or: [
            { rfidNumber: { $contL: query?.search } },
            { rfidType: { $contL: query?.search } },
            { rfidType: { $contL: query?.search } },
            { employeeName: { $contL: query?.search } },
            { licencePlate: { $contL: query?.search } },
            { "vehicleType.vehicleTypeName": { $contL: query?.search } },
          ],
        },
      ],
    };

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    qb.search(search);
    if (!query?.sort) {
      qb.sortBy({
        field: `updatedAt`,
        order: "DESC",
      });
    } else {
      qb.sortBy({
        field: `rfidNumber`,
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
    query?.types,
    query?.vehicleType,
  ]);

  useEffect(() => {
    if (token) {
      dispatch(getRfids({ token, params: filters?.queryObject }));
    }
  }, [token, filters]);

  console.log("data-table :", rfids?.data);

  useEffect(() => {
    const newArr: RfidProps[] | any[] = [];
    let newPageCount: number | any = 0;
    let newTotal: number | any = 0;
    const { data, pageCount, total } = rfids;
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
  }, [rfids]);

  // vehicle-type
  const filterType = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    qb.sortBy({
      field: "vehicleTypeName",
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(getVehicleTypes({ token, params: filterType?.queryObject }));
    }
  }, [token, filterType]);

  useEffect(() => {
    const newArr: Options[] | any[] = [];
    const { data, pageCount, total } = vehicleTypes;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push({
          ...item,
          label: item?.vehicleTypeName,
          value: item?.vehicleTypeName,
        });
      });
    }
    setVehicleTypeOpt(newArr);
  }, [vehicleTypes]);

  const columns = useMemo<ColumnDef<RfidProps, any>[]>(
    () => [
      {
        accessorKey: "rfidNumber",
        header: (info) => <div className="uppercase">RFID</div>,
        cell: ({ getValue, row }) => {
          return <div>{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "rfidType",
        cell: ({ row, getValue }) => {
          return <div>{getValue() || "-"}</div>;
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Type</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "employeeName",
        cell: ({ row, getValue }) => {
          return <div>{getValue() || "-"}</div>;
        },
        header: (props) => (
          <div className="w-full text-left uppercase">User</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "vehicleType.vehicleTypeName",
        cell: ({ row, getValue }) => {
          return <div>{getValue() || "-"}</div>;
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Vehicle Type</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      // {
      //   accessorKey: "arrival",
      //   cell: ({ row, getValue }) => {
      //     return <div>{!getValue() ? "" : dateFormat(getValue())}</div>;
      //   },
      //   header: (props) => (
      //     <div className="w-full text-left uppercase">Arrival Date</div>
      //   ),
      //   footer: (props) => props.column.id,
      //   enableColumnFilter: false,
      // },
      // {
      //   accessorKey: "departure",
      //   cell: ({ row, getValue }) => {
      //     return <div>{!getValue() ? "" : dateFormat(getValue())}</div>;
      //   },
      //   header: (props) => (
      //     <div className="w-full text-left uppercase">Departure Date</div>
      //   ),
      //   footer: (props) => props.column.id,
      //   enableColumnFilter: false,
      // },
      {
        accessorKey: "licencePlate",
        cell: ({ row, getValue }) => {
          return <div>{getValue() || "-"}</div>;
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Vehicle No.</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "id",
        cell: ({ row, getValue }) => {
          return (
            <div className="w-full flex items-center justify-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1 p-2 rounded-md border border-gray-5 hover:bg-gray active:scale-90"
                onClick={() => isOpenUpdate(row?.original)}>
                <span>
                  <MdEdit className="w-4 h-4" />
                </span>
              </button>

              <button
                type="button"
                className="flex items-center gap-1 p-2 rounded-md border text-white border-danger bg-danger hover:opacity-70 active:scale-90"
                onClick={() => isOpenDelete(row?.original)}>
                <span>
                  <MdDelete className="w-4 h-4" />
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
      },
    ],
    []
  );

  // delete
  const onDeleteRFID = (value: any) => {
    console.log(value, "delete");
    if (value?.id) {
      dispatch(
        deleteRfid({
          token,
          id: value?.id,
          isSuccess: () => {
            dispatch(getRfids({ token, params: filters.queryObject }));
            toast.dark("Delete RFID is successfull");
            isCloseDelete();
          },
        })
      );
    }
  };

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
          <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-2.5 p-4">
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

            {/* <div className="w-full flex flex-col lg:flex-row items-center gap-2">
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
            </div> */}
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
                options={RfidTypeOptions}
                icon=""
                isClearable
              />
            </div>

            <div className="w-full flex flex-col lg:flex-row items-center gap-2">
              <DropdownSelect
                customStyles={stylesSelect}
                value={vehicleType}
                onChange={setVehicleType}
                error=""
                className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                classNamePrefix=""
                formatOptionLabel=""
                instanceId="1"
                isDisabled={false}
                isMulti={false}
                placeholder="Vehicles..."
                options={vehicleTypeOpt}
                icon=""
                isClearable
              />
            </div>

            <Button
              type="button"
              variant="primary"
              className="rounded-lg hover:opacity-70 active:scale-90"
              onClick={isOpenCreate}>
              <span className="tex-sm">New RFID</span>
              <MdAdd className="w-4 h-4" />
            </Button>
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

      {/* create rfid */}
      <Modal isOpen={isCreate} onClose={isCloseCreate} size="small">
        <FormRFID
          token={token}
          items={isForm}
          isClose={isCloseCreate}
          vehicleOption={vehicleTypeOpt}
          refreshData={() =>
            dispatch(getRfids({ token, params: filters.queryObject }))
          }
        />
      </Modal>

      {/* create vehicle type */}
      <Modal isOpen={isUpdate} onClose={isCloseUpdate} size="small">
        <FormRFID
          token={token}
          items={isForm}
          isClose={isCloseUpdate}
          vehicleOption={vehicleTypeOpt}
          refreshData={() =>
            dispatch(getRfids({ token, params: filters.queryObject }))
          }
          isUpdate
        />
      </Modal>

      {/* delete vehicle */}
      <Modal size="small" onClose={isCloseDelete} isOpen={isDelete}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={isCloseDelete}>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">Delete RFID No.</h3>
              <p className="text-gray-5">
                Are you sure to delete{" "}
                <span className="text-semibold">{` RFID No. ${
                  isForm?.rfidNumber || ""
                } ?`}</span>
              </p>
            </div>
          </ModalHeader>
          <div className="w-full flex items-center px-4 justify-end gap-2 mb-3">
            <Button
              type="button"
              variant="secondary-outline"
              className="rounded-lg border-2 border-gray-2 shadow-2 active:scale-90"
              onClick={isCloseDelete}>
              <span className="text-xs font-semibold">Discard</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              className="rounded-lg border-2 border-primary active:scale-90"
              onClick={() => onDeleteRFID(isForm)}
              disabled={pending}>
              {pending ? (
                <Fragment>
                  <span className="text-xs">Deleting...</span>
                  <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                </Fragment>
              ) : (
                <span className="text-xs">Yes, Delete it!</span>
              )}
            </Button>
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
