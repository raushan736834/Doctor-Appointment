import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  HashRouter as Router,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Header from "./component/UserComponent/Header";
import Body from "./component/UserComponent/Body";
import Footer from "./component/UserComponent/Footer";
import AboutUs from "./component/UserComponent/AboutUs";
import ContactUs from "./component/UserComponent/ContactUS";
import DoctorDetails from "./component/UserComponent/DoctorDetails";
import Login from "./component/AuthComponent/Login";
import SignUp from "./component/AuthComponent/SignUp";
import ForgetPassword from "./component/AuthComponent/ForgetPassword";
import { AuthProvider } from "./component/GlobalComponent/AuthProvider";
import AppointmentDetails from "./component/UserComponent/AppointmentDetails";
import RequireAuth from "./component/GlobalComponent/RequireAuth";
import RequireOnline from "./component/GlobalComponent/RequireOnline";
import DoctorPersonalInfo from "./component/DoctorComponent/DoctorPersonalInfo";
import { DateTimeProvider } from "./component/GlobalComponent/DateTimeProvider";
import UserProfile from "./component/UserComponent/UserProfile";
import ThankYou from "./component/UserComponent/ThankYou";
import BookingDetails from "./component/UserComponent/BookingDetails";
import DoctorDashboard from "./component/DoctorComponent/DoctorDashboard";
import DoctorCard from "./component/UserComponent/DoctorCard";
import { ROLES } from "./constants/slots";
import Appointments from "./component/DoctorComponent/Appointments";
import DoctorLayout from "./component/DoctorComponent/DoctorLayout";
import DoctorSetting from "./component/DoctorComponent/DoctorSetting";
import { Navigate } from "react-router-dom";
import PageNotFound from "./component/Common/PageNotFound";
import { NotificationProvider } from "./component/NotificationComponent/NotificationContext";
import NotificationDashboard from "./component/NotificationComponent/NotificationDashboard";
import SecurityPassword from "./component/DoctorComponent/SecurityPassword";

const AppLayout = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const { pathname } = useLocation();

  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    const cond =
      pathname === "auth/login" ||
      pathname === "auth/signup" ||
      pathname === "/forget";
    if (accessToken && cond) {
      navigate("/", { redirect: true });
    }
  }, [pathname]);

  return (
    <>
      <ChakraProvider>
        <AuthProvider>
          {(!role || role.includes(ROLES.doctor) === false) && <Header />}
          <DateTimeProvider>
            <div
              style={{
                minHeight: "calc(100vh - 196px)",
              }}
            >
              <Outlet />
            </div>
            {/* <ToastContainer /> */}
          </DateTimeProvider>
          {(!role || role.includes(ROLES.doctor) === false) && <Footer />}
        </AuthProvider>
      </ChakraProvider>
    </>
  );
};

const email = localStorage.getItem("email");
const App = () => {
  return (
    <NotificationProvider userEmail={email}>
      <Router future={{ v7_relativeSplatPath: true }}>
      <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route element={<RequireOnline />}>
              <Route index element={<Body />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="specialist/:id" element={<DoctorDetails />} />
              <Route path="auth/login" element={<Login />} />
              <Route path="forget" element={<ForgetPassword />} />
              <Route path="/search/doctor" element={<DoctorCard />} />
              <Route path="auth/signup" element={<SignUp />} />
              <Route element={<RequireAuth />}>
                <Route
                  path="/notifications"
                  element={<NotificationDashboard userEmail={email} />}
                />
                <Route path="thankyou" element={<ThankYou />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route
                  path="appointment-details/:id"
                  element={<AppointmentDetails />}
                />
                <Route path="booking-details" element={<BookingDetails />} />
                <Route path="doctor" element={<DoctorLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  <Route path="personalInfo" element={<DoctorPersonalInfo />} />
                  <Route path="appointments" element={<Appointments />} />
                  <Route path="settings" element={<DoctorSetting />}>
                    <Route index element={<Navigate to="doctor-profile" replace />} />
                    <Route path="doctor-profile" element={<DoctorPersonalInfo />} />
                    <Route path="security" element={<SecurityPassword />} />
                  </Route>
                  <Route path="notifications" element={<NotificationDashboard />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
    </NotificationProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
