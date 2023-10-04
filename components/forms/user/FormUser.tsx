import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { MdCheck, MdClose, MdOutlinePlace, MdWarning } from "react-icons/md";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { FaCircleNotch, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import { ModalHeader } from "@/components/modal/ModalComponent";
import Button from "@/components/button/Button";
import { toast } from "react-toastify";
import {
  createUser,
  selectUserManagement,
  updateUser,
} from "@/redux/features/user/userReducers";
import { OptionProps } from "@/utils/propTypes";
import DropdownSelect from "@/components/dropdown/DropdownSelect";

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
      padding: ".2rem",
      borderRadius: ".5rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 20,
      // flexDirection: "row-reverse"
    };
  },
  menuList: (provided: any) => provided,
};

type Props = {
  items?: any;
  token?: any;
  isClose: () => void;
  isUpdate?: boolean;
  filters?: any;
  refreshData: () => void;
};

type FormValues = {
  id?: any;
  username?: string | any;
  fullName?: string | any;
  role?: string | any;
  password?: string | any;
};

const roleOptions: OptionProps[] = [
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Superadmin" },
];

export default function FormUser(props: Props) {
  const { isClose, items, isUpdate, filters, token, refreshData } = props;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  const [isHidden, setIsHidden] = useState<boolean>(true);

  // checked
  // const [isChecked, setIsChecked] = useState(false);
  // let refChecked = useRef<HTMLInputElement>(null);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectUserManagement);

  // form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
    control,
  } = useForm({
    mode: "all",
    defaultValues: useMemo<FormValues>(
      () => ({
        id: items?.id,
        username: items?.username,
        fullName: items?.fullName,
        role: items?.role,
        password: items?.password,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        username: items?.username,
        fullName: items?.fullName,
        role: items?.role,
        password: items?.password,
      });
    }
  }, [items]);

  useEffect(() => {
    const subscription = watch((value, { name, type }): any => {
      if (value) {
        setWatchValue(value);
        setWatchChange({ name, type });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {
      username: value?.username,
      fullName: value?.fullName,
      role: value?.role ? value?.role?.value : null,
      password: value?.password,
    };

    if (!isUpdate) {
      dispatch(
        createUser({
          token,
          data: newData,
          isSuccess: () => {
            refreshData();
            toast.dark("Create User is successfull");
            isClose();
          },
        })
      );
    } else {
      dispatch(
        updateUser({
          token,
          data: newData,
          id: value?.id,
          isSuccess: () => {
            refreshData();
            toast.dark("Update User is successfull");
            isClose();
          },
        })
      );
    }
  };

  return (
    <Fragment>
      <ModalHeader
        onClick={isClose}
        isClose={true}
        className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
        <div className="w-full flex flex-col gap-1 px-2">
          <h3 className="text-lg font-semibold">
            {isUpdate ? "Update" : "New"} User
          </h3>
          <p className="text-gray-5 text-sm">Fill your user information.</p>
        </div>
      </ModalHeader>

      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="fullName">
              Role
            </label>
            <div className="relative">
              <Controller
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <DropdownSelect
                    customStyles={stylesSelect}
                    value={value}
                    onChange={onChange}
                    error=""
                    className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                    classNamePrefix=""
                    formatOptionLabel=""
                    instanceId="role"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="Role..."
                    options={roleOptions}
                    icon=""
                    isClearable
                  />
                )}
                name={`role`}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Role is required.",
                  },
                }}
              />
              {errors?.role && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors?.role?.message as any}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="fullName">
              Full Name
            </label>
            <div className="w-full flex">
              <input
                type="text"
                placeholder="Full Name"
                autoFocus
                id="fullName"
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("fullName", {
                  required: {
                    value: true,
                    message: "Full Name is required.",
                  },
                })}
              />
            </div>
            {errors?.fullName && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.fullName.message as any}
                </span>
              </div>
            )}
          </div>

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="username">
              Username
            </label>
            <div className="w-full flex">
              <input
                id="username"
                type="text"
                placeholder="Username"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("username", {
                  required: {
                    value: true,
                    message: "Username is required.",
                  },
                })}
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

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="password">
              Password
            </label>
            <div className="relative w-full flex">
              <input
                id="password"
                type={isHidden ? "password" : "text"}
                placeholder="Password"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required.",
                  },
                })}
              />
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
        </div>

        <div className="w-full flex gap-2 justify-end p-4 border-t-2 border-gray">
          <button
            type="button"
            className="rounded-md text-sm border py-2 px-4 border-gray shadow-card"
            onClick={isClose}>
            <span className="font-semibold">Discard</span>
          </button>

          <Button
            type="submit"
            variant="primary"
            className="rounded-md text-sm shadow-card border-primary"
            onClick={handleSubmit(onSubmit)}
            disabled={pending || !isValid}>
            <span className="font-semibold">
              {isUpdate ? "Update" : "Save"}
            </span>
            {pending ? (
              <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
            ) : (
              <MdCheck className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Fragment>
  );
}
