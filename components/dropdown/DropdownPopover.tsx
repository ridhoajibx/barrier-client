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

export default function DropodownPopover({
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
                group inline-flex items-center rounded-md px-3 py-2 text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 shadow-default ${className}`}>
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
                className={`absolute z-10 mt-3 transform px-4 sm:px-0 w-screen max-w-xs ${positions}`}>
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid gap-8 bg-white p-7">
                    {menus?.length > 0 &&
                      menus?.map((item) => (
                        <button
                          key={item?.name}
                          onClick={item?.href}
                          className={`text-left -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${classMenu}`}>
                          {item?.icon && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10">
                              <Icon
                                className={
                                  item?.classIcon ? item?.classIcon : "w-5 h-5"
                                }
                                aria-hidden="true"
                                icon={item?.icon}
                              />
                            </div>
                          )}

                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Fragment>
        )}
      </Popover>
    </div>
  );
}
