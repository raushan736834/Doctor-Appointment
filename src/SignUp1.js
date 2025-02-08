import logo from "./assests/img/appointDoctor.jpg";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const SignUp1 = () => {
  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        securityAnswer: "",
      }}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("First Name Required"),
        lastName: Yup.string()
          .max(20, "Must be 20 characters or less")
          .required("Last Name Required"),
        securityAnswer: Yup.string()
          .max(20, "Must be 20 characters or less")
          .required("Security field can't be empty"),
        email: Yup.string()
          .email("Invalid email address")
          .required("email field can't be empty"),
        phone: Yup.string()
          .test(
            "len",
            "Phone number must be exactly 10 digits",
            (val) => val && val.length === 10
          )
          .required("Phone Number is required"),
        password: Yup.string()
          .min(6, "Must be 6 characters or more")
          .required("Password field can't be empty"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          // Perform actions such as API calls, form data processing, etc.
          setSubmitting(false);
        }, 400);
      }}
    >
      <Form action="" method="post">
        <div className="flex min-h-full flex-col justify-center px-6 py-4 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img alt="" src={logo} className="mx-auto w-12 rounded-2xl" />
            <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Create your account1
            </h2>
          </div>

          <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="">
              <div className="border-b border-gray-900/10 pb-4">
                <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      First name
                    </label>
                    <div className="">
                      <Field
                        id="firstName"
                        name="firstName"
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="text-sm text-red-700">
                        <ErrorMessage name="firstName" />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Last name
                    </label>
                    <div className="">
                      <Field
                        id="lastName"
                        name="lastName"
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="text-sm text-red-700">
                        <ErrorMessage name="lastName" />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="w-full">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        // className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="text-sm text-red-700">
                        <ErrorMessage name="email" />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone Number
                    </label>
                    <div className="">
                      <Field
                        id="phone"
                        name="phone"
                        type="number"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="text-sm text-red-700">
                        <ErrorMessage name="phone" />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Create Password
                    </label>
                    <div className="">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="text-sm text-red-700">
                        <ErrorMessage name="password" />
                      </div>
                    </div>
                  </div>

                  {/* <div className="sm:col-span-6 flex gap-x-2">
                    <label
                      htmlFor="security"
                      className="block text-sm font-medium leading-8 text-gray-900"
                    >
                      Security Question
                    </label>
                    <div className="flex-1">
                      <select
                        id="securtiy"
                        name="Security"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value=" Option 1">Your Lucky Number</option>
                        <option value="Option 2 ">Your School Name</option>
                        <option value="Option 3">Your Childhood Friend</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-6 flex gap-x-2 justify-between">
                    <div className="gap-x-6 ">
                      <label
                        htmlFor="securityAnswer"
                        className="block text-sm font-medium leading-8 text-gray-900 mr-3"
                      >
                        Security Answer
                      </label>
                    </div>
                    <div className="sm:col-span-4">
                      <Field
                        id="securityAnswer"
                        name="securityAnswer"
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="text-sm text-red-700">
                        <ErrorMessage name="securityAnswer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
                  <div className="sm:col-span-6 flex flex-wrap gap-x-2 justify-between">
                    <div className="w-full sm:w-1/2 md:flex-1">
                      <label
                        htmlFor="security"
                        className="block text-sm font-medium leading-8 text-gray-900"
                      >
                        Security Question
                      </label>
                      <div className="flex-1">
                        <select
                          id="security"
                          name="Security"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option value="Option 1">Your Lucky Number</option>
                          <option value="Option 2 ">Your School Name</option>
                          <option value="Option 3">
                            Your Childhood Friend
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        htmlFor="securityAnswer"
                        className="block text-sm font-medium leading-8 text-gray-900"
                      >
                        Security Answer
                      </label>
                      <Field
                        id="securityAnswer"
                        name="securityAnswer"
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="text-sm text-red-700">
                        <ErrorMessage name="securityAnswer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex justify-center border-b pb-2">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-24"
              >
                Save
              </button>
            </div>
            <div>
              <p className=" text-center text-sm text-gray-500">
                <Link to="/auth.login.user">already a member?{" "}</Link>
                <Link
                  to="/auth.login.user"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default SignUp1;
