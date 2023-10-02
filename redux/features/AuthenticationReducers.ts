import {
    Action,
    AnyAction,
    createAsyncThunk,
    createSlice,
  } from "@reduxjs/toolkit";
  import axios from "axios";
  import { toast } from "react-toastify";
  import type { RootState } from "../store";
  import { setCookie, deleteCookie } from "cookies-next";
  
  // here we are typing the types for the state
  export type AuthState = {
    data: {
      user?: any;
      accessToken?: string;
      refreshToken?: string;
      roles?: string;
    };
    isLogin: boolean;
    pending: boolean;
    error: boolean;
    message: any;
  };
  
  const initialState: AuthState = {
    data: {
      user: {},
      accessToken: "",
      refreshToken: "",
      roles: "",
    },
    isLogin: false,
    pending: false,
    error: false,
    message: "",
  };
  
  interface HeadersConfiguration {
    headers: {
      "Content-Type"?: string;
      Accept?: string;
      Authorization?: string;
    };
  }
  
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  
  interface AuthData {
    data: any;
    callback: () => void;
  }
  
  interface AccessData {
    id?: number | string;
    params?: any;
    data?: any;
    token?: any;
    callback: () => void;
  }
  
  interface MyData {
    token?: any;
    callback: () => void;
  }
  
  // rejection
  interface RejectedAction extends Action {
    error: Error;
  }
  
  function isRejectedAction(action: AnyAction): action is RejectedAction {
    return action.type.endsWith("rejected");
  }
  
  // Login
  export const webLogin = createAsyncThunk<any, AuthData, { state: RootState }>(
    "auth/login",
    async (params, { getState }) => {
      try {
        const response = await axios.post("auth/login", params.data, config);
        const { data, status } = response;
        if (status == 200) {
          toast.dark("Sign in successfully!");
          setCookie("accessToken", data?.accessToken, {
            secure: true,
            maxAge: 60 * 60 * 24,
          });
          setCookie("refreshToken", data?.refreshToken, {
            secure: true,
            maxAge: 60 * 60 * 24,
          });
          params.callback();
          return data;
        } else {
          throw response;
        }
      } catch (error: any) {
        const { data, status } = error.response;
        let newError: any = { message: data.message[0] };
        toast.dark(newError?.message);
        if (error.response && error.response.status === 404) {
          throw new Error("User not found");
        } else {
          throw new Error(newError.message);
        }
      }
    }
  );
  
  // Auth me
  export const getAuthMe = createAsyncThunk<any, MyData, { state: RootState }>(
    "auth/me",
    async (params, { getState }) => {
      let config: HeadersConfiguration = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${params.token}`,
        },
      };
      try {
        const response = await axios.get("auth/me", config);
        const { data, status } = response;
        if (status == 200) {
          setCookie("roles", data?.role, {
            secure: true,
            maxAge: 60 * 60 * 24,
          });
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
          if (status == 401) {
            deleteCookie("role");
            deleteCookie("accessToken");
            deleteCookie("refreshToken");
            params.callback();
          }
          throw new Error(newError.message);
        }
      }
    }
  );
  
  // logout
  export const webLogout = createAsyncThunk<any, AuthData, { state: RootState }>(
    "auth/logout",
    async (params, { getState }) => {
      let config: HeadersConfiguration = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${params.data.token}`,
        },
      };
      try {
        const response = await axios.get("auth/logout", config);
        const { data, status } = response;
        if (status == 200) {
          toast.dark("Logout successfully!");
          deleteCookie("accessToken");
          deleteCookie("refreshToken");
          deleteCookie("roles");
          params.callback();
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
  
  // forgot-password
  export const webForgotPassword = createAsyncThunk<
    any,
    any,
    { state: RootState }
  >("auth/forgot-password", async (params, { getState }) => {
    try {
      const response = await axios.post(
        "auth/forgotPassword",
        params.data,
        config
      );
      const { data, status } = response;
      if (status == 200) {
        toast.dark("Your password has reset! Please, check your Email");
        return data;
      } else {
        throw response;
      }
    } catch (error: any) {
      const { data, status } = error.response;
      let newError: any = { message: data.message[0] };
      toast.dark(newError?.message);
      if (error.response && error.response.status === 404) {
        throw new Error("User not found");
      } else {
        throw new Error(newError.message);
      }
    }
  });
  
  // set new password - forgot password
  export const webNewPassword = createAsyncThunk<any, any, { state: RootState }>(
    "auth/forgot-password/code",
    async (params, { getState }) => {
      console.log(params, "params");
      try {
        const response = await axios.patch(
          `auth/forgotPassword/${params.code}`,
          params.data,
          config
        );
        const { data, status } = response;
        if (status == 200) {
          toast.dark("Your password has reset!");
          params.callback();
          return data;
        } else {
          throw response;
        }
      } catch (error: any) {
        const { data, status } = error.response;
        let newError: any = { message: data.message[0] };
        toast.dark(newError?.message);
        if (error.response && error.response.status === 404) {
          throw new Error("User not found");
        } else {
          throw new Error(newError.message);
        }
      }
    }
  );
  
  // SLICER
  export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      // leave this empty here
      resetAuth(state) {
        state.data.user = {};
        state.data.roles = "";
        state.data.accessToken = "";
        state.data.refreshToken = "";
        state.isLogin = false;
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
        // login
        .addCase(webLogin.pending, (state) => {
          return {
            ...state,
            pending: true,
          };
        })
        .addCase(webLogin.fulfilled, (state, { payload }) => {
          return {
            ...state,
            isLogin: true,
            pending: false,
            error: false,
            data: {
              ...state.data,
              roles: payload.roles,
              accessToken: payload.accessToken,
              refreshToken: payload.refreshToken,
            },
          };
        })
        .addCase(webLogin.rejected, (state, { error }) => {
          return {
            ...state,
            pending: false,
            error: true,
            message: error.message,
          };
        })
          
        // logout
        .addCase(webLogout.pending, (state) => {
          return {
            ...state,
            pending: true,
          };
        })
        .addCase(webLogout.fulfilled, (state, { payload }) => {
          state.isLogin = false;
          state.pending = false;
          state.error = false;
          state.data.user = {};
          state.data.roles = "";
          state.data.accessToken = "";
          state.data.refreshToken = "";
        })
        .addCase(webLogout.rejected, (state, { error }) => {
          return {
            ...state,
            pending: false,
            error: true,
            message: error.message,
          };
        })
  
        // auth-me
        .addCase(getAuthMe.pending, (state) => {
          return {
            ...state,
            pending: true,
          };
        })
        .addCase(getAuthMe.fulfilled, (state, { payload }) => {
          return {
            ...state,
            isLogin: true,
            pending: false,
            error: false,
            data: {
              ...state.data,
              user: payload,
              roles: payload?.role,
            },
          };
        })
        .addCase(getAuthMe.rejected, (state, { error }) => {
          state.pending = false;
          state.error = true;
          state.message = error.message;
        })
  
        // forgot-password
        .addCase(webForgotPassword.pending, (state) => {
          return {
            ...state,
            pending: true,
          };
        })
        .addCase(webForgotPassword.fulfilled, (state, { payload }) => {
          return {
            ...state,
            isLogin: false,
            pending: false,
            error: false,
          };
        })
        .addCase(webForgotPassword.rejected, (state, { error }) => {
          return {
            ...state,
            pending: false,
            error: true,
            message: error.message,
          };
        })
  
        // change-new-password
        .addCase(webNewPassword.pending, (state) => {
          return {
            ...state,
            pending: true,
          };
        })
        .addCase(webNewPassword.fulfilled, (state, { payload }) => {
          return {
            ...state,
            isLogin: false,
            pending: false,
            error: false,
          };
        })
        .addCase(webNewPassword.rejected, (state, { error }) => {
          return {
            ...state,
            pending: false,
            error: true,
            message: error.message,
          };
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
  
  const authenticationReducers = authSlice.reducer;
  
  export const selectAuth = (state: RootState) => state.authentication;
  export const { resetAuth } = authSlice.actions;
  
  export default authenticationReducers;