export const allSlots = {
  Morning: [
    "08:00 AM",
    "08:20 AM",
    "08:40 AM",
    "09:00 AM",
    "09:20 AM",
    "09:40 AM",
    "10:00 AM",
    "10:20 AM",
    "10:40 AM",
    "11:00 AM",
  ],
  Noon: [
    "01:00 PM",
    "01:20 PM",
    "01:40 PM",
    "02:00 PM",
    "02:20 PM",
    "02:40 PM",
    "03:00 PM",
    "03:20 PM",
    "03:40 PM",
    "04:00 PM",
  ],
  Evening: [
    "05:00 PM",
    "05:20 PM",
    "05:40 PM",
    "06:00 PM",
    "06:20 PM",
    "06:40 PM",
    "07:00 PM",
    "07:20 PM",
    "07:40 PM",
    "08:00 PM",
  ],
};

export const ROLES = { user: "ROLE_USER", doctor: "ROLE_DOCTOR" };

export const AppointmentStatus = Object.freeze({
  BOOKED: "BOOKED",
  CANCELLED: "CANCELLED",
  RESCHEDULED: "RESCHEDULED",
  COMPLETED: "COMPLETED",
  EXPIRED: "EXPIRED",
});
