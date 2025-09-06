// import { useRef, useEffect, useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import useAuth from "../../hooks/useAuth";
// import logo from "../../assets/img/appointDoctor.jpg";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import useAxios from "../../hooks/useAxios";
// import { useToast } from "@chakra-ui/react";
// import api from "../../hooks/useAxios";

// const LOGIN_URL = "/auth/login";

// const Login = () => {
//   const { setAuth } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/";
//   const errRef = useRef();
//   const toast = useToast();

//   const validationSchema = Yup.object({
//     email: Yup.string()
//       .email("*Invalid email address")
//       .required("*Email is required"),
//     password: Yup.string().required("*Password is required"),
//   });

//   const handleLogin = async (values, { setSubmitting, setErrors }) => {
//     try {
//       const data= {
//           email: values.email,
//           password: values.password,
//         }
//       const json = await api.post(LOGIN_URL, data);

//       const token = json.data?.token;
//       const email = json.data?.email;
//       const roleString = json.data?.roles || "";
//       const fullname = json.data?.fullname;
//       const refreshToken = json.data?.refreshToken;

//       const roleArray = roleString.split(",").map((r) => r.trim());
//       localStorage.setItem("token", token);
//       localStorage.setItem("email", email);
//       localStorage.setItem("role", JSON.stringify(roleArray));
//       localStorage.setItem("name", fullname);
//       localStorage.setItem("refreshToken",refreshToken);
      
//       if(roleString === "ROLE_USER,ROLE_DOCTOR"){
//         const doctorId = json.data?.doctorId;
//         localStorage.setItem("doctorId",doctorId);
//       }

//       setAuth({ email, accessToken: token, role: roleArray, fullname });

//       if (roleArray.includes("ROLE_DOCTOR")) {
//         toast({
//           position: "top-right",
//           title: "Login successful!",
//           description: `Welcome back, Doctor. ${fullname}`,
//           status: "success",
//           duration: 2000,
//           isClosable: true,
//           containerStyle: { marginTop: 20, marginRight: 5 },
//         });
//         navigate("/doctor/dashboard", { replace: true });
//       } else {
//         toast({
//           position: "top-right",
//           title: "Login successful!",
//           description: `Welcome back, ${fullname || email}!`,
//           status: "success",
//           duration: 2000,
//           isClosable: true,
//           containerStyle: { marginTop: 20, marginRight: 5,color: "whiteAlpha.50" },
//         });
//         if (from.includes("ROLE_DOCTOR")) {
//           navigate("/");
//         } else {
//           navigate(from, { replace: true });
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       const backendMessage =
//         err.response?.data?.message || err.message || "Login Failed";
//       setErrors({ server: backendMessage });
//       errRef.current?.focus();
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <section className="min-h-[75vh]  flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300 px-4 py-6">
//       <div className="w-full max-w-md backdrop-blur-md bg-white/30 rounded-2xl shadow-2xl p-4 border border-white/40">
//         <div className="text-center">
//           <img
//             alt="Logo"
//             src={logo}
//             className="mx-auto w-16 rounded-2xl shadow-md"
//           />
//           <h2 className="mt-2 text-xl sm:text-3xl font-bold sm:font-extrabold text-white drop-shadow">
//             Sign in to your account
//           </h2>
//         </div>

//         <Formik
//           initialValues={{ email: "", password: "", server: "" }}
//           validationSchema={validationSchema}
//           onSubmit={handleLogin}
//         >
//           {({ isSubmitting, errors }) => (
//             <Form className="mt-2 space-y-6">
//               {errors.server && (
//                 <p
//                   ref={errRef}
//                   className={errors ? "errmsg" : "offscreen"}
//                   aria-live="assertive"
//                 >
//                   {errors.server}
//                 </p>
//               )}

//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Email address
//                 </label>
//                 <Field
//                   id="email"
//                   name="email"
//                   type="email"
//                   className="mt-1 w-full px-3 py-1 shadow-inner 
//                 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 outline-none"
//                   placeholder="Enter email"
//                 />
//                 <ErrorMessage
//                   name="email"
//                   component="div"
//                   className="text-purple-500 text-sm mt-1"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Password
//                 </label>
//                 <Field
//                   id="password"
//                   name="password"
//                   type="password"
//                   className="mt-1 w-full px-3 py-1 shadow-inner 
//                 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 outline-none"
//                   placeholder="Enter password"
//                 />
//                 <ErrorMessage
//                   name="password"
//                   component="div"
//                   className="text-purple-500 text-sm mt-1"
//                 />
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <Link
//                   to="/forget"
//                   className="text-purple-400 hover:text-purple-500 font-semibold"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full rounded-md bg-gradient-to-br from-blue-600 to-purple-300 hover:bg-gradient-to-br hover:from-blue-400 hover:to-purple-500 px-4 py-2 text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
//               >
//                 {isSubmitting ? "Signing in..." : "Sign in"}
//               </button>
//             </Form>
//           )}
//         </Formik>

