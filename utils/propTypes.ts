export interface OptionProps {
  value: any;
  label: any;
}

export interface UserProps {
  id?: number | string | any;
  username?: string | any;
  fullName?: string | any;
  role?: string | any;
}

export interface VehicleTypeProps {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  vehicleTypeCode?: string | any;
  vehicleTypeName?: string | any;
}

export interface RfidProps {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  rfidNumber?: string | any;
  rfidType?: string | any;
  employeeName?: string | any;
  licencePlate?: string | any;
  vehicleType?: VehicleTypeProps | any;
  cardNumber?: string | any;
}

export interface RfidLogProps {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  rfidNumber?: string | any;
  rfidType?: string | any;
  employeeName?: string | any;
  employeeVehicle?: string | any;
  employeeLicencePlate?: string | any;
  guestName?: string | any;
  guestVehicle?: string | any;
  guestLicencePlate?: string | any;
  arrival?: string | any;
  departure?: string | any;
  rfid?: string | any;
  cardNumber?: string | any;
}

export interface LogGateProps {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  adminFullName: string | any;
  adminUsername: string | any;
  adminRole: string | any;
  gateStatus: string | any;
  gateImageIn: string | any;
  gateImageOut: string | any;
  time: null;
}

export interface ParkingProps {
  id?: number | string | any;
  createdAt?: string | any;
  rfidNumber?: string | any;
  rfidType?: string | any;
  employeeName?: string | any;
  employeeVehicle?: string | any;
  employeeLicencePlate?: string | any;
  guestName?: string | any;
  guestVehicle?: string | any;
  guestLicencePlate?: string | any;
  arrival?: string | any;
  departure?: string | any;
  rfid?: RfidProps;
  duration?: string | any;
}
