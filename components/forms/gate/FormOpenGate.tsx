import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { MdCheck, MdClose, MdOutlinePlace, MdWarning } from "react-icons/md";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { FaCircleNotch, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import {
  createVehicleType,
  selectVehicleTypeManagement,
  updateVehicleType,
} from "@/redux/features/vehicleType/vehicleTypeReducers";
import { ModalHeader } from "@/components/modal/ModalComponent";
import Button from "@/components/button/Button";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";

type Props = {
  token?: any;
  isClose: () => void;
};

type FormValues = {
  gatePassword?: string | any;
};

export default function FormOpenGate(props: Props) {
  const { isClose, token } = props;
  const router = useRouter();

  const [isHidden, setIsHidden] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);

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
        gatePassword: null,
      }),
      []
    ),
  });

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
      gatePassword: value?.gatePassword,
    };

    let config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    setLoading(true);
    try {
      const response = await axios.post(`gate/open`, newData, config);
      const { data, status } = response;
      if (status == 200) {
        toast.dark("Gate has been closed!");
        reset({ gatePassword: null });
        isClose();
      } else {
        throw response;
      }
    } catch (error: any) {
      const { data, status } = error.response;
      let newError: any = { message: data?.message[0] };
      if (error.response.status !== 401) {
        toast.dark(newError?.message);
      }
      if (error.response.status == 401) {
        router.reload();
      }
      // if (error?.response && error?.response?.status === 404) {
      //   throw new Error("log not found");
      // } else {
      //   throw new Error(newError?.message);
      // }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <ModalHeader
        onClick={isClose}
        isClose={true}
        className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
        <div className="w-full flex flex-col gap-1 px-2">
          <h3 className="text-lg font-semibold">Gate Force Open</h3>
          <p className="text-gray-5 text-sm">Fill your password.</p>
        </div>
      </ModalHeader>

      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="gatePassword">
              Gate Password
            </label>
            <div className="relative w-full flex">
              <input
                id="gatePassword"
                type={isHidden ? "password" : "text"}
                placeholder="Password"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("gatePassword", {
                  required: {
                    value: true,
                    message: "Gate Password is required.",
                  },
                })}
              />
              <button
                type="button"
                className="absolute z-40 right-4 top-3.5 text-gray-5 focus:outline-none"
                onClick={() => setIsHidden((prev) => !prev)}>
                {isHidden ? (
                  <FaEyeSlash className="w-5 h-5" />
                ) : (
                  <FaEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors?.gatePassword && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.gatePassword.message as any}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex gap-2 justify-end p-4 border-t-2 border-gray">
          <Button
            type="submit"
            variant="danger"
            className="w-full rounded-md text-sm shadow-card border-danger duration-300 active:scale-90"
            onClick={handleSubmit(onSubmit)}
            disabled={pending || !isValid}>
            <span className="font-semibold">Open Gate</span>
            {pending ? (
              <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
            ) : (
              <MdWarning className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Fragment>
  );
}
