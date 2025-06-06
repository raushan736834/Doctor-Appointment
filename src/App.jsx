import React, { lazy, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { Provider } from "@/components/ui/provider";
import Header from "./component/UserComponent/Header";
import Body from "./component/UserComponent/Body";
import Footer from "./component/UserComponent/Footer";
import AboutUs from "./component/UserComponent/AboutUs";
import ContactUs from "./component/UserComponent/ContactUS";
import Error from "./component/UserComponent/Error";
import DoctorDetails from "./component/UserComponent/DoctorDetails";
import Login from "./component/AuthComponent/Login";
import SignUp from "./component/AuthComponent/SignUp";
import ForgetPassword from "./component/AuthComponent/ForgetPassword";
import { AuthProvider } from "./component/GlobalComponent/AuthProvider";
import AppointmentDetails from "./component/UserComponent/AppointmentDetails";
import RequireAuth from "./component/GlobalComponent/RequireAuth";
import RequireOnline from "./component/GlobalComponent/RequireOnline";
import DoctorPersonalInfo from "./component/DoctorComponent/DoctorPersonalInfo";
import DoctorProfile1 from "./component/DoctorComponent/DoctorProfile1";
import { DateTimeProvider } from "./component/GlobalComponent/DateTimeProvider";
import UserProfile from "./component/UserComponent/UserProfile";
import ThankYou from "./component/UserComponent/ThankYou";
import BookingDetails from "./component/UserComponent/BookingDetails";
import DoctorDashboard from "./component/DoctorComponent/DoctorDashboard";
import useAuth from "./hooks/useAuth";

// const AppointmentDetails = lazy(() => import("./component/AppointmentDetails"));

const AppLayout = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // useEffect(() => {
  //   if (role === "doctor") {
  //     navigate("/doctor-dashboard");
  //   }
  // }, [role, navigate]);

  return (
    <>
      <Provider>
        <AuthProvider>
          {/* {role !== "doctor" && <Header />} */}
          <Header />
          <DateTimeProvider>
            <div
              style={{
                minHeight: "calc(100vh - 196px)",
              }}
            >
              <Outlet />
            </div>
          </DateTimeProvider>
          {role !== "doctor" && <Footer />}
        </AuthProvider>
      </Provider>
    </>
  );
};

const App = () => {
  const role = localStorage.getItem("role");
  return (
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
            <Route path="auth/signup" element={<SignUp />} />
            <Route element={<RequireAuth />}>
              <Route path="thankyou" element={<ThankYou />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route
                path="appointment-details/:id"
                element={<AppointmentDetails />}
              />
              <Route path="booking-details" element={<BookingDetails />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route
                path="/doctor-personalInfo"
                element={<DoctorPersonalInfo />}
              />
              <Route path="/doctor-profile1" element={<DoctorProfile1 />} />
            </Route>
          </Route>
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
