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
export type MainState = {
  rfids: any;
  rfid: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: MainState = {
  rfids: {},
  rfid: {},
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

interface RfidData {
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

// get all rfid
export const getRfids = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/rfid", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("rfid", config);
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
      throw new Error("rfid not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

export const getRfidById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/rfid/id", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get(`rfid/${params?.id}`, config);
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
      throw new Error("rfid not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

export const createRfid = createAsyncThunk<any, RfidData, { state: RootState }>(
  "/rfid/create",
  async (params, { getState }) => {
    let config: HeadersConfiguration = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    try {
      const response = await axios.post("rfid", params.data, config);
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
        throw new Error("rfid not found");
      } else {
        throw new Error(newError.message);
      }
    }
  }
);

export const updateRfId = createAsyncThunk<any, RfidData, { state: RootState }>(
  "/rfid/update",
  async (params, { getState }) => {
    let config: HeadersConfiguration = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    try {
      const response = await axios.patch(
        `rfid/${params.id}`,
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
        throw new Error("rfid not found");
      } else {
        throw new Error(newError.message);
      }
    }
  }
);

export const importRfid = createAsyncThunk<any, RfidData, { state: RootState }>(
  "/rfid/import",
  async (params, { getState }) => {
    let config: HeadersConfiguration = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    try {
      const response = await axios.post(`rfid/import`, params.data, config);
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
  }
);

export const deleteRfid = createAsyncThunk<any, RfidData, { state: RootState }>(
  "/rfid/delete",
  async (params, { getState }) => {
    let config: HeadersConfiguration = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    try {
      const response = await axios.delete(`rfid/${params.id}`, config);
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
        throw new Error("rfid not found");
      } else {
        throw new Error(newError.message);
      }
    }
  }
);

// SLICER
export const rfidSlice = createSlice({
  name: "rfid",
  initialState,
  reducers: {
    // leave this empty here
    reserRfid(state) {
      state.rfid = {};
      state.pending = false;
      state.error = false;
      state.message = "";
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere, including actions generated by createAsyncThunk or in other slices.
  // Since this is an API call we have 3 possible outcomes: pending, fulfilled and rejected. We have made allocations for all 3 outcomes.
  // Doing this is good practice as we can tap into the status of the API call and give our rfids an idea of what's happening in the background.
  extraReducers: (builder) => {
    builder
      // get-rfids
      .addCase(getRfids.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getRfids.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          rfids: payload,
        };
      })
      .addCase(getRfids.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get-rfid-id
      .addCase(getRfidById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getRfidById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          rfid: payload,
        };
      })
      .addCase(getRfidById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-rfids
      .addCase(createRfid.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createRfid.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createRfid.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-rfids
      .addCase(updateRfId.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateRfId.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateRfId.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // import-rfids
      .addCase(importRfid.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(importRfid.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(importRfid.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-rfids
      .addCase(deleteRfid.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteRfid.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteRfid.rejected, (state, { error }) => {
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

const rfidReducers = rfidSlice.reducer;

export const { reserRfid } = rfidSlice.actions;
export const selectRfidManagement = (state: RootState) => state.rfidManagement;

export default rfidReducers;
