import React, { useEffect, useState, Fragment, useMemo } from "react";
import { useRouter } from "next/router";
import {
  MdArrowBack,
  MdLock,
  MdLockOutline,
  MdOutlineEmail,
  MdOutlineLockOpen,
  MdPerson,
  MdRemoveRedEye,
  MdWarning,
} from "react-icons/md";
import { GetServerSideProps, NextPage } from "next";
import AuthLayouts from "@/components/layouts/AuthLayouts";
import Image from "next/image";
import Button from "@/components/button/Button";
import { FaCircleNotch, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import { selectAuth, webLogin } from "@/redux/features/AuthenticationReducers";
import { getCookies } from "cookies-next";

interface PageProps {
  page?: string;
  token: any;
  firebaseToken: any;
  id: number;
  title: string;
  content: string;
}

type Props = {
  pageProps: PageProps;
};

type FormValue = {
  username: string;
  password: string;
};

const SignIn: NextPage<Props> = ({ pageProps }) => {
  const router = useRouter();
  const { pathname, query, asPath } = router;
  console.log(pageProps, "props");

  const [loading, setLoading] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(true);

  const [loadingPage, setLoadingPage] = useState(true);

  const dispatch = useAppDispatch();
  const { data, pending } = useAppSelector(selectAuth);

  // use-form
  const {
    unregister,
    register,
    getValues,
    setValue,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isValid },
    control,
  } = useForm<FormValue>({
    mode: "all",
    defaultValues: useMemo(
      () => ({
        username: "",
        password: "",
      }),
      []
    ),
  });

  const onSubmit: SubmitHandler<FormValue> = (value) => {
    const newObj = {
      username: value.username,
      password: value.password,
    };
    dispatch(
      webLogin({
        data: newObj,
        callback: () => {
          router.push({ pathname: "/" });
        },
      })
    );
    console.log(data, "form-data");
  };

  useEffect(() => {
    setTimeout(() => {
      setLoadingPage(false);
    }, 300);
  }, []);

  return (
    <AuthLayouts title="Login" logo="/images/logo.png" description="login">
      <div className="bg-gray w-full p-0">
        <div className="relative overflow-hidden w-full h-screen lg:h-full flex items-center bg-white shadow-default">
          <div className="w-full">
            <Image
              className="w-full absolute object-cover object-center"
              src="/images/barrier-gate.png"
              alt="Barrier Logo"
              fill={true}
              sizes="100vh"
              priority
            />
          </div>

          <div
            className={`w-full lg:max-w-md absolute z-9 bg-white h-full transform duration-300 ease-in-out ${
              !loadingPage
                ? "translate-x-0 right-0"
                : "translate-x-full right-0 invisible"
            }`}>
            <div className="w-full h-full flex flex-col justify-between">
              <div className="w-full px-6 lg:px-8 py-5 lg:py-10 flex flex-col gap-14">
                <div className="w-full flex flex-col gap-10 mt-8">
                  <Image
                    className="mx-auto object-cover object-center"
                    src="/images/logo.png"
                    alt="Barrier Logo"
                    width={150}
                    height={150}
                    sizes="(max-width: 768px) 150px, (max-width: 1200px) 250px, 100px"
                    priority
                  />

                  <div className="w-full text-center tracking-wider text-lg">
                    <h1>
                      Please <span className="font-semibold">Login</span> to
                      continue.
                    </h1>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="relative overflow-y-auto overflow-x-hidden p-6 xl:px-10">
                  <div className="mb-3">
                    <label className="mb-2.5 block font-medium text-black">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Fill your username"
                        className={`w-full rounded-lg border border-stroke bg-transparent py-3.5 pr-6 pl-10 outline-none focus:border-primary focus-visible:shadow-none text-sm`}
                        autoFocus
                        autoComplete="true"
                        {...register("username", {
                          required: {
                            value: true,
                            message: "Username is required.",
                          },
                        })}
                      />

                      <MdPerson
                        className={`absolute left-4 top-4 h-5 w-5 text-gray-5`}
                      />
                    </div>

                    {errors?.username && (
                      <div className="mt-1 text-xs flex items-center text-red-300">
                        <MdWarning className="w-4 h-4 mr-1" />
                        <span className="text-red-300">
                          {errors.username.message as any}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-12">
                    <label className="mb-2.5 block font-medium text-black">
                      Password
                    </label>
                    <div className={`relative`}>
                      <input
                        type={isHidden ? "password" : "text"}
                        placeholder="Insert your password"
                        className={`w-full rounded-lg border border-stroke bg-transparent py-3.5 pl-10 pr-10 outline-none focus:border-primary focus-visible:shadow-none text-sm`}
                        {...register("password", {
                          required: {
                            value: true,
                            message: "Password is required.",
                          },
                        })}
                      />
                      <MdLock className="absolute left-4 top-4 h-5 w-5 text-gray-5" />
                      <button
                        type="button"
                        className="absolute z-40 right-4 top-4 text-gray-5 focus:outline-none"
                        onClick={() => setIsHidden((prev) => !prev)}>
                        {isHidden ? (
                          <FaEyeSlash className="w-5 h-5" />
                        ) : (
                          <FaEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {errors?.password && (
                      <div className="mt-1 text-xs flex items-center text-red-300">
                        <MdWarning className="w-4 h-4 mr-1" />
                        <span className="text-red-300">
                          {errors.password.message as any}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="w-full flex flex-col gap-2 items-center">
                    <div className="w-full">
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full cursor-pointer rounded-lg border py-3.5 text-white transition hover:bg-opacity-90 text-sm"
                        onClick={handleSubmit(onSubmit)}
                        disabled={false}>
                        {loading ? (
                          <Fragment>
                            Loading...
                            <FaCircleNotch className="w-5 h-5 animate-spin-2" />
                          </Fragment>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="w-full bg-primary px-8 py-10 text-center text-white text-sm">
                <h3>
                  PT. Triputra Agro Persada &copy; {new Date().getFullYear()}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayouts>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const cookies = getCookies({ req, res });
  const token = cookies["accessToken"] || null;

  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { token },
  };
};

export default SignIn;
