import React, { Fragment, useEffect, useMemo, useState } from "react";
import { MdCheck, MdWarning } from "react-icons/md";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { FaCircleNotch } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import { ModalHeader } from "@/components/modal/ModalComponent";
import Button from "@/components/button/Button";
import { toast } from "react-toastify";
import { OptionProps } from "@/utils/propTypes";
import {
  selectRfidLogManagement,
  updateRfidLog,
} from "@/redux/features/rfid-log/rfidLogReducers";

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
  refreshData: () => void;
};

type FormValues = {
  id?: any;
  guestName?: string | any;
  guestVehicle?: string | any;
  guestLicencePlate?: string | any;
};

const RfidTypeOptions: OptionProps[] = [
  {
    value: "employee",
    label: "employee",
  },
  {
    value: "guest",
    label: "guest",
  },
];

export default function FormRFIDLog(props: Props) {
  const { isClose, items, isUpdate, token, refreshData } = props;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // checked
  // const [isChecked, setIsChecked] = useState(false);
  // let refChecked = useRef<HTMLInputElement>(null);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectRfidLogManagement);

  // form
  const {
    unregister,
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
        guestName: items?.guestName,
        guestVehicle: items?.guestVehicle,
        guestLicencePlate: items?.guestLicencePlate,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        guestName: items?.guestName,
        guestVehicle: items?.guestVehicle,
        guestLicencePlate: items?.guestLicencePlate,
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

  // submit form
  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {
      guestName: value?.guestName,
      guestVehicle: value?.guestVehicle,
      guestLicencePlate: value?.guestLicencePlate,
    };
    if (isUpdate) {
      dispatch(
        updateRfidLog({
          token,
          data: newData,
          id: value?.id,
          isSuccess: () => {
            refreshData();
            toast.dark("Update Log data is successfull");
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
            {isUpdate ? "Update" : "New"} Log details
          </h3>
          <p className="text-gray-5 text-sm">
            Fill your Log details information.
          </p>
        </div>
      </ModalHeader>

      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="guestName">
              Name
            </label>
            <div className="w-full flex">
              <input
                id="guestName"
                type="text"
                placeholder="Name"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("guestName", {
                  required: {
                    value: true,
                    message: "Name is required.",
                  },
                })}
              />
            </div>
            {errors?.guestName && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.guestName.message as any}
                </span>
              </div>
            )}
          </div>

          <div className={`w-full mb-3`}>
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="guestVehicle">
              Vehicle
            </label>
            <div className="w-full flex">
              <input
                id="guestVehicle"
                type="text"
                placeholder="Vehicle"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("guestVehicle")}
              />
            </div>
            {errors?.guestVehicle && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.guestVehicle.message as any}
                </span>
              </div>
            )}
          </div>

          <div className={`w-full mb-3`}>
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="guestLicencePlate">
              Licence Plate
            </label>
            <div className="w-full flex">
              <input
                id="guestLicencePlate"
                type="text"
                placeholder="Licence Plate"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("guestLicencePlate")}
              />
            </div>
            {errors?.guestLicencePlate && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.guestLicencePlate.message as any}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex gap-2 justify-center p-4 border-t-2 border-gray">
          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-md text-sm shadow-card border-primary"
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
