import logo from "../../assets/img/appointDoctor.jpg";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../GlobalComponent/AuthProvider";
import { useToast } from "@chakra-ui/react";
import { useApiService } from "../../hooks/useAuthWithAxios";

const REGISTER_URL = "/auth/signup";

function InputField({ label, name, type, colSpan }) {
  return (
    <div className={colSpan ? `sm:col-span-${colSpan}` : "sm:col-span-3"}>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        className="mt-1 w-full px-3 py-1 shadow-inner 
                focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 outline-none"
      />
      <div className="text-purple-500 text-sm mt-1">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
}

const SignUp = () => {
  const navigate = useNavigate();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  
  const toast = useToast();
  const api = useApiService();
  const [checked,setChecked] = useState(false);
  
  useEffect(() => {
    if (success) {
      toast({
        position: 'top',
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/auth/login");
    }
  }, [success, navigate]);

  useEffect(() => {
    if (errMsg && errRef.current) {
      errRef.current.focus();
    }
  }, [errMsg]);

  return (
    <>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirm_pass: "",
          roles: ["USER"],
        }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .required("*Required")
            .max(20, "Must be less than 20 letters"),
          lastName: Yup.string()
            .max(20, "Must be less than 20 letters")
            .required("*Required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("*Required"),
          password: Yup.string()
            .min(6, "Must be 6 characters or more")
            .required("*Required"),
          confirm_pass: Yup.string()
            .min(6, "Must be 6 characters or more")
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("*Required"),
        })}
        onSubmit={async (values, actions) => {
          console.log("Submitted roles:", values.roles);
          setErrMsg("");
          setIsLoading(true);
          try {
            const userData = {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              password: values.password,
              roles: values.roles, // user or doctor
            };
            console.log(userData)
            const response = await api.post(REGISTER_URL,userData);
            console.log(response.data);
            setSuccess(true);
            actions.resetForm();
          } catch (err) {
            if (!err?.response) {
              // No response from server
              setErrMsg("No Server Response");
            } else if (err.response?.status === 409) {
              // Username taken
              setErrMsg("Email already in use");
            } else if (err.response?.status === 400) {
              // Bad request (validation error, etc.)
              setErrMsg("Bad Request: " + err.response.data.message);
            } else if (err.response?.status === 500) {
              // Internal server error
              setErrMsg("Internal Server Error");
            } else {
              // Other errors
              setErrMsg("Registration Failed");
            }
            console.error(
              "Error details:",
              err.response?.data || err.message || err
            );
          } finally {
            setIsLoading(false);
            actions.setSubmitting(false);
          }
        }}
      >
        {({ isValid, isSubmitting }) => (
          <section className="min-h-[75vh]  flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300 px-2 py-6">
            <div className="w-full max-w-md px-4 py-6 rounded-2xl sm:shadow-2xl p-2 sm:p-4 backdrop-blur-md bg-white/30 border border-white/40 shadow-2xl">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
                <img
                  alt="Appoint Doctor"
                  src={logo}
                  className="mx-auto w-12 rounded-2xl"
                />
                <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Create your account
                </h2>
              </div>
              <Form>
                <div className="flex justify-center ">
                  <p
                    ref={errRef}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive"
                  >
                    {errMsg}
                  </p>
                </div>
                <div className="flex min-h-full flex-col justify-center px-6 py-2 lg:px-8">
                  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="border-b border-gray-900/10 pb-2">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                        <InputField
                          label="First name"
                          name="firstName"
                          type="text"
                        />
                        <InputField
                          label="Last name"
                          name="lastName"
                          type="text"
                        />
                        <InputField
                          label="Email address"
                          name="email"
                          type="email"
                          colSpan={6}
                        />
                        <InputField
                          label="Create Password"
                          name="password"
                          type="password"
                          colSpan={6}
                        />
                        <InputField
                          label="Confirm Password"
                          name="confirm_pass"
                          type="password"
                          colSpan={6}
                        />
                        <div className="sm:col-span-6">
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            <Field name="roles">
                              {({ form }) => (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={form.values.roles.includes(
                                      "DOCTOR"
                                    )}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setChecked(isChecked);
                                      form.setFieldValue(
                                        "roles",
                                        isChecked
                                          ? ["USER", "DOCTOR"]
                                          : ["USER"]
                                      );
                                    }}
                                  />
                                  <span>Register as a doctor</span>
                                </div>
                              )}
                            </Field>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-center border-b pb-2">
                    <button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="w-full rounded-md bg-gradient-to-br from-blue-600 to-purple-300 hover:bg-gradient-to-br hover:from-blue-400 hover:to-purple-500 px-4 py-2 text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Save
                    </button>
                  </div>
                  <div>
                    <p className="text-center text-sm text-gray-500">
                      <Link to="/auth/login">Already a member? </Link>
                      <Link
                        to="/auth/login"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </div>
              </Form>
            </div>
          </section>
        )}
      </Formik>
    </>
  );
};
export default SignUp;

