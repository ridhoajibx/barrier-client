// import LogoIcon from '../images/logo/logo-icon.svg'
// import DropdownNotification from '../../Dropdown/DropdownNotification'
// import DropdownUser from '../../Dropdown/DropdownUser'
// import DarkModeSwitcher from '../../DarkMode/DarkModeSwitcher'
// import { MdMuseum } from 'react-icons/md'
// import Icon from '../../Icon'
import Image from "next/image";
import Link from "next/link";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import Navbar from "./Navbar";
import DropodownPopover from "@/components/dropdown/DropdownPopover";
import {
  MdContactPhone,
  MdContacts,
  MdInfo,
  MdManageAccounts,
  MdNotifications,
  MdPeople,
  MdPerson,
  MdSettings,
} from "react-icons/md";
import {
  FaCircleNotch,
  FaRegQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import DropodownNotifications from "@/components/dropdown/DropdownNotifications";
import { useRouter } from "next/router";
import Modal from "@/components/modal/Modal";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import { selectAuth, webLogout } from "@/redux/features/AuthenticationReducers";

type HeaderProps = {
  header?: string;
  userDefault?: string;
  title?: any;
  token?: any;
  icons?: any;
};

const Header = ({ header, userDefault, title, token }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const { pending } = useAppSelector(selectAuth);
  const router = useRouter();
  const [isSignOut, setIsSignOut] = useState<boolean>(false);
  const dataNotifications = [
    {
      name: "Nitification 1",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      href: () => {
        console.log("click-3");
      },
      icon: MdInfo,
      classIcon: "",
    },
    {
      name: "Nitification 2",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      href: () => {
        console.log("click-2");
      },
      icon: MdInfo,
      classIcon: "",
    },
    {
      name: "Nitification 3",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      href: () => {
        console.log("click-3");
      },
      icon: MdInfo,
      classIcon: "",
    },
    {
      name: "Nitification 4",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      href: () => {
        console.log("click-4");
      },
      icon: MdInfo,
      classIcon: "",
    },
    {
      name: "Nitification 5",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      href: () => {
        console.log("click-5");
      },
      icon: MdInfo,
      classIcon: "",
    },
    {
      name: "Nitification 6",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      href: () => {
        console.log("click-6");
      },
      icon: MdInfo,
      classIcon: "",
    },
    {
      name: "Nitification 7",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      href: () => {
        console.log("click-7");
      },
      icon: MdInfo,
      classIcon: "",
    },
  ];
  const [loading, setLoading] = useState<boolean>(false);

  const isOpenSignOut = () => {
    setIsSignOut(true);
  };

  const isCloseSignOut = () => {
    setIsSignOut(false);
  };

  const logout = () => {
    dispatch(
      webLogout({
        data: {
          token,
        },
        callback: () => {
          router.push({ pathname: "/" });
        },
      })
    );
  };

  const menuHeader = [
    {
      name: "Account Setting",
      description: "",
      href: () => {
        console.log("click-3");
      },
      icon: MdManageAccounts,
      classIcon: "",
    },
    {
      name: "Sign Out",
      description: "",
      href: () => {
        isOpenSignOut();
      },
      icon: FaSignOutAlt,
      classIcon: "",
    },
  ];

  return (
    <Fragment>
      <header className="static z-999 flex w-full bg-white drop-shadow-none">
        <div className="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/">
              <div className="flex flex-shrink-0 items-center gap-2 text-white">
                <Image
                  className="object-cover object-center"
                  src="/images/logo.png"
                  alt="Barrier Logo"
                  width={150}
                  height={150}
                  sizes="(max-width: 768px) 150px, (max-width: 1200px) 250px, 100px"
                  priority
                />
                <span className="hidden flex-shrink-0 lg:flex text-2xl font-semibold">
                  {!header ? "Barrier Gate" : header}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 2xsm:gap-7">
            <ul className="flex items-center gap-2 2xsm:gap-4">
              {/* <!-- Dark Mode Toggler --> */}

              {/* <!-- Notification Menu Area --> */}
              {/* <DropdownUser userDefault={userDefault} token={token} /> */}
              <div className="flex items-center gap-2">
                <span className="h-12 w-12 rounded-full flex items-center border">
                  <Image
                    src="/images/logo.png"
                    alt="avatar"
                    width={80}
                    height={80}
                    className="object-cover object-center rounded-full"
                  />
                </span>

                <div className="hidden text-left lg:block text-gray-6">
                  <span className="block text-sm font-medium">John Doe</span>
                  <span className="block text-xs">UX Designer</span>
                </div>
              </div>
              {/* <!-- Notification Menu Area --> */}

              <div className="relative h-10 mx-3">
                <div className="border-l-2 border-gray-4 absolute inset-y-0"></div>
              </div>

              {/* poopover */}
              <DropodownPopover
                menus={menuHeader}
                label=""
                icon={MdSettings}
                classIcon="w-6 h-6"
                classMenu="hover:bg-primary hover:text-white"
                position="left"
              />
              {/* <!-- Chat Notification Area --> */}
              <DropodownNotifications
                menus={dataNotifications}
                label=""
                icon={MdNotifications}
                classIcon="w-6 h-6"
                classMenu="text-bodydark2 hover:bg-primary hover:text-white"
                position="left"
              />
              {/* <DropdownNotification /> */}
            </ul>

            {/* <!-- User Area --> */}
            {/* <!-- User Area --> */}
          </div>
        </div>
      </header>

      <Navbar />

      {/* signout */}
      <Modal isOpen={isSignOut} onClose={isCloseSignOut} size="small">
        <div className="w-full px-6 flex flex-col items-center justify-center min-h-full h-[350px] max-h-[650px] gap-4 text-graydark tracking-wider">
          <h3 className="text-title-xl2 font-bold">Sign Out</h3>
          <FaRegQuestionCircle className="w-20 h-20 text-primary" />
          <p>Are you sure to Sign Out ?</p>
          <div className="w-full flex items-center gap-2 justify-center">
            <button
              className="inline-flex bg-primary hover:opacity-90 rounded-lg px-3 py-2 text-sm text-white"
              type="button"
              onClick={logout}
              disabled={loading || pending}>
              {loading || pending ? (
                <Fragment>
                  Signing out ....
                  <FaCircleNotch className="w-5 h-5 animate-spin-2" />
                </Fragment>
              ) : (
                "Yes, Sign out!"
              )}
            </button>
            <button
              className="px-3 py-2 bg-danger rounded-lg hover:opacity-90 text-sm text-white"
              type="button"
              onClick={isCloseSignOut}>
              No
            </button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default Header;
