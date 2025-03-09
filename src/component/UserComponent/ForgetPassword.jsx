import logo from "../../assets/img/appointDoctor.jpg";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import ResetPassword from "./ResetPassword";


const FORGET_URL = "/forget";

const ForgetPassword = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [email, setUser] = useState("");
  const [otp, setOtp] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, otp]);

  const handleOtp = async (e) => {
    e.preventDefault();
    setErrMsg("");
    try {
      const response = await axios.post(FORGET_URL, JSON.stringify({ email }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));
      console.log(response);
      alert("OTP Sent Successfully");
      setIsOtpGenerated(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 404) {
        setErrMsg("couldn't find your email");
      } else {
        setErrMsg("Internal Server Error");
      }
      setIsOtpGenerated(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setErrMsg("");
    try {
      const response = await axios.post(
        "/forget/verify",
        JSON.stringify({ email, otp }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 417) {
        setErrMsg("Wrong OTP");
      } else {
        setErrMsg("Unauthorised");
      }
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(
  //       "/reset",
  //       JSON.stringify({ password }),
  //       {
  //         headers: { "Content-Type": "application/json" },
  //         withCredentials: true,
  //       }
  //     );
  //     console.log(JSON.stringify(response?.data));
  //     console.log(JSON.stringify(response));

  //     setUser("");
  //     setOtp("");
  //     setSuccess(true);
  //     alert("Account Recovered Successfully");
  //   } catch (err) {
  //     if (!err?.response) {
  //       setErrMsg("No Server Response");
  //     } else if (err.response?.status === 404) {
  //       setErrMsg("Missing Username or Password");
  //     } else if (err.response?.status === 401) {
  //       setErrMsg("Unauthorized");
  //     } else {
  //       setErrMsg("Login Failed");
  //     }
  //     errRef.current.focus();
  //   }
  // };

  return (
    <>
      {success ? (
        <section>
          <ResetPassword email={email}/>
        </section>
      ) : (
        <section className="flex min-h-full flex-1 flex-col justify-center px-6 py-5 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img alt="" src={logo} className="mx-auto w-20 rounded-2xl " />
            <h2 className="mt-2 text-center text-2xl font-bold  tracking-tight text-gray-900">
              Recover your account
            </h2>
          </div>
          <section>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
          </section>
          <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
            <form  className="space-y-6">
              <div>
                <div className="flex items-center">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                </div>
                
                  <div className="">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="off"
                      ref={userRef}
                      onChange={(e) => setUser(e.target.value)}
                      value={email}
                      className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <button
                    className="mt-3 flex justify-center items-center rounded-md bg-indigo-600 px-2 py-1.5  text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={handleOtp}
                    disabled={!email}
                  >
                    Generate OTP
                  </button>
                </div>
              

              <div>
                <div className="flex items-center ">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    OTP
                  </label>
                </div>
                
                  <div className="">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      disabled={!isOtpGenerated}
                      onChange={(e) => setOtp(e.target.value)}
                      value={otp}
                      className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mr-1"
                    />
                  </div>
                  <button
                    className="mt-3 flex justify-center items-center rounded-md bg-indigo-600 px-5 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                    onClick={verifyOtp}
                    disabled={!otp}
                  >
                    Verify OTP
                  </button>
              </div>       
              {/* <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Change Password
                </button>
              </div> */}
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              <Link to="/auth.login.user">already a member? </Link>
              <Link
                to="/auth.login.user"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Login
              </Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
};

export default ForgetPassword;
