import logo from "../../assets/img/appointDoctor.jpg"; // Fixed typo in the path
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import Login from "./Login";
import api from "../../hooks/useAxios";

const RESET_URL = "/auth/reset";

const ResetPassword = ({email}) => {
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <>
      {success ? (
        <section>
          <Login />
        </section>
      ) : (
        <Formik
          initialValues={{
            password: "",
            confirm_pass: "",
          }}
          validationSchema={Yup.object({
            password: Yup.string()
              .min(6, "Must be 6 characters or more")
              .required("Required"),
            confirm_pass: Yup.string()
              .min(6, "Must be 6 characters or more")
              .oneOf([Yup.ref("password"), null], "Passwords must match")
              .required("Required"),
          })}
          onSubmit={async (values, actions) => {
            setErrMsg("");
            try {
              const userData = {
                password: values.password,
                email
              };
              const response = await api.post(
                RESET_URL,
                JSON.stringify(userData),
                {
                  headers: { "Content-Type": "application/json" },
                  withCredentials: true,
                }
              );
              console.log(response.data);
              alert("Password Change Successfully");
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
              errRef.current.focus();
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
            {/* console.log(email); */}
          {({ isValid, isSubmitting }) => (
            <>
              <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6">
                <img
                  alt="Appoint Doctor"
                  src={logo}
                  className="mx-auto w-12 rounded-2xl"
                />
                <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Reset Password
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
                <div className="flex min-h-full flex-col justify-center px-6 py-4 lg:px-8">
                  <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="border-b border-gray-900/10 pb-4">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Create New Password
                          </label>
                          <Field
                            id="password"
                            name="password"
                            type="password"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          <div className="text-sm text-red-700">
                            <ErrorMessage name="password" />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label
                            htmlFor="confirm_pass"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Confirm New Password
                          </label>
                          <Field
                            id="confirm_pass"
                            name="confirm_pass"
                            type="password"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          <div className="text-sm text-red-700">
                            <ErrorMessage name="confirm_pass" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-center border-b pb-2">
                    <button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="rounded-md bg-indigo-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-24"
                    >
                      Change
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
            </>
          )}
        </Formik>
      )}
    </>
  );
};

export default ResetPassword;
