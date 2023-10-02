import { Popover, Transition } from "@headlessui/react";
import { Fragment, useMemo } from "react";
import { MdArrowDropDown } from "react-icons/md";
import Icon from "../Icon";

type MenuOptions = {
  name?: string | any;
  description?: string | any;
  onClick: () => void;
  icon?: any;
};

type Props = {
  label?: string | any;
  icon?: any;
  classIcon?: string;
  menus: MenuOptions[] | any[];
  position?: string | "center" | "left" | "right";
  classMenu?: string;
  className?: string;
};

// left-1/2 -translate-x-1/2 = center
// -left-1/2 -translate-x-1/2 = left
// -right-1/2 translate-x-1/2 = right

export default function DropodownNotifications({
  label,
  icon,
  classIcon,
  menus,
  position = "center",
  className,
  classMenu,
}: Props) {
  const positions = useMemo(() => {
    let post = "center";
    switch (position) {
      case "center":
        post = "left-1/2 -translate-x-1/2";
        break;
      case "left":
        post = "right-0 translate-x-5";
        break;
      case "right":
        post = "left-0 -translate-x-5";
        break;
      default:
        return post;
    }
    return post;
  }, [position]);

  return (
    <div className="w-full max-w-max">
      <Popover className="relative">
        {({ open }) => (
          <Fragment>
            <Popover.Button
              className={`
                ${open ? "" : "text-opacity-90"}
                group inline-flex items-center rounded-md px-3 py-2 text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${className}`}>
              {label}
              {icon ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10">
                  <Icon
                    className={classIcon ? classIcon : "w-5 h-5"}
                    aria-hidden="true"
                    icon={icon}
                  />
                </div>
              ) : (
                <MdArrowDropDown
                  className={`${open ? "" : "text-opacity-70"}
                  ml-2 h-5 w-5  transition duration-150 ease-in-out group-hover:text-opacity-80`}
                  aria-hidden="true"
                />
              )}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1">
              <Popover.Panel
                className={`absolute mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default right-0 sm:w-80 text-graydark`}>
                <div className="px-4.5 py-3">
                  <h5 className="text-sm font-medium text-bodydark2">
                    Notification
                  </h5>
                </div>

                {/* menu */}
                <ul className="flex h-auto flex-col overflow-y-auto">
                  {menus?.length > 0 &&
                    menus?.map((item, index) => {
                      const lastIndx = menus?.length - 1;
                      return (
                        <li key={index}>
                          <button
                            onClick={item?.href}
                            className={`text-left flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 group ${classMenu}`}>
                            <div className="text-sm">
                              <p className="text-graydark group-hover:text-white">
                                {item.name}
                              </p>{" "}
                              {item.description}
                            </div>

                            <p className="text-xs">24 Feb, 2025</p>
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </Popover.Panel>
            </Transition>
          </Fragment>
        )}
      </Popover>
    </div>
  );
}
