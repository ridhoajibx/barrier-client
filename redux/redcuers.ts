import { combineReducers } from "@reduxjs/toolkit";
import authenticationReducers from "./features/AuthenticationReducers";

export const combinedReducer = combineReducers({
  //All reducer
  authentication: authenticationReducers,
});