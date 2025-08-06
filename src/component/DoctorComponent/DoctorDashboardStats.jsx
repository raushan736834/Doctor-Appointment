import React from "react";
import { FaPeopleGroup, FaMoneyBillTrendUp } from "react-icons/fa6";
import { Wallet, Ambulance } from "lucide-react";

const DoctorDashboardStats = ({ totalBookings, todayBookings }) => {
  const resources = [
    {
      title: "Revenue",
      count: `₹86`,
      desc: "Total generated revenue",
      icon: <Wallet />,
    },
    {
      title: "Overall Bookings",
      count: totalBookings || 0,
      desc: "Total Bookings till today",
      icon: <FaPeopleGroup />,
    },
    {
      title: "Appointments Today",
      count: todayBookings,
      desc: "Appointment",
      icon: <Ambulance />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {resources.map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border p-5 flex justify-between items-center hover:shadow transition"
        >
          <div>
            <p className="flex items-center gap-2 text-gray-600 font-medium">
              {item.icon} {item.title} <span className="ml-1">→</span>
            </p>
            <p className="text-2xl font-bold mt-2">{item.count}</p>
            <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
          </div>
          <div className="flex items-end gap-1 h-16">
            {[2, 4, 3, 5, 4].map((h, i) => (
              <div
                key={i}
                className={`w-2 rounded bg-blue-300 ${
                  i === 3 ? "bg-blue-500" : ""
                }`}
                style={{ height: `${h * 8}px` }}
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorDashboardStats;
