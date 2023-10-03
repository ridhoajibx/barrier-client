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
export type UserState = {
  users: any;
  user: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: UserState = {
  users: {},
  user: {},
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

interface UserData {
  id?: any;
  data: any;
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
export const getUsers = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/user", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("user", config);
    const { data, status } = response;
    if (status == 200) {
      return data;
    } else {
      throw response;
    }
  } catch (error: any) {
    const { data, status } = error.response;
    let newError: any = { message: data.message[0] };
    toast.dark(newError.message);
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

export const getUserById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/user/id", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get(`user/${params?.id}`, config);
    const { data, status } = response;
    if (status == 200) {
      return data;
    } else {
      throw response;
    }
  } catch (error: any) {
    const { data, status } = error.response;
    let newError: any = { message: data.message[0] };
    toast.dark(newError.message);
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

export const createUser = createAsyncThunk<any, UserData, { state: RootState }>(
  "/user/create",
  async (params, { getState }) => {
    let config: HeadersConfiguration = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    try {
      const response = await axios.post("user", params.data, config);
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
      toast.dark(newError.message);
      if (error.response && error.response.status === 404) {
        throw new Error("User not found");
      } else {
        throw new Error(newError.message);
      }
    }
  }
);

export const updateUser = createAsyncThunk<any, UserData, { state: RootState }>(
  "/user/update",
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
        `user/${params.id}`,
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
      toast.dark(newError.message);
      if (error.response && error.response.status === 404) {
        throw new Error("User not found");
      } else {
        throw new Error(newError.message);
      }
    }
  }
);

export const deleteUser = createAsyncThunk<any, UserData, { state: RootState }>(
  "/user/delete",
  async (params, { getState }) => {
    let config: HeadersConfiguration = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    try {
      const response = await axios.delete(`user/${params.id}`, config);
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
      toast.dark(newError.message);
      if (error.response && error.response.status === 404) {
        throw new Error("User not found");
      } else {
        throw new Error(newError.message);
      }
    }
  }
);

// SLICER
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // leave this empty here
    resetUser(state) {
      state.user = {};
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
      .addCase(getUsers.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getUsers.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          users: payload,
        };
      })
      .addCase(getUsers.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get-user-id
      .addCase(getUserById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getUserById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          user: payload,
        };
      })
      .addCase(getUserById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-users
      .addCase(createUser.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createUser.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-users
      .addCase(updateUser.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateUser.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-users
      .addCase(deleteUser.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteUser.rejected, (state, { error }) => {
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

const userReducers = userSlice.reducer;

export const { resetUser } = userSlice.actions;
export const selectUserManagement = (state: RootState) => state.userManagement;

export default userReducers;
