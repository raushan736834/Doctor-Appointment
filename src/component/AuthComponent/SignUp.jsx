import logo from "../../assets/img/appointDoctor.jpg";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/components/ui/radio";
import useAuth from "@/hooks/useAuth";

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
  const { setIsLoading } = useAuth();

  useEffect(() => {
    if (success) {
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
          accountFor: "user",
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
          setErrMsg("");
          setIsLoading(true);
          try {
            const userData = {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              password: values.password,
              roles: values.accountFor, // user or doctor
            };
            const response = await axios.post(
              REGISTER_URL,
              JSON.stringify(userData),
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );
            console.log(response.data);
            alert("Account Created Successfully");
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
                        {/* <div className="sm:col-span-6">
                          <label
                            htmlFor="accountFor"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Creating Account For?
                          </label>
                          <Field name="accountFor">
                            {({ field }) => (
                              <RadioGroup
                                {...field}
                                colorPalette="black"
                                variant="subtle"
                              >
                                <HStack gap="10">
                                  <Radio value="user">User</Radio>
                                  <Radio value="doctor">Doctor</Radio>
                                </HStack>
                              </RadioGroup>
                            )}
                          </Field>
                        </div> */}
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
