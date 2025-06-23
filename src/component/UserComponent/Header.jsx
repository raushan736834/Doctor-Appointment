import logo from "../../assets/img/appointDoctor.jpg";
import { Link, useLocation } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import ProfileButton from "../Common/ProfileButton";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getNavigation(role, location) {
  return [
    {
      name: "Home",
      href: role === "doctor" ? "/doctor-dashboard" : "/",
      current:
        location.pathname === "/" || location.pathname === "/doctor-dashboard",
    },
    { name: "About Us", href: "/about", current: location.pathname === "/about" },
    { name: "Contact Us", href: "/contact", current: location.pathname === "/contact" },
  ];
}

const Header = () => {
  const { auth, setAuth } = useAuth();
  const [role, setRole] = useState(localStorage.getItem("role"));
  const location = useLocation();
  const headerRef = useRef(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, [auth.accessToken]);

  const handleLogout = useCallback(() => {
    setAuth({});
    localStorage.clear();
    setRole("");
    console.log(auth)
    // window.dispatchEvent(new Event("storage"));
  }, [setAuth]);

  const navigation = useMemo(() => getNavigation(role, location), [role, location]);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open, close }) => {
        // Close on outside click when mobile menu is open
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (!open) return;
          function handleClick(e) {
            if (headerRef.current && !headerRef.current.contains(e.target)) {
              close();
            }
          }
          document.addEventListener("mousedown", handleClick);
          return () => document.removeEventListener("mousedown", handleClick);
        }, [open, close]);
        return (
          <div ref={headerRef}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Mobile menu button */}
                <div className="flex items-center sm:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                    {open ? (
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>

                {/* Logo and nav */}
                <div className="flex flex-1 items-center justify-center sm:justify-start">
                  <Link to="/">
                    <img className="h-8 w-auto" src={logo} alt="App Logo" />
                  </Link>

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

                {/* Profile dropdown / button */}
                <div className="flex items-center">
                  <ProfileButton handleLogout={handleLogout}/>
                </div>
              </div>
            </div>

            {/* Mobile Menu Panel */}
            <DisclosurePanel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </DisclosurePanel>
          </div>
        );
      }}
    </Disclosure>
  );
};

export default Header;
