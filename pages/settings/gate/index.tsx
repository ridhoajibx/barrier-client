/* eslint-disable @next/next/no-img-element */
import { Inter } from "next/font/google";
import DashboardLayouts from "@/components/layouts/DashboardLayouts";
import { Fragment, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { MdArrowBack, MdLockOpen, MdRefresh, MdWarning } from "react-icons/md";
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
import { FaCircleNotch, FaEye, FaEyeSlash } from "react-icons/fa";

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
  oldPassword?: string | any;
  newPassword?: string | any;
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
  // hidden
  const [isHiddenOld, setIsHiddenOld] = useState<boolean>(true);
  const [isHiddenNew, setIsHiddenNew] = useState<boolean>(true);

  const [currentValue, setCurrentValue] = useState<string | any>("");

  const {
    handleSubmit,
    register,
    watch,
    reset,
    clearErrors,
    setValue,
    formState: { errors, isValid },
    control,
  } = useForm({
    mode: "all",
    defaultValues: useMemo<FormValues>(
      () => ({
        oldPassword: null,
        newPassword: null,
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

  const getGatePassword = async (params: any) => {
    let oldPassword: any = null;
    let config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    try {
      const response = await axios.get("gate/password", config);
      const { data, status } = response;
      if (status == 200) {
        console.log(data, "result-gate-password");
        oldPassword = data;
        clearErrors("oldPassword");
      } else {
        throw response;
      }
    } catch (error: any) {
      const { data, status } = error?.response;
      let newError: any = { message: data?.message[0] };
      oldPassword = null;
      if (error.response.status !== 401) {
        toast.dark(newError?.message);
      }
      // if (error?.response && error?.response?.status === 404) {
      //   throw new Error("Idle status not found");
      // } else {
      //   throw new Error(newError.message);
      // }
    }
    setValue("oldPassword", oldPassword);
  };

  useEffect(() => {
    if (token) {
      getGatePassword({ token });
    }
  }, [token]);

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form-value");

    let newObj = value;

    let config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    setLoading(true);
    try {
      const response = await axios.patch(`gate/password`, newObj, config);
      const { data, status } = response;
      if (status == 200) {
        toast.dark("Gate password has been updated!");
        reset({ newPassword: null });
      } else {
        throw response;
      }
    } catch (error: any) {
      const { data, status } = error.response;
      let newError: any = { message: data?.message[0] };
      if (error.response.status !== 401) {
        toast.dark(newError?.message);
      }
      // if (error?.response && error?.response?.status === 404) {
      //   throw new Error("log not found");
      // } else {
      //   throw new Error(newError?.message);
      // }
    } finally {
      getGatePassword({ token });
      setLoading(false);
    }
    // console.log(newObj, "form-result");
  };

  useEffect(() => {
    if (!token) {
      return;
    }
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
  }, [token, refreshToken]);

  return (
    <DashboardLayouts
      userDefault="/images/logo.png"
      logo="/images/logo.png"
      token={token}
      refreshToken={refreshToken}
      header={"Gate Password - Setting"}
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
              pages={"gate-password"}
              href={{ pathname: "/settings/gate" }}
              activeClassName="text-primary border-b-2 border-primary"
              className="w-full lg:justify-center text-sm lg:text-base text-gray-6 hover:text-primary">
              Gate Password
            </ActiveLink>
          </div>

          <div className="w-full lg:w-2/3 flex flex-col lg:flex-row">
            <form className="w-full">
              <div className="w-full flex gap-4">
                <div className="w-full flex flex-col lg:w-1/2 p-4 font-bold gap-4">
                  {/* <div className="text-lg font-semibold">
                    Change Gate Password
                  </div> */}

                  <div className="w-full flex flex-col gap-2 mb-3">
                    <label htmlFor="old-password">Old Password</label>
                    <div className="w-full flex gap-1">
                      <div className="w-full">
                        <div className="relative w-full flex">
                          <input
                            id="old-password"
                            type={isHiddenOld ? "password" : "text"}
                            placeholder="Old Password"
                            autoFocus
                            className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                            {...register("oldPassword", {
                              required: {
                                value: true,
                                message: "Old Password is required.",
                              },
                            })}
                          />
                          <button
                            type="button"
                            className="absolute z-40 right-4 top-3.5 text-gray-5 focus:outline-none"
                            onClick={() => setIsHiddenOld((prev) => !prev)}>
                            {isHiddenOld ? (
                              <FaEyeSlash className="w-5 h-5" />
                            ) : (
                              <FaEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {errors?.oldPassword && (
                          <div className="mt-1 text-xs flex items-center text-red-300">
                            <MdWarning className="w-4 h-4 mr-1" />
                            <span className="text-red-300">
                              {errors.oldPassword.message as any}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <button
                          className="p-3 border border-1 border-stroke shadow-1 rounded-lg active:scale-90 duration-300"
                          type="button"
                          onClick={() => getGatePassword({ token })}>
                          <MdRefresh className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-2 mb-3">
                    <label htmlFor="new-password">New Password</label>
                    <div className="w-full flex gap-1">
                      <div className="w-full">
                        <div className="relative w-full flex">
                          <input
                            id="old-password"
                            type={isHiddenNew ? "password" : "text"}
                            placeholder="New Password"
                            autoFocus
                            className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                            {...register("newPassword", {
                              required: {
                                value: true,
                                message: "New Password is required.",
                              },
                            })}
                          />
                          <button
                            type="button"
                            className="absolute z-40 right-4 top-3.5 text-gray-5 focus:outline-none"
                            onClick={() => setIsHiddenNew((prev) => !prev)}>
                            {isHiddenNew ? (
                              <FaEyeSlash className="w-5 h-5" />
                            ) : (
                              <FaEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {errors?.newPassword && (
                          <div className="mt-1 text-xs flex items-center text-red-300">
                            <MdWarning className="w-4 h-4 mr-1" />
                            <span className="text-red-300">
                              {errors.newPassword.message as any}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant={"primary"}
                    className="active:scale-90 duration-300 rounded-lg"
                    type="button"
                    disabled={loading || !isValid}
                    onClick={handleSubmit(onSubmit)}>
                    {loading ? (
                      <div className="flex gap-1 items-center">
                        <span>Loading...</span>
                        <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                      </div>
                    ) : (
                      <span>Change Password</span>
                    )}
                  </Button>
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