//         <p className="mt-6 text-center text-sm text-gray-700">
//           <Link
//             to="/auth/signup"
//             className="font-semibold text-purple-400 hover:text-purple-500"
//           >
//             Not a member?{" "}
//           </Link>
//           <Link
//             to="/auth/signup"
//             className="font-semibold text-purple-400 hover:text-purple-500"
//           >
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </section>
//   );
// };

// export default Login;

import { useRef, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/img/appointDoctor.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import api from "../../hooks/useAxios";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Stethoscope,
  Shield,
  Sparkles
} from "lucide-react";

const LOGIN_URL = "/auth/login";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const errRef = useRef();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("*Invalid email address")
      .required("*Email is required"),
    password: Yup.string().required("*Password is required"),
  });

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    setIsLoading(true);
    try {
      const data = {
        email: values.email,
        password: values.password,
      };
      const json = await api.post(LOGIN_URL, data);

      const token = json.data?.token;
      const email = json.data?.email;
      const roleString = json.data?.roles || "";
      const fullname = json.data?.fullname;
      const refreshToken = json.data?.refreshToken;

      const roleArray = roleString.split(",").map((r) => r.trim());
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("role", JSON.stringify(roleArray));
      localStorage.setItem("name", fullname);
      localStorage.setItem("refreshToken", refreshToken);

      if (roleString === "ROLE_USER,ROLE_DOCTOR") {
        const doctorId = json.data?.doctorId;
        localStorage.setItem("doctorId", doctorId);
      }

      setAuth({ email, accessToken: token, role: roleArray, fullname });

      if (roleArray.includes("ROLE_DOCTOR")) {
        toast({
          position: "top-right",
          title: "Login successful!",
          description: `Welcome back, Doctor. ${fullname}`,
          status: "success",
          duration: 2000,
          isClosable: true,
          containerStyle: { marginTop: 20, marginRight: 5 },
        });
        navigate("/doctor/dashboard", { replace: true });
      } else {
        toast({
          position: "top-right",
          title: "Login successful!",
          description: `Welcome back, ${fullname || email}!`,
          status: "success",
          duration: 2000,
          isClosable: true,
          containerStyle: { marginTop: 20, marginRight: 5 },
        });
        if (from.includes("ROLE_DOCTOR")) {
          navigate("/");
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      console.error(err);
      const backendMessage =
        err.response?.data?.message || err.message || "Login Failed";
      setErrors({ server: backendMessage });
      errRef.current?.focus();
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
            {/* Card Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 pointer-events-none"></div>
            
            {/* Header */}
            <div className="text-center mb-8 relative">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                <img
                  alt="HeyDoctor Logo"
                  src={logo}
                  className="relative w-16 h-16 rounded-2xl shadow-lg object-cover border-2 border-white/50"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                Sign in to access your HeyDoctor dashboard
              </p>
            </div>

            <Formik
              initialValues={{ email: "", password: "", server: "" }}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting, errors, values, touched }) => (
                <Form className="space-y-6">
                  {/* Server Error */}
                  {errors.server && (
                    <div
                      ref={errRef}
                      className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 animate-shake"
                      role="alert"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm font-medium">
                          {errors.server}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className={`w-5 h-5 transition-colors z-10 duration-200 ${
                          touched.email && !errors.email 
                            ? 'text-green-500' 
                            : touched.email && errors.email 
                            ? 'text-red-500' 
                            : 'text-gray-400 group-focus-within:text-blue-500'
                        }`} />
                      </div>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white/90 ${
                          touched.email && errors.email 
                            ? 'border-red-300 bg-red-50/80' 
                            : touched.email && !errors.email 
                            ? 'border-green-300 bg-green-50/80' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm font-medium flex items-center gap-1"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className={`w-5 h-5 transition-colors duration-200 z-10 ${
                          touched.password && !errors.password 
                            ? 'text-green-500' 
                            : touched.password && errors.password 
                            ? 'text-red-500' 
                            : 'text-gray-400 group-focus-within:text-blue-500'
                        }`} />
                      </div>
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`w-full pl-12 pr-12 py-4 bg-gray-50/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white/90 ${
                          touched.password && errors.password 
                            ? 'border-red-300 bg-red-50/80' 
                            : touched.password && !errors.password 
                            ? 'border-green-300 bg-green-50/80' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:text-blue-500 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm font-medium flex items-center gap-1"
                    />
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end">
                    <Link
                      to="/forget"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      {(isSubmitting || isLoading) ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Signing you in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  </button>
                </Form>
              )}
            </Formik>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;