// import logo from "../../assets/img/appointDoctor.jpg";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Link, useNavigate } from "react-router-dom";
// import { useRef, useState, useEffect } from "react";
// import axios from "../../api/axios";
// import useAuth from "../../hooks/useAuth";
// import { useToast } from "@chakra-ui/react";
// import { 
//   Eye, 
//   EyeOff, 
//   Mail, 
//   Lock, 
//   User, 
//   UserPlus, 
//   AlertCircle,
//   CheckCircle,
//   Loader2,
//   Stethoscope,
//   Shield,
//   Sparkles,
//   Check
// } from "lucide-react";

// const REGISTER_URL = "/auth/signup";

// const ModernInputField = ({ label, name, type, colSpan, icon: Icon, showPasswordToggle, showPassword, onTogglePassword }) => {
//   return (
//     <div className={colSpan ? `col-span-${colSpan}` : "col-span-1"}>
//       <label
//         htmlFor={name}
//         className="block text-sm font-semibold text-gray-700 mb-2"
//       >
//         {label}
//       </label>
//       <div className="relative group">
//         {Icon && (
//           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
//             <Icon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
//           </div>
//         )}
//         <Field name={name}>
//           {({ field, form, meta }) => (
//             <>
//               <input
//                 {...field}
//                 id={name}
//                 type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
//                 className={`relative w-full ${Icon ? 'pl-12' : 'pl-4'} ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-4 bg-gray-50/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white/90 ${
//                   meta.touched && meta.error 
//                     ? 'border-red-300 bg-red-50/80' 
//                     : meta.touched && !meta.error 
//                     ? 'border-green-300 bg-green-50/80' 
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//                 placeholder={`Enter ${label.toLowerCase()}`}
//               />
//               {showPasswordToggle && (
//                 <button
//                   type="button"
//                   onClick={onTogglePassword}
//                   className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:text-blue-500 transition-colors duration-200 z-10"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               )}
//               {meta.touched && !meta.error && (
//                 <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
//                   <CheckCircle className="w-5 h-5 text-green-500" />
//                 </div>
//               )}
//             </>
//           )}
//         </Field>
//         <ErrorMessage
//           name={name}
//           component="div"
//           className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1"
//         />
//       </div>
//     </div>
//   );
// };

// const SignUp = () => {
//   const navigate = useNavigate();
//   const errRef = useRef();
//   const [errMsg, setErrMsg] = useState("");
//   const [success, setSuccess] = useState(false);
//   const { setIsLoading } = useAuth();
//   const [checked, setChecked] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isSubmittingForm, setIsSubmittingForm] = useState(false);
//   const toast = useToast();
  
//   useEffect(() => {
//     if (success) {
//       toast({
//         position: 'top',
//         title: "Account created successfully!",
//         description: "Welcome to our healthcare platform. Please sign in to continue.",
//         status: "success",
//         duration: 5000,
//         isClosable: true,
//       });
//       navigate("/auth/login");
//     }
//   }, [success, navigate, toast]);

//   useEffect(() => {
//     if (errMsg && errRef.current) {
//       errRef.current.focus();
//     }
//   }, [errMsg]);

//   const handleSubmit = async (values, actions) => {
//     console.log("Submitted roles:", values.roles);
//     setErrMsg("");
//     setIsLoading(true);
//     setIsSubmittingForm(true);
    
