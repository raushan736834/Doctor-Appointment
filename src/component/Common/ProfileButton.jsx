import user_logo from "../../assets/img/user_icon.png";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../constants/slots";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProfileButton = ({handleLogout}) => {
  const { auth } = useAuth();
  const role = localStorage.getItem("role");
  return (
    <div className="flex w-full items-center">
      <Menu as="div" className="relative">
        {auth?.accessToken ? (
          <>
            <MenuButton className="flex items-center p-1 hover:bg-gray-800 hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <img
                className="h-11 w-11 rounded-full"
                src={user_logo}
                alt="User"
              />
              {/* Text only on small screens (mobile), hidden on md+ */}
              <div className="ml-2 text-sm text-white font-bold sm:hidden">
                Account Setting
              </div>
            </MenuButton>

            <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <MenuItem>
                {({ focus }) => (
                  <Link
                    to={role === "doctor" ? "/doctor-profile1" : "/profile"}
                    className={classNames(
                      focus ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Your Profile
                  </Link>
                )}
              </MenuItem>
              {role.includes(ROLES.doctor) && (
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      to="/doctor-personalInfo"
                      className={classNames(
                        focus ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Doctor Personal Info
                    </Link>
                  )}
                </MenuItem>
              )}
              <MenuItem>
                {({ focus }) => (
                  <Link
                    to="/booking-details"
                    className={classNames(
                      focus ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Your Bookings
                  </Link>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={handleLogout}
                    className={classNames(
                      focus ? "bg-gray-100" : "",
                      "block w-full text-left px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Logout
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </>
        ) : (
          <Link
            to="/auth/login"
            className="text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 bg-sky-500 rounded-md"
          >
            Login
          </Link>
        )}
      </Menu>
    </div>
  );
};

export default ProfileButton;
