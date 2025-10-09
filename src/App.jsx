import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import ErrorBoundary from "./component/Common/ErrorBoudary";

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
import Index from "./component/UserComponent/Homepage/Index";
import ScrollToTop from "./component/Common/ScrollToTop";
import DoctorProfile from "./component/UserComponent/DoctorProfile";
import DoctorOnboarding from "./component/DoctorComponent/DoctorOnboarding";
import { useAuth } from "./component/GlobalComponent/AuthProvider";
import UserLayout from "./layouts/UserLayout";
import { useAuthWithAxios } from "./hooks/useAuthWithAxios";

const AppLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Fix: Add leading slashes to pathname comparisons
    const authRoutes = ["/auth/login", "/auth/signup", "/forget"];
    const isAuthRoute = authRoutes.includes(pathname);
    
    // Only redirect if user is authenticated AND currently on an auth route
    if (isAuthenticated && isAuthRoute) {
      console.log("Redirecting authenticated user from auth route to home");
      navigate("/", { replace: true });
    }
  }, [pathname, isAuthenticated, navigate]); // Add navigate to dependencies

  return (
    <div
      style={{
        minHeight: "calc(100vh - 196px)",
      }}
    >
      <Outlet />
    </div>
  );
};

const AppContent = () => {
  const auth = useAuthWithAxios();
  const email = auth?.email;
  return (
    <NotificationProvider userEmail={email}>
      <Router future={{ v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route element={<RequireOnline />}>
              <Route element={<UserLayout />}>
                <Route index element={<Index />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="contact" element={<ContactUs />} />
                <Route path="specialist/:id" element={<DoctorDetails />} />
                <Route path="auth/login" element={<Login />} />
                <Route path="forget" element={<ForgetPassword />} />
                <Route path="/search/doctor" element={<DoctorCard />} />
                <Route path="auth/signup" element={<SignUp />} />
                <Route
                  path="specialist/:specialist/:doctorId"
                  element={<DoctorProfile />}
                />
                <Route element={<RequireAuth />}>
                  <Route
                    path="/notifications"
                    element={<NotificationDashboard userEmail={email} />}
                  />
                  <Route path="thankyou" element={<ThankYou />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route
                    path="/appointment-details/:id"
                    element={<AppointmentDetails />}
                  />
                  <Route path="booking-details" element={<BookingDetails />} />
                </Route>
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES.doctor]} />}>
                <Route path="doctor" element={<DoctorLayout />}>
                  <Route
                    index
                    element={<Navigate to="dashboard" replace />}
                  />
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  <Route
                    path="doctorOnboarding"
                    element={<DoctorOnboarding />}
                  />
                  <Route
                    path="personalInfo"
                    element={<DoctorPersonalInfo />}
                  />
                  <Route path="appointments" element={<Appointments />} />
                  <Route path="settings" element={<DoctorSetting />}>
                    <Route
                      index
                      element={<Navigate to="doctor-profile" replace />}
                    />
                    <Route
                      path="doctor-profile"
                      element={<DoctorPersonalInfo />}
                    />
                    <Route path="security" element={<SecurityPassword />} />
                  </Route>
                  <Route
                    path="notifications"
                    element={<NotificationDashboard />}
                  />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
};

const App = () => {
  return (
    <>
      <ErrorBoundary>
        <ChakraProvider>
          <AuthProvider>
            <DateTimeProvider>
              <AppContent />
            </DateTimeProvider>
          </AuthProvider>
        </ChakraProvider>
      </ErrorBoundary>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