//     try {
//       const userData = {
//         firstName: values.firstName,
//         lastName: values.lastName,
//         email: values.email,
//         password: values.password,
//         roles: values.roles,
//       };
      
//       const response = await axios.post(
//         REGISTER_URL,
//         JSON.stringify(userData),
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
      
//       console.log(response.data);
//       setSuccess(true);
//       actions.resetForm();
//     } catch (err) {
//       if (!err?.response) {
//         setErrMsg("No Server Response");
//       } else if (err.response?.status === 409) {
//         setErrMsg("Email already in use");
//       } else if (err.response?.status === 400) {
//         setErrMsg("Bad Request: " + err.response.data.message);
//       } else if (err.response?.status === 500) {
//         setErrMsg("Internal Server Error");
//       } else {
//         setErrMsg("Registration Failed");
//       }
//       console.error("Error details:", err.response?.data || err.message || err);
//     } finally {
//       setIsLoading(false);
//       setIsSubmittingForm(false);
//       actions.setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
//       </div>

//       <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
//         <div className="w-full max-w-2xl">
//           {/* Glassmorphism Card */}
//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
//             {/* Card Shine Effect */}
//             <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 pointer-events-none"></div>
            
//             {/* Header */}
//             <div className="text-center mb-8 relative">
//               <div className="relative inline-block mb-4">
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-75 animate-pulse"></div>
//                 <img
//                   alt="HealthCare Logo"
//                   src={logo}
//                   className="relative w-16 h-16 rounded-2xl shadow-lg object-cover border-2 border-white/50"
//                 />
//                 <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
//                   <UserPlus className="w-3 h-3 text-white" />
//                 </div>
//               </div>
              
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
//                 Join Our Platform
//               </h1>
//               <p className="text-gray-600 text-sm font-medium">
//                 Create your account to access quality healthcare services
//               </p>
              
//               {/* Trust Indicators */}
//               <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
//                 <div className="flex items-center gap-1">
//                   <Shield className="w-3 h-3 text-green-500" />
//                   <span>Secure</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Stethoscope className="w-3 h-3 text-blue-500" />
//                   <span>Trusted</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Sparkles className="w-3 h-3 text-purple-500" />
//                   <span>Free</span>
//                 </div>
//               </div>
//             </div>

//             <Formik
//               initialValues={{
//                 firstName: "",
//                 lastName: "",
//                 email: "",
//                 password: "",
//                 confirm_pass: "",
//                 roles: ["USER"],
//               }}
//               validationSchema={Yup.object({
//                 firstName: Yup.string()
//                   .required("*Required")
//                   .max(20, "Must be less than 20 letters")
//                   .min(2, "Must be at least 2 characters"),
//                 lastName: Yup.string()
//                   .max(20, "Must be less than 20 letters")
//                   .min(2, "Must be at least 2 characters")
//                   .required("*Required"),
//                 email: Yup.string()
//                   .email("Invalid email address")
//                   .required("*Required"),
//                 password: Yup.string()
//                   .min(6, "Must be 6 characters or more")
//                   .matches(
//                     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//                     "Must contain uppercase, lowercase, and number"
//                   )
//                   .required("*Required"),
//                 confirm_pass: Yup.string()
//                   .min(6, "Must be 6 characters or more")
//                   .oneOf([Yup.ref("password"), null], "Passwords must match")
//                   .required("*Required"),
//               })}
//               onSubmit={handleSubmit}
//             >
//               {({ isValid, isSubmitting, values, setFieldValue }) => (
//                 <Form className="space-y-6">
//                   {/* Server Error */}
//                   {errMsg && (
//                     <div
//                       ref={errRef}
//                       className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 animate-shake"
//                       role="alert"
//                     >
//                       <div className="flex items-center gap-3">
//                         <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                         <p className="text-red-700 text-sm font-medium">
//                           {errMsg}
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Form Fields Grid */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* First Name */}
//                     <ModernInputField
//                       label="First Name"
//                       name="firstName"
//                       type="text"
//                       icon={User}
//                       colSpan={1}
//                     />

//                     {/* Last Name */}
//                     <ModernInputField
//                       label="Last Name"
//                       name="lastName"
//                       type="text"
//                       icon={User}
//                       colSpan={1}
//                     />
//                   </div>

