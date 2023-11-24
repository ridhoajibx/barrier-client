import {
  Action,
  AnyAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import type { RootState } from "../../store";

// here we are typing the types for the state
export type VehicleTypeState = {
  vehicleTypes: any;
  vehicleType: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: VehicleTypeState = {
  vehicleTypes: {},
  vehicleType: {},
  pending: false,
  error: false,
  message: "",
};

interface HeadersConfiguration {
  params?: any;
  headers: {
    "Content-Type"?: string;
    Accept?: string;
    Authorization?: string;
  };
}

interface VehicleTypeData {
  id?: any;
  data?: any;
  token?: any;
  isSuccess: () => void;
}

interface DefaultGetData {
  id?: any;
  token?: any;
  params?: any;
}

// rejection
interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

// get all user
export const getVehicleTypes = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/vehicleType", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("vehicleType", config);
    const { data, status } = response;
    if (status == 200) {
      return data;
    } else {
      throw response;
    }
  } catch (error: any) {
    const { data, status } = error.response;
    let newError: any = { message: data.message[0] };
    if (error.response.status !== 401) {
      toast.dark(newError.message);
    }
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

export const getVehicleTypeById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/vehicleType/id", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get(`vehicleType/${params?.id}`, config);
    const { data, status } = response;
    if (status == 200) {
      return data;
    } else {
      throw response;
    }
  } catch (error: any) {
    const { data, status } = error.response;
    let newError: any = { message: data.message[0] };
    if (error.response.status !== 401) {
      toast.dark(newError.message);
    }
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

export const createVehicleType = createAsyncThunk<
  any,
  VehicleTypeData,
  { state: RootState }
>("/vehicleType/create", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post("vehicleType", params.data, config);
    const { data, status } = response;
    if (status == 201) {
      params.isSuccess();
      return data;
    } else {
      throw response;
    }
  } catch (error: any) {
    const { data, status } = error.response;
    let newError: any = { message: data.message[0] };
    if (error.response.status !== 401) {
      toast.dark(newError.message);
    }
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

export const updateVehicleType = createAsyncThunk<
  any,
  VehicleTypeData,
  { state: RootState }
>("/vehicleType/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `vehicleType/${params.id}`,
      params.data,
      config
    );
    const { data, status } = response;
    if (status == 200) {
      params.isSuccess();
      return data;
    } else {
      throw response;
    }
  } catch (error: any) {
    const { data, status } = error.response;
    let newError: any = { message: data.message[0] };
    if (error.response.status !== 401) {
      toast.dark(newError.message);
    }
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

export const deleteVehicleType = createAsyncThunk<
  any,
  VehicleTypeData,
  { state: RootState }
>("/vehicleType/delete", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete(`vehicleType/${params.id}`, config);
    const { data, status } = response;
    if (status == 204) {
      params.isSuccess();
      return data;
    } else {
      throw response;
    }
  } catch (error: any) {
    const { data, status } = error.response;
    let newError: any = { message: data.message[0] };
    if (error.response.status !== 401) {
      toast.dark(newError.message);
    }
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

export const importVehicleType = createAsyncThunk<
  any,
  VehicleTypeData,
  { state: RootState }
>("/vehicleType/import", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      `vehicleType/import`,
      params.data,
      config
    );
    const { data, status } = response;
    if (status == 201) {
      params.isSuccess();
      return data;
    } else {
      throw response;
    }
  } catch (error: any) {
    const { data, status } = error.response;
    let newError: any = { message: data.message[0] };
    if (error.response.status !== 401) {
      toast.dark(newError.message);
    }
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

// SLICER
export const vehicleTypeSlice = createSlice({
  name: "vehicleType",
  initialState,
  reducers: {
    // leave this empty here
    resetVehicleType(state) {
      state.vehicleType = {};
      state.pending = false;
      state.error = false;
      state.message = "";
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere, including actions generated by createAsyncThunk or in other slices.
  // Since this is an API call we have 3 possible outcomes: pending, fulfilled and rejected. We have made allocations for all 3 outcomes.
  // Doing this is good practice as we can tap into the status of the API call and give our users an idea of what's happening in the background.
  extraReducers: (builder) => {
    builder
      // get-users
      .addCase(getVehicleTypes.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getVehicleTypes.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          vehicleTypes: payload,
        };
      })
      .addCase(getVehicleTypes.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get-user-id
      .addCase(getVehicleTypeById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getVehicleTypeById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          vehicleType: payload,
        };
      })
      .addCase(getVehicleTypeById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-users
      .addCase(createVehicleType.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createVehicleType.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createVehicleType.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-users
      .addCase(updateVehicleType.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateVehicleType.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateVehicleType.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // import
      .addCase(importVehicleType.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(importVehicleType.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(importVehicleType.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-users
      .addCase(deleteVehicleType.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteVehicleType.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteVehicleType.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      .addMatcher(isRejectedAction, (state, action) => {})
      .addDefaultCase((state, action) => {
        let base = {
          ...state,
          ...action.state,
        };
        return base;
      });
  },
});
// SLICER

const vehicleTypeReducers = vehicleTypeSlice.reducer;

export const { resetVehicleType } = vehicleTypeSlice.actions;
export const selectVehicleTypeManagement = (state: RootState) =>
  state.vehicleTypeManagement;

export default vehicleTypeReducers;
