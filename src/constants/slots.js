export const allSlots = {
  Morning: [
    "08:00 AM",
    "08:15 AM",
    "08:30 AM",
    "08:45 AM",
    "09:00 AM",
    "09:15 AM",
    "09:30 AM",
    "09:45 AM",
  ],
  Noon: [
    "12:00 PM",
    "12:15 PM",
    "12:30 PM",
    "12:45 PM",
    "01:00 PM",
    "01:15 PM",
    "01:30 PM",
    "01:45 PM",
  ],
  Evening: [
    "04:00 PM",
    "04:15 PM",
    "04:30 PM",
    "04:45 PM",
    "05:00 PM",
    "05:15 PM",
    "05:30 PM",
    "05:45 PM",
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