//                   {/* Email */}
//                   <ModernInputField
//                     label="Email Address"
//                     name="email"
//                     type="email"
//                     icon={Mail}
//                     colSpan={1}
//                   />

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Password */}
//                     <ModernInputField
//                       label="Create Password"
//                       name="password"
//                       type="password"
//                       icon={Lock}
//                       showPasswordToggle={true}
//                       showPassword={showPassword}
//                       onTogglePassword={() => setShowPassword(!showPassword)}
//                       colSpan={1}
//                     />

//                     {/* Confirm Password */}
//                     <ModernInputField
//                       label="Confirm Password"
//                       name="confirm_pass"
//                       type="password"
//                       icon={Lock}
//                       showPasswordToggle={true}
//                       showPassword={showConfirmPassword}
//                       onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
//                       colSpan={1}
//                     />
//                   </div>

//                   {/* Doctor Registration Checkbox */}
//                   <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm border border-blue-200/50 rounded-xl p-6">
//                     <div className="flex items-start gap-4">
//                       <div className="flex items-center h-5">
//                         <Field name="roles">
//                           {({ form }) => (
//                             <input
//                               type="checkbox"
//                               checked={form.values.roles.includes("DOCTOR")}
//                               onChange={(e) => {
//                                 const isChecked = e.target.checked;
//                                 setChecked(isChecked);
//                                 form.setFieldValue(
//                                   "roles",
//                                   isChecked ? ["USER", "DOCTOR"] : ["USER"]
//                                 );
//                               }}
//                               className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200"
//                             />
//                           )}
//                         </Field>
//                       </div>
//                       <div className="flex-1">
//                         <label className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-1">
//                           <Stethoscope className="w-4 h-4 text-blue-500" />
//                           Register as a Healthcare Professional
//                         </label>
//                         <p className="text-xs text-gray-600">
//                           Check this box if you're a licensed healthcare provider. You'll need to verify your credentials later.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Password Requirements */}
//                   <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4">
//                     <h4 className="text-sm font-semibold text-gray-700 mb-3">Password Requirements:</h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
//                       <div className="flex items-center gap-2">
//                         <Check className="w-3 h-3 text-green-500" />
//                         <span className="text-gray-600">At least 6 characters</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Check className="w-3 h-3 text-green-500" />
//                         <span className="text-gray-600">One uppercase letter</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Check className="w-3 h-3 text-green-500" />
//                         <span className="text-gray-600">One lowercase letter</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Check className="w-3 h-3 text-green-500" />
//                         <span className="text-gray-600">One number</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={!isValid || isSubmitting || isSubmittingForm}
//                     className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg relative overflow-hidden group"
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
//                     <div className="relative flex items-center justify-center gap-2">
//                       {(isSubmitting || isSubmittingForm) ? (
//                         <>
//                           <Loader2 className="w-5 h-5 animate-spin" />
//                           <span>Creating Account...</span>
//                         </>
//                       ) : (
//                         <>
//                           <UserPlus className="w-5 h-5" />
//                           <span>Create Account</span>
//                         </>
//                       )}
//                     </div>
//                   </button>
//                 </Form>
//               )}
//             </Formik>

//             {/* Login Link */}
//             <div className="mt-8 text-center">
//               <p className="text-gray-600 text-sm">
//                 Already have an account?{" "}
//                 <Link
//                   to="/auth/login"
//                   className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline"
//                 >
//                   Sign in here
//                 </Link>
//               </p>
//             </div>

//             {/* Security Footer */}
//             <div className="mt-6 pt-6 border-t border-gray-200/50">
//               <p className="text-xs text-center text-gray-500">
//                 🔒 Your information is encrypted and secure
//               </p>
//             </div>
//           </div>

//           {/* Terms and Privacy */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-500">
//               By creating an account, you agree to our{" "}
//               <a href="#" className="text-blue-600 hover:underline font-medium">
//                 Terms of Service
//               </a>{" "}
//               and{" "}
//               <a href="#" className="text-blue-600 hover:underline font-medium">
//                 Privacy Policy
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
//           20%, 40%, 60%, 80% { transform: translateX(2px); }
//         }
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SignUp;