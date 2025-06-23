import { useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/img/appointDoctor.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

const LOGIN_URL = "/auth/login";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const errRef = useRef();
  const { fetchData } = useAxios();

  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("*Invalid email address")
      .required("*Email is required"),
    password: Yup.string().required("*Password is required"),
  });

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetchData({
        url: LOGIN_URL,
        method: "POST",
        data: {
          email: values.email,
          password: values.password,
        },
      });

      console.log(response.data);
      const json = response?.data?.body;
      console.log(json);

      const token = json?.token;
      const email = json?.email;
      const roleString = json?.roles || "";
      const fullname = json?.fullname;

      // Convert roles string to array
      const roleArray = roleString.split(",").map((r) => r.trim());

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("role", JSON.stringify(roleArray));
      localStorage.setItem("name", fullname);

      // Update auth context/state
      setAuth({ email, accessToken: token, role: roleArray, fullname });

      // Navigate based on role
      if (roleArray.includes("ROLE_DOCTOR")) {
        navigate("/doctor/doctor-dashboard", { replace: true });
      } else {
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
    }
  };

  return (
    <section className="min-h-[75vh]  flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300 px-4 py-6">
      <div className="w-full max-w-md backdrop-blur-md bg-white/30 rounded-2xl shadow-2xl p-4 border border-white/40">
        <div className="text-center">
          <img
            alt="Logo"
            src={logo}
            className="mx-auto w-16 rounded-2xl shadow-md"
          />
          <h2 className="mt-2 text-xl sm:text-3xl font-bold sm:font-extrabold text-white drop-shadow">
            Sign in to your account
          </h2>
        </div>

        <Formik
          initialValues={{ email: "", password: "", server: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, errors }) => (
            <Form className="mt-2 space-y-6">
              {errors.server && (
                <p
                  ref={errRef}
                  className={errors ? "errmsg" : "offscreen"}
                  aria-live="assertive"
                >
                  {errors.server}
                </p>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="mt-1 w-full px-3 py-1 shadow-inner 
                focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 outline-none"
                  placeholder="Enter email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-purple-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="mt-1 w-full px-3 py-1 shadow-inner 
                focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 outline-none"
                  placeholder="Enter password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-purple-500 text-sm mt-1"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/forget"
                  className="text-purple-400 hover:text-purple-500 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-gradient-to-br from-blue-600 to-purple-300 hover:bg-gradient-to-br hover:from-blue-400 hover:to-purple-500 px-4 py-2 text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-gray-700">
          <Link
            to="/auth/signup"
            className="font-semibold text-purple-400 hover:text-purple-500"
          >
            Not a member?{" "}
          </Link>
          <Link
            to="/auth/signup"
            className="font-semibold text-purple-400 hover:text-purple-500"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
