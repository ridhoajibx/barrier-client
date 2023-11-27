/* eslint-disable @next/next/no-img-element */
import { Inter } from "next/font/google";
import DashboardLayouts from "@/components/layouts/DashboardLayouts";
import { Fragment, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { MdArrowBack, MdLockOpen } from "react-icons/md";
import { GetServerSideProps } from "next";
import { deleteCookie, getCookies } from "cookies-next";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import {
  getAuthMe,
  selectAuth,
  webRefresh,
} from "@/redux/features/AuthenticationReducers";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import ActiveLink from "@/components/layouts/link/ActiveLink";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import Button from "@/components/button/Button";
import { FaCircleNotch } from "react-icons/fa";

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

interface FormValues {
  employee?: string | any;
  guest?: string | any;
}

export default function ManualSetting({ pageProps }: Props) {
  const router = useRouter();
  const { query, pathname } = router;
  const { token, refreshToken, roles } = pageProps;

  const dispatch = useAppDispatch();
  const { data, error } = useAppSelector(selectAuth);

  // duration
  const [employeeDuration, setEmployeeDuration] = useState<any>(null);
  const [guestDuration, setGuestDuration] = useState<any>(null);

  // loading
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
    control,
  } = useForm({
    mode: "all",
    defaultValues: useMemo<FormValues>(
      () => ({
        employee: null,
        guest: null,
      }),
      []
    ),
  });

  useEffect(() => {
    if (!token) {
      return;
    }
    dispatch(
      getAuthMe({
        token,
        callback: () => {
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
          });
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

  // get-duration
  const getIdleDuration = async (params: any) => {
    let employee: any = null;
    let guest: any = null;
    let config = {
      params: params.params,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    try {
      const response = await axios.get("rfid/log/idle", config);
      const { data, status } = response;
      if (status == 200) {
        console.log(data, "result-idle");
        employee = data?.employee;
        guest = data?.guest;
      } else {
        throw response;
      }
    } catch (error: any) {
      const { data, status } = error.response;
      let newError: any = { message: data.message[0] };
      employee = null;
      guest = null;
      toast.dark(newError.message);
      if (error.response && error.response.status === 404) {
        throw new Error("Idle status not found");
      } else {
        throw new Error(newError.message);
      }
    }
    setEmployeeDuration(employee);
    setGuestDuration(guest);
  };

  // useEffect(() => {
  //   if (token) {
  //     getIdleDuration({ token, params: "" });
  //   }
  // }, [token]);

  // end-duration

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    let newObj = {
      employee: value?.employee
        ? parseInt(moment(new Date(value?.employee)).format("HH:mm"))
        : "",
      guest: value?.guest
        ? parseFloat(moment(new Date(value?.guest)).format("HH:mm"))
        : "",
    };

    let config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    setLoading(true);
    try {
      const response = await axios.patch(`rfid/log/idle`, newObj, config);
      const { data, status } = response;
      if (status == 200) {
        setLoading(false);
        toast.dark("Duration has been updated");
      } else {
        throw response;
      }
    } catch (error: any) {
      setLoading(false);
      const { data, status } = error.response;
      let newError: any = { message: data.message[0] };
      toast.dark(newError.message);
      if (error.response && error.response.status === 404) {
        throw new Error("Idle status not found");
      } else {
        throw new Error(newError.message);
      }
    } finally {
      getIdleDuration({ token, params: "" });
    }
    // console.log(newObj, "form-result");
  };

  return (
    <DashboardLayouts
      userDefault="/images/logo.png"
      logo="/images/logo.png"
      token={token}
      refreshToken={refreshToken}
      header={"User - Setting"}
      title={"Settings"}
      roles={roles}>
      <div className="w-full bg-white h-full overflow-auto relative">
        <nav className="bg-[#DFE8ED] z-99 sticky top-0 border-t-2 border-b-2 border-primary">
          <div className="mx-4 max-w-7xl px-2 sm:px-6 lg:px-8 py-4">
            <button
              type="button"
              className="inline-flex items-center gap-1 focus:outline-none px-2 text-primary"
              onClick={() => router.push({ pathname: "/" })}>
              <MdArrowBack className="w-4 h-4" />
              <span>Back to dashboard</span>
            </button>
          </div>
        </nav>

        <div className="w-full md:p-6 2xl:p-10">
          <h3 className="text-title-lg font-semibold">Settings</h3>
          {/* tabs */}
          <div className="w-full flex space-x-4 my-5">
            <ActiveLink
              pages={"user"}
              href={{ pathname: "/settings/user" }}
              activeClassName="text-primary border-b-2 border-primary"
              className="w-full flex lg:justify-center text-sm lg:text-base text-gray-6 hover:text-primary">
              <span>User List</span>
              <MdLockOpen className="w-4 h-4" />
            </ActiveLink>

            <ActiveLink
              pages={"duration"}
              href={{ pathname: "/settings/duration" }}
              activeClassName="text-primary border-b-2 border-primary"
              className="w-full lg:justify-center text-sm lg:text-base text-gray-6 hover:text-primary">
              Idle Status
            </ActiveLink>

            <ActiveLink
              pages={"manual"}
              href={{ pathname: "/settings/manual" }}
              activeClassName="text-primary border-b-2 border-primary"
              className="w-full lg:justify-center text-sm lg:text-base text-gray-6 hover:text-primary">
              Manual
            </ActiveLink>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col lg:flex-row">
            <form className="w-full">
              <div className="w-full flex gap-4">
                <div className="w-full flex flex-col lg:w-1/2 p-4 font-bold gap-4 bg-[#FFC5C2] rounded-md">
                  <label htmlFor="employee">Manual Gate - OPEN</label>
                  <div className="flex items-center">
                    <img
                      src="/images/gate-open.png"
                      alt={`Image`}
                      className="w-[221px] h-auto object-contain m-auto "
                    />
                  </div>
                  <div className="w-full">
                    <Button
                      type="submit"
                      onClick={() => console.log("open")}
                      variant="danger"
                      className="w-full flex items-center gap-2 rounded shadow-1 active:scale-90 disabled:opacity-50"
                      disabled={loading || !isValid}>
                      {loading ? (
                        <Fragment>
                          <span>Loading...</span>
                          <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                        </Fragment>
                      ) : (
                        <span>OPEN</span>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="w-full flex flex-col lg:w-1/2 p-4 font-bold gap-4 bg-[#E2EEFA] rounded-md">
                  <label htmlFor="employee">Manual Gate - CLOSE</label>
                  <div className=" flex items-center">
                    <img
                      src="/images/gate-close.png"
                      alt={`Image`}
                      className="w-[221px] h-auto object-contain m-auto "
                    />
                  </div>
                  <div className="w-full">
                    <Button
                      type="submit"
                      onClick={() => console.log("close")}
                      variant="primary"
                      className="w-full flex items-center gap-2 rounded shadow-1 active:scale-90 disabled:opacity-50"
                      disabled={loading || !isValid}>
                      {loading ? (
                        <Fragment>
                          <span>Loading...</span>
                          <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                        </Fragment>
                      ) : (
                        <span>CLOSE</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
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

  if (!roles || roles !== "superadmin") {
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
