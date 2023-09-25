import React, { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { MdArrowBack, MdLock, MdLockOutline, MdOutlineEmail, MdOutlineLockOpen, MdPerson, MdRemoveRedEye } from "react-icons/md";
import { GetServerSideProps, NextPage } from "next";
import AuthLayouts from "@/components/layouts/AuthLayouts";
import Image from "next/image";
import Button from "@/components/button/Button";
import { FaCircleNotch, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

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

const SignIn: NextPage<Props> = ({ pageProps }) => {
  const router = useRouter();
  const { pathname, query, asPath } = router;

  const [loading, setLoading] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(true);

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingPage(false)
    }, 300);
  },[])
  

  return (
    <AuthLayouts
      title="Login"
      logo="/images/logo.png"
      description="login">
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

          <div className={`w-full lg:max-w-md absolute z-9 bg-white h-full transform duration-300 ease-in-out ${!loadingPage ? "translate-x-0 right-0" : "translate-x-full right-0 invisible"}`}>
            <div className="w-full h-full flex flex-col justify-between">
              <div className="w-full px-6 lg:px-8 py-5 lg:py-10 flex flex-col gap-14">
                <div className="w-full flex flex-col gap-24 mt-8">
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
                    <h1>Please <span className="font-semibold">Login</span> to continue.</h1>
                  </div>
                </div>

                <form
                  className="relative overflow-y-auto overflow-x-hidden p-6 xl:px-10">
                  <div className="mb-3">
                    <label className="mb-2.5 block font-medium text-black">Username</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Fill your username"
                        className={`w-full rounded-lg border border-stroke bg-transparent py-3.5 pr-6 pl-10 outline-none focus:border-primary focus-visible:shadow-none text-sm`}
                        value={""}
                        readOnly
                        // onChange={onEmailChange}
                        autoFocus
                        autoComplete="true"
                      />

                      <MdPerson
                        className={`absolute left-4 top-4 h-5 w-5 text-gray-5`}
                      />
                    </div>
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
                        value={""}
                        readOnly
                        // onChange={onPasswordChange}
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
                  </div>

                  <div className="w-full flex flex-col gap-2 items-center">
                    <div className="w-full">
                      <Button
                        type="button"
                        variant="primary"
                        className="w-full cursor-pointer rounded-lg border py-3.5 text-white transition hover:bg-opacity-90 text-sm"
                        onClick={() => router.push({ pathname: "/" })}
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
                  <h3>PT. Triputra Agro Persada &copy; {new Date().getFullYear()}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayouts>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({
//   req,
//   res,
//   query,
// }) => {
//   const cookies = getCookies({ req, res });
//   const token = cookies["accessToken"] || null;
//   const firebaseToken = cookies["firebaseToken"] || null;

//   if (token) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { token, firebaseToken, page: query },
//   };
// };

export default SignIn;
