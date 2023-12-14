import { combineReducers } from "@reduxjs/toolkit";
import authenticationReducers from "./features/AuthenticationReducers";
import userReducers from "./features/user/userReducers";
import rfidReducers from "./features/rfid/rfidReducers";
import rfidLogReducers from "./features/rfid-log/rfidLogReducers";
import vehicleTypeReducers from "./features/vehicleType/vehicleTypeReducers";
import parkingReducers from "./features/dashboard/parkingReducers";
import dailyReducers from "./features/dashboard/dailyReducers";
import reportReducers from "./features/dashboard/reportReducers";
import arrivalReducers from "./features/dashboard/arrivalReducers";
import peakTimeReducers from "./features/dashboard/peekTimeReducers";
import logGateReducers from "./features/log-gate/logGateReducers";

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
  // chart-daily
  dailyManagement: dailyReducers,
  // chart-report
  reportManagement: reportReducers,
  // chart-arrival
  arrivalManagement: arrivalReducers,
  // chart-peek-time
  peakTimeManagement: peakTimeReducers,
  // data dashboard parking & duration
  parkingManagement: parkingReducers,
  // log-gate
  logGateManagement: logGateReducers,
});
