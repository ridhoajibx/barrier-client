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
  vehicleTypeCode?: string | any;
  vehicleTypeName?: string | any;
};

export default function FormVehicle(props: Props) {
  const { isClose, items, isUpdate, filters, token, refreshData } = props;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // checked
  // const [isChecked, setIsChecked] = useState(false);
  // let refChecked = useRef<HTMLInputElement>(null);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(
    selectVehicleTypeManagement
  );

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
        vehicleTypeCode: items?.vehicleTypeCode,
        vehicleTypeName: items?.vehicleTypeName,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        vehicleTypeCode: items?.vehicleTypeCode,
        vehicleTypeName: items?.vehicleTypeName,
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
      vehicleTypeCode: value?.vehicleTypeCode,
      vehicleTypeName: value?.vehicleTypeName,
    };

    if (!isUpdate) {
      dispatch(
        createVehicleType({
          token,
          data: newData,
          isSuccess: () => {
            refreshData();
            toast.dark("Create vehicle type is successfull");
            isClose();
          },
        })
      );
    } else {
      dispatch(
        updateVehicleType({
          token,
          data: newData,
          id: value?.id,
          isSuccess: () => {
            refreshData();
            toast.dark("Update vehicle type is successfull");
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
            {isUpdate ? "Update" : "New"} Vehicle Type
          </h3>
          <p className="text-gray-5 text-sm">
            Fill your vehicle type information.
          </p>
        </div>
      </ModalHeader>

      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="vehicleCode">
              Vehicle Code
            </label>
            <div className="w-full flex">
              <input
                id="vehicleCode"
                type="text"
                placeholder="Vehicle Code"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("vehicleTypeCode")}
              />
            </div>
            {errors?.vehicleTypeCode && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.vehicleTypeCode.message as any}
                </span>
              </div>
            )}
          </div>

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="vehicleName">
              Vehicle No.
            </label>
            <div className="w-full flex">
              <input
                type="text"
                placeholder="Vehicle No."
                autoFocus
                id="vehicleName"
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("vehicleTypeName", {
                  required: {
                    value: true,
                    message: "Vehicle No. is required.",
                  },
                })}
              />
            </div>
            {errors?.vehicleTypeName && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.vehicleTypeName.message as any}
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
