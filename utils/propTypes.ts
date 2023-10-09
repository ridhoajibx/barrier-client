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
