import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { MdCheck, MdClose, MdOutlinePlace, MdWarning } from "react-icons/md";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { FaCircleNotch } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import {
  createVehicleType,
  selectVehicleTypeManagement,
  updateVehicleType,
} from "@/redux/features/vehicleType/vehicleTypeReducers";
import { ModalHeader } from "@/components/modal/ModalComponent";
import Button from "@/components/button/Button";
import { toast } from "react-toastify";
import {
  createRfid,
  selectRfidManagement,
  updateRfId,
} from "@/redux/features/rfid/rfidReducers";
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
  refreshData: () => void;
  vehicleOption?: OptionProps[] | any[] | any;
};

type FormValues = {
  id?: any;
  rfidNumber?: string | any;
  rfidType?: string | any;
  vehicleType?: any;
  employeeName?: string | any;
  licencePlate?: string | any;
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

export default function FormRFID(props: Props) {
  const { isClose, items, isUpdate, token, refreshData, vehicleOption } = props;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // checked
  // const [isChecked, setIsChecked] = useState(false);
  // let refChecked = useRef<HTMLInputElement>(null);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectRfidManagement);

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
        rfidNumber: items?.rfidNumber,
        rfidType: items?.rfidType,
        vehicleType: items?.vehicleType,
        employeeName: items?.employeeName,
        licencePlate: items?.licencePlate,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        rfidNumber: items?.rfidNumber,
        rfidType: items?.rfidType,
        vehicleType: items?.vehicleType,
        employeeName: items?.employeeName,
        licencePlate: items?.licencePlate,
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

  const typeValue = useWatch({
    name: "rfidType",
    control,
  });

  const isEmployee = useMemo(() => {
    let emp: boolean = false;
    if (typeValue?.value && typeValue?.value == "employee") {
      emp = true;
    } else {
      emp;
    }
    return emp;
  }, [typeValue]);

  useEffect(() => {
    if (isEmployee) {
      register("vehicleType", {
        required: {
          value: true,
          message: "Vehicle type is required.",
        },
      });
      register("employeeName", {
        required: {
          value: true,
          message: "Employee Name is required.",
        },
      });
      register("licencePlate", {
        required: {
          value: true,
          message: "Vehicle No. is required.",
        },
      });
    } else {
      unregister("vehicleType");
      unregister("employeeName");
      unregister("licencePlate");
    }
  }, [isEmployee]);

  // submit form
  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {};
    if (!isEmployee) {
      newData = {
        rfidNumber: value?.rfidNumber,
        rfidType: value?.rfidType?.value,
      };
    } else {
      newData = {
        rfidNumber: value?.rfidNumber,
        rfidType: value?.rfidType?.value,
        vehicleType: value?.vehicleType?.id,
        employeeName: value?.employeeName,
        licencePlate: value?.licencePlate,
      };
    }
    if (!isUpdate) {
      dispatch(
        createRfid({
          token,
          data: newData,
          isSuccess: () => {
            refreshData();
            toast.dark("Create RFID is successfull");
            isClose();
          },
        })
      );
    } else {
      dispatch(
        updateRfId({
          token,
          data: newData,
          id: value?.id,
          isSuccess: () => {
            refreshData();
            toast.dark("Update RFID is successfull");
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
            {isUpdate ? "Update" : "New"} RFID
          </h3>
          <p className="text-gray-5 text-sm">Fill your RFID information.</p>
        </div>
      </ModalHeader>

      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="rfidType">
              RFID Type
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
                    instanceId="rfidType"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="RFID Type"
                    options={RfidTypeOptions}
                    icon=""
                    isClearable
                  />
                )}
                name={`rfidType`}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Type is required.",
                  },
                }}
              />
              {errors?.rfidType && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors?.rfidType?.message as any}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="rfidNumber">
              RFID No.
            </label>
            <div className="w-full flex">
              <input
                id="rfidNumber"
                type="text"
                placeholder="RFID No."
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("rfidNumber", {
                  required: {
                    value: true,
                    message: "RFID No. is required.",
                  },
                })}
              />
            </div>
            {errors?.rfidNumber && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.rfidNumber.message as any}
                </span>
              </div>
            )}
          </div>

          <div className={`w-full mb-3 ${!isEmployee ? "hidden" : ""}`}>
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="vehicleType">
              Vehicle Type
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
                    instanceId="vehicleType"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="Vehicle Type"
                    options={vehicleOption}
                    icon=""
                    isClearable
                  />
                )}
                name={`vehicleType`}
                control={control}
              />
              {errors?.vehicleType && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors?.vehicleType?.message as any}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={`w-full mb-3 ${!isEmployee ? "hidden" : ""}`}>
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="employeeName">
              Employee Name
            </label>
            <div className="w-full flex">
              <input
                id="employeeName"
                type="text"
                placeholder="Employee name"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("employeeName")}
              />
            </div>
            {errors?.employeeName && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.employeeName.message as any}
                </span>
              </div>
            )}
          </div>

          <div className={`w-full mb-3 ${!isEmployee ? "hidden" : ""}`}>
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="licencePlate">
              Vehicle No.
            </label>
            <div className="w-full flex">
              <input
                id="licencePlate"
                type="text"
                placeholder="Vehicle No."
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("licencePlate")}
              />
            </div>
            {errors?.licencePlate && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.licencePlate.message as any}
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
