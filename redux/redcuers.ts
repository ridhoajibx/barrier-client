import { combineReducers } from "@reduxjs/toolkit";
import authenticationReducers from "./features/AuthenticationReducers";
import userReducers from "./features/user/userReducers";
import rfidReducers from "./features/rfid/rfidReducers";
import rfidLogReducers from "./features/rfid-log/rfidLogReducers";
import vehicleTypeReducers from "./features/vehicleType/vehicleTypeReducers";

export const combinedReducer = combineReducers({
  //All reducer
  authentication: authenticationReducers,
  // user
  userManagement: userReducers,
  // rfid
  rfidManagement: rfidReducers,
  // rfid-log
  rfidLogManagement: rfidLogReducers,
  // vehicle-type
  vehicleTypeManagement: vehicleTypeReducers,
});
