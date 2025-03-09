// import logo from "../../assets/img/appointDoctor.jpg";
// import user_logo from "../../assets/img/user_icon.png";
// import { Link } from "react-router-dom";
// import { Menu, Disclosure ,DisclosureButton, DisclosurePanel, MenuButton,MenuItem,MenuItems} from "@headlessui/react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import useAuth from "../../hooks/useAuth";
// import { useEffect } from "react";

// const navigation = [
//   { name: "Home", href: "/", current: true },
//   { name: "About Us", href: "/about", current: false },
//   { name: "Contact Us", href: "/contact", current: false },
// ];

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// const Header = () => {
//   const { auth, setAuth } = useAuth();

//   const handleLogout = () => {
//     setAuth({});
//     localStorage.removeItem("token");
//     localStorage.removeItem("email");
//     localStorage.removeItem("role");
//   };
  
//   useEffect(()=>{
//     let token = localStorage.getItem("token")
//     setAuth({accessToken: token});
//   },[])

//   return (
//     <Disclosure as="nav" className="bg-gray-800">
//       {({ open }) => (
//         <>
//           <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
//             <div className="relative flex h-16 items-center justify-between">
//               <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
//                 <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
//                   <span className="sr-only">Open main menu</span>
//                   {open ? (
//                     <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
//                   ) : (
//                     <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                   )}
//                 </DisclosureButton>
//               </div>
//               <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
//                 <div className="flex flex-shrink-0 items-center">
//                   <img className="h-8 w-auto" src={logo} alt="App Logo" />
//                 </div>
//                 <div className="hidden sm:ml-6 sm:block">
//                   <div className="flex space-x-4">
//                     {navigation.map((item) => (
//                       <Link
//                         key={item.name}
//                         to={item.href}
//                         className={classNames(
//                           item.current
//                             ? "bg-gray-900 text-white"
//                             : "text-gray-300 hover:bg-gray-700 hover:text-white",
//                           "rounded-md px-3 py-2 text-sm font-medium"
//                         )}
//                         aria-current={item.current ? "page" : undefined}
//                       >
//                         {item.name}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
//                 {/* Profile dropdown */}
//                 <Menu as="div" className="relative ml-3">
//                   {({ open }) => (
//                     <>
//                       {auth?.accessToken ? (
//                         <>
//                           <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
//                             {/* <span className="sr-only">Open user menu</span> */}
//                             <img
//                               className="h-11 w-11 rounded-full"
//                               src={user_logo}
//                               alt="User"
//                             />
//                           </MenuButton>
//                           <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                             <MenuItem>
//                               {({ focus }) => (
//                                 <Link
//                                   to="/profile"
//                                   className={classNames(
//                                     focus ? "bg-gray-100" : "",
//                                     "block px-4 py-2 text-sm text-gray-700"
//                                   )}
//                                 >
//                                   Your Profile
//                                 </Link>
//                               )}
//                             </MenuItem>
//                             <MenuItem>
//                               {({ focus }) => (
//                                 <Link
//                                   to="/booking-details"
//                                   className={classNames(
//                                     focus ? "bg-gray-100" : "",
//                                     "block px-4 py-2 text-sm text-gray-700"
//                                   )}
//                                 >
//                                   Your Bookings
//                                 </Link>
//                               )}
//                             </MenuItem>
//                             <MenuItem>
//                               {({ focus }) => (
//                                 <button
//                                   onClick={handleLogout}
//                                   className={classNames(
//                                     focus ? "bg-gray-100" : "",
//                                     "block w-full text-left px-4 py-2 text-sm text-gray-700"
//                                   )}
//                                 >
//                                   Logout
//                                 </button>
//                               )}
//                             </MenuItem>
//                           </MenuItems>
//                         </>
//                       ) : (
//                         <Link
//                           to="/auth.login.user"
//                           className="text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white w-24 h-10 bg-sky-500 flex justify-center items-center rounded-md"
//                         >
//                           Login
//                         </Link>
//                       )}
//                     </>
//                   )}
//                 </Menu>
//               </div>
//             </div>
//           </div>

//           <DisclosurePanel className="sm:hidden">
//             <div className="space-y-1 px-2 pb-3 pt-2">
//               {navigation.map((item) => (
//                 <DisclosureButton
//                   key={item.name}
//                   as="a"
//                   href={item.href}
//                   className={classNames(
//                     item.current
//                       ? "bg-gray-900 text-white"
//                       : "text-gray-300 hover:bg-gray-700 hover:text-white",
//                     "block rounded-md px-3 py-2 text-base font-medium"
//                   )}
//                   aria-current={item.current ? "page" : undefined}
//                 >
//                   {item.name}
//                 </DisclosureButton>
//               ))}
//             </div>
//           </DisclosurePanel>
//         </>
//       )}
//     </Disclosure>
//   );
// };

// export default Header;
import logo from "../../assets/img/appointDoctor.jpg";
import user_logo from "../../assets/img/user_icon.png";
import { Link } from "react-router-dom";
import { Menu, Disclosure, DisclosureButton, DisclosurePanel, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";

const role = localStorage.getItem("role");
console.log(role);
const navigation = [
  {
    name: "Home",
    href: role === "doctor" ? "/doctor-dashboard" : "/",
    current: true,
  },
  { name: "About Us", href: "/about", current: false },
  { name: "Contact Us", href: "/contact", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const { auth, setAuth } = useAuth();
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
  
    setAuth((prevAuth) => ({
      accessToken: token,
    }));
  
    if (storedRole) {
      setRole(storedRole);
    }
  }, [auth.accessToken]);

  const handleLogout = () => {
    setAuth({});
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setRole("");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img className="h-8 w-auto" src={logo} alt="App Logo" />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  {({ open }) => (
                    <>
                      {auth?.accessToken ? (
                        <>
                          <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <img
                              className="h-11 w-11 rounded-full"
                              src={user_logo}
                              alt="User"
                            />
                          </MenuButton>
                          <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                            {role === "doctor" && (
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
                          to="/auth.login.user"
                          className="text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white w-24 h-10 bg-sky-500 flex justify-center items-center rounded-md"
                        >
                          Login
                        </Link>
                      )}
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
