import React from "react";
import { BiSolidHome, BiBody, BiTask } from "react-icons/bi";
import { GiStethoscope } from "react-icons/gi";
import './styles/Sidebar.css';
import ProfileButton from "../Common/ProfileButton";

const Sidebar = () => {
  return (
    <div className="menu flex flex-col h-screen bg-gray-100 text-gray-900 w-16 md:w-48 lg:w-64">
      <div className="flex flex-col ml-2 justify-between h-full items-start text-start lg:items-center md:items-center">
        <div className="">
          <div className="logo flex items-center mt-5 mb-3 h-16 bg-gray-100 text-xl">
            <GiStethoscope className="logo-icon text-4xl items-start md:items-center font-bold md:text-6xl lg:text-7xl " />
          </div>
          <div className="menu--list flex flex-col">
            <a
              href="#"
              className="item flex items-center p-4 font-semibold hover:bg-gray-800
                hover:text-white transition duration-300 ease-in-out rounded-lg 
                "
            >
              <BiSolidHome className="icon text-2xl" />
              <span className="hidden md:block ml-4">Home</span>
            </a>
            <a
              href="#"
              className="item flex items-center p-4  font-semibold hover:bg-gray-800
                hover:text-white transition duration-300 ease-in-out rounded-lg "
            >
              <BiTask className="icon text-2xl" />
              <span className="hidden md:block ml-4">Appointments</span>
            </a>
            <a
              href="#"
              className="item flex items-center p-4 font-semibold hover:bg-gray-800
                hover:text-white transition duration-300 ease-in-out rounded-lg "
            >
              <BiBody className="icon text-2xl" />
              <span className="hidden md:block ml-4">Patients</span>
            </a>
          </div>
        </div>
        <ProfileButton />
      </div>
    </div>
  );
};

export default Sidebar;
