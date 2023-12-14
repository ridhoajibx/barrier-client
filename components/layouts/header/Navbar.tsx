// import LogoIcon from '../images/logo/logo-icon.svg'
// import DropdownNotification from '../../Dropdown/DropdownNotification'
// import DropdownUser from '../../Dropdown/DropdownUser'
// import DarkModeSwitcher from '../../DarkMode/DarkModeSwitcher'
// import { MdMuseum } from 'react-icons/md'
// import Icon from '../../Icon'
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import ActiveLink from "../link/ActiveLink";
import { Dialog, Transition } from "@headlessui/react";

type HeaderProps = {
  header?: string;
  userDefault?: string;
  title?: any;
  token?: any;
  icons?: any;
};

const Navbar = ({ header, userDefault, title, token }: HeaderProps) => {
  const [navbarOpen, setNavbarOpen] = useState(true);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setNavbarOpen(false);
    } else {
      setNavbarOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  const trigger = useRef<HTMLButtonElement>(null);
  const navbar = useRef<HTMLDivElement>(null);

  // const storedSidebarExpanded = localStorage?.getItem('sidebar-expanded')
  // const [storeParse, setStoreParse] = useState(null);

  // useEffect(() => {
  //     if (typeof storedSidebarExpanded === 'string') {
  //         setStoreParse(JSON.parse(storedSidebarExpanded))
  //     }
  // }, [storedSidebarExpanded])

  const getFromLocalStorage = (key: string) => {
    if (!key || typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem(key);
  };

  const initiaLocalStorage: any = {
    navbar: getFromLocalStorage("navbar-expanded")
      ? JSON.parse(getFromLocalStorage("navbar-expanded") || "{}")
      : [],
  };

  const [navbarExpanded, setNavbarExpanded] = useState(
    initiaLocalStorage === null ? false : initiaLocalStorage === "true"
  );

  useEffect(() => {
    setNavbarExpanded(
      initiaLocalStorage === null ? false : initiaLocalStorage === "true"
    );
  }, [initiaLocalStorage]);

  // console.log(initiaLocalStorage, 'side')

  // close on click outside
  useEffect(() => {
    type Props = {
      target: any;
    };
    const clickHandler = ({ target }: Props) => {
      if (!navbar.current || !trigger.current) return;
      if (
        !navbarOpen ||
        navbar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setNavbarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, []);

  // close if the esc key is pressed
  useEffect(() => {
    type Props = {
      keyCode: any;
    };
    const keyHandler = ({ keyCode }: Props) => {
      if (!navbarOpen || keyCode !== 27) return;
      setNavbarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, []);

  useEffect(() => {
    const body = document.querySelector("body");
    const parentNode = body?.parentNode;

    if (!(parentNode instanceof Element)) {
      throw new Error("box.parentNode is not an Element");
    }

    localStorage.setItem("navbar-expanded", navbarExpanded?.toString());
    if (navbarExpanded) {
      body?.classList.add("navbar-expanded");
    } else {
      body?.classList.remove("navbar-expanded");
    }
  }, [navbarExpanded]);

  return (
    <nav className="bg-primary z-99 sticky top-0">
      <div className="mx-4 max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
              aria-controls="navbar"
              aria-expanded={navbarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setNavbarOpen(!navbarOpen);
              }}
              className="z-99999 block rounded-sm border p-1.5 shadow-sm border-gray bg-gray">
              <span className="relative block h-5.5 w-5.5 cursor-pointer">
                <span className="du-block absolute right-0 h-full w-full">
                  <span
                    className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm delay-[0] duration-200 ease-in-out bg-primary ${
                      !navbarOpen && "!w-full delay-300"
                    }`}></span>
                  <span
                    className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm delay-150 duration-200 ease-in-out bg-primary ${
                      !navbarOpen && "delay-400 !w-full"
                    }`}></span>
                  <span
                    className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm delay-200 duration-200 ease-in-out bg-primary ${
                      !navbarOpen && "!w-full delay-500"
                    }`}></span>
                </span>
                <span className="absolute right-0 h-full w-full rotate-45">
                  <span
                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm delay-300 duration-200 ease-in-out bg-primary ${
                      !navbarOpen && "!h-0 !delay-[0]"
                    }`}></span>
                  <span
                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm duration-200 ease-in-out bg-primary ${
                      !navbarOpen && "!h-0 !delay-200"
                    }`}></span>
                </span>
              </span>
            </button>
          </div>

          <div className="w-full flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:block">
              <div className="w-full flex space-x-4">
                <ActiveLink
                  pages={"dashboard"}
                  href={{ pathname: "/" }}
                  activeClassName=""
                  className="w-full max-w-max lg:justify-center text-sm lg:text-base text-gray hover:text-white">
                  Dashboard
                </ActiveLink>

                <ActiveLink
                  pages={"log-data"}
                  href={{ pathname: "/log-data" }}
                  activeClassName=""
                  className="w-full lg:justify-center text-sm lg:text-base text-gray hover:text-white">
                  Log Data
                </ActiveLink>

                <ActiveLink
                  pages={"log-gate"}
                  href={{ pathname: "/log-gate" }}
                  activeClassName=""
                  className="w-full lg:justify-center text-sm lg:text-base text-gray hover:text-white">
                  Log Gate
                </ActiveLink>

                <ActiveLink
                  pages={"vehicle-type"}
                  href={{ pathname: "/vehicle-type" }}
                  activeClassName=""
                  className="w-full lg:justify-center text-sm lg:text-base text-gray hover:text-white">
                  Vehicle Type
                </ActiveLink>

                <ActiveLink
                  pages={"RFID"}
                  href={{ pathname: "/rfid" }}
                  activeClassName=""
                  className="w-full lg:justify-center text-am lg:text-base text-gray hover:text-white">
                  RFID
                </ActiveLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile */}
      <Transition
        show={navbarOpen}
        enter="transition ease-out duration-300 transform"
        enterFrom="opacity-0 -translate-y-full"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-full">
        <div className="sm:hidden" id="mobile-menu">
          <div className="w-full space-y-1 px-2 pb-3 pt-2">
            <ActiveLink
              pages={"dashboard"}
              href={{ pathname: "/" }}
              activeClassName=""
              className="w-full lg:justify-center text-base lg:text-lg text-gray hover:text-white">
              Dashboard
            </ActiveLink>

            <ActiveLink
              pages={"log-data"}
              href={{ pathname: "/log-data" }}
              activeClassName=""
              className="w-full lg:justify-center text-base lg:text-lg text-gray hover:text-white">
              Log Data
            </ActiveLink>

            <ActiveLink
              pages={"log-gate"}
              href={{ pathname: "/log-gate" }}
              activeClassName=""
              className="w-full lg:justify-center text-base lg:text-lg text-gray hover:text-white">
              Log Gate
            </ActiveLink>

            <ActiveLink
              pages={"vehicle-type"}
              href={{ pathname: "/vehicle-type" }}
              activeClassName=""
              className="w-full lg:justify-center text-base lg:text-lg text-gray hover:text-white">
              Vehicle Type
            </ActiveLink>

            <ActiveLink
              pages={"RFID"}
              href={{ pathname: "/rfid" }}
              activeClassName=""
              className="w-full lg:justify-center text-base lg:text-lg text-gray hover:text-white">
              RFID
            </ActiveLink>
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;
