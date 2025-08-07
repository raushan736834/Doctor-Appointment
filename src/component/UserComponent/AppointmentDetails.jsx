import React, { useRef, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import defaultImage from "../../assets/img/defaultClinicImage.jpg";
import useAuth from "../../hooks/useAuth";
import * as Yup from "yup";
import useDate from "../../hooks/useDate";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { format } from "date-fns";
import useRazorpayScript from "../../hooks/useRazorpayScript";
import api from "../../hooks/useAxios";
import { AppointmentStatus } from "../../constants/slots";

const BOOKED_URL = "/appointment/book-appointment";
const FETCH_DOCTOR_DATA = "/api/user/getDoctor";

const AppointmentDetails = () => {
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const { auth, setIsLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data } = useDate();
  const date = data.selectedDate;
  const time = data.slot;
  const period = data.selectedPeriod;
  const specialization = data.specialization;
  const { id } = useParams();
  const [filteredSpecialist, setFilteredSpecialist] = useState();
  const email = localStorage.getItem("email");
  const accessToken = auth.accessToken;
  const [fetchName, setFetchName] = useState(
    localStorage.getItem("name") || ""
  );
  const [doctorProfileLink, setDoctorProfileLink] = useState("");
  const [error, setError] = useState(null);
  const Navigate = useNavigate();

  useRazorpayScript();

  const doctorDetails = filteredSpecialist || {};
  useEffect(() => {
    getDoctorDetails();
  }, []);

  useEffect(() => {
    if (doctorDetails?.profilePhoto) {
      setDoctorProfileLink(doctorDetails.profilePhoto);
    } else {
      setDoctorProfileLink(defaultImage);
    }
  }, [doctorDetails]);

  async function getDoctorDetails() {
    const save = {
      specialization,
      id,
    };
    setIsLoading(true);
    try {
      const response = await api.post(FETCH_DOCTOR_DATA, save);
      const data = response?.data;
      console.log(data);
      setFilteredSpecialist(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setErrMsg("");
    setIsSubmitting(true);

    try {
      const receipt = uuid();
      const formattedDate = format(new Date(date), "yyyy-MM-dd");
      const appointmentId = uuid();

      const appointmentBooking = {
        appointmentId,
        email,
        status: AppointmentStatus.BOOKED,
        time,
        period,
        doctorName: doctorDetails?.doctor_name,
        specialization,
        date: formattedDate,
        fullName:
          values.selectedPatient === "option1"
            ? values.fullName
            : values.patientFullName,
        doctor: { id },
        patientEmail:
          values.selectedPatient === "option2" ? values.patientEmail : "",
        selectedPayment:
          values.selectedPayment === "option3"
            ? "Online Payment"
            : "Pay at Clinic",
        phone: values.phone,
        selectedPatient:
          values.selectedPatient === "option1" ? fetchName : "someone else",
      };

      if (values.selectedPayment === "option3") {
        // Online Payment with Razorpay
        const paymentInitData = {
          amount: doctorDetails.consultationFees * 100, // paise
          currency: "INR",
          receipt: receipt,
        };

        const razorResponse = await api.post(
          "/api/payment/create-order",
          paymentInitData
        );
        const { orderId, amount, currency, key } = razorResponse.data;

        if (!window.Razorpay) {
          alert("Razorpay SDK not loaded");
          return;
        }

        const options = {
          key,
          amount,
          currency,
          name: "AppointDoctor",
          description: "Consultation Fee",
          image: "/logo.png",
          order_id: orderId,
          handler: async function (response) {
            const {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            } = response;

            const verificationData = {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            };

            const verifyResponse = await api.post(
              "/api/payment/verify",
              verificationData
            );

            if (verifyResponse.data.status !== "success") {
              alert("Payment verification failed!");
              return;
            }

            const body = {
              formData: appointmentBooking,
              payment: {
                receiptId: receipt,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                doctorId: id,
              },
            };

            console.log("Sending payload:", body);
            const res = await api.post(BOOKED_URL, body);
            console.log("Booking response:", res);
            Navigate("/thankyou", {
              state: {
                date,
                time,
                doctorName: doctorDetails?.doctorName,
                appointmentLocation: doctorDetails?.clinicName,
              },
            });
          },
          prefill: {
            name: appointmentBooking.fullName,
            email: email,
            contact: values.phone,
          },
          notes: {
            appointmentId,
            doctorId: id,
          },
          theme: {
            color: "#6B46C1",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Pay at Clinic flow
        const body = {
          formData: appointmentBooking,
          payment: null, // if your backend expects null
        };

        console.log("Sending payload:", body);
        const res = await api.post(BOOKED_URL, body);
        console.log("Booking response:", res);
        Navigate("/thankyou", {
          state: {
            date,
            time,
            doctorName: doctorDetails?.doctorName,
            appointmentLocation: doctorDetails?.clinicName,
          },
        });
      }
    } catch (err) {
      console.error(err);
      setErrMsg(
        err?.response?.status === 500
          ? "Internal Server Error"
          : "Booking Failed"
      );
      errRef.current.focus();
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <>
      {!accessToken ? (
        Navigate("/auth/login")
      ) : (
        <section className="flex flex-col sm:flex-row lg:px-36 min-h-screen justify-center bg-gradient-to-br from-blue-200 to-purple-300">
          <div className="w-full sm:m-3 lg:m-4 p-4 flex flex-col bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-xl">
            {/* Doctor Details Section */}
            <DoctorDetailsSection
              calender={<Calendar/>}
              date={date}
              time={time}
              clock={<Clock />}
              specialization={specialization}
              doctorDetails={doctorDetails}
              doctorProfileLink={doctorProfileLink}
            />
          </div>
          <div className="w-full sm:m-3 lg:m-4 p-4 flex flex-col bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-xl">
            <PatientDetailsSection
              email={email}
              errRef={errRef}
              errMsg={errMsg}
              isSubmitting={isSubmitting}
              fetchName={fetchName}
              doctorDetails={doctorDetails}
              handleSubmit={handleSubmit}
            />
          </div>
        </section>
      )}
    </>
  );
};

export default AppointmentDetails;

function DoctorDetailsSection({
  date,
  time,
  specialization,
  doctorDetails,
  doctorProfileLink,
}) {
  return (
    <>
      <div className="border-b-2 ">
        <div className="m-3">
          <p className="font-semibold text-[17px]">In Clinic Appointment</p>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex mx-3">
          <div className="w-4 h-4 mt-1">
            <Calendar />
          </div>
          <span className="ml-1 text-gray-700">On </span>
          <span className="mx-1 font-semibold text-gray-700">
            {date &&
              new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </span>
        </div>
        <div className="flex mx-3">
          <div className="w-4 h-4 mt-1">
            <Clock />
          </div>
          <span className="ml-1 text-gray-700">At</span>
          <span className="mx-1 font-semibold text-gray-700">{time}</span>
        </div>
      </div>
      <div className="border-b-2 ">
        <div className="mx-3 mb-3">
          <Link to={"/specialist/" + specialization} className="">
            <span className="text-sm text-purple-400 font-semibold">
              Change Date & Time
            </span>
          </Link>
        </div>
      </div>
      <div className="border-b-2 my-2">
        {doctorDetails && (
          <div className="flex m-3">
            <div>
              <img
                src={doctorProfileLink || defaultImage}
                className="w-24 rounded-sm h-28"
              />
            </div>
            <div className="mx-2 flex flex-col mb-3">
              <span className="font-medium text-gray-500 text-[17px]">
                {doctorDetails?.doctorName}
              </span>
              <span>
                {doctorDetails?.qualifications?.map((ele) => (
                  <span
                    className="text-sm text-gray-500"
                    key={ele?.qualification}
                  >
                    {ele?.qualification},{" "}
                  </span>
                ))}
              </span>
              <span className="text-gray-500 text-sm">
                {doctorDetails?.specialization}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center mb-3">
        <span className="text-xl text-gray-500">Clinic Location</span>
        <div className="flex flex-col">
          <div>
            <span className="text-sm text-gray-500">
              {doctorDetails?.clinicName},
            </span>
          </div>
          <div className="flex justify-center">
            <span className="text-sm mx-1 text-gray-500">
              {" "}
              {doctorDetails?.locality}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function PatientDetailsSection({
  email,
  errRef,
  errMsg,
  isSubmitting,
  fetchName,
  doctorDetails,
  handleSubmit,
}) {
  return (
    <div className="p-3 bg-white/30 backdrop-blur-lg border border-white/20 shadow-2xl rounded-xl text-gray-700">
      <div className="mb-2">
        <span className="text-2xl font-semibold text-black">
          Patient Details
        </span>
      </div>
      <div>
        <span className="text-gray-700 text-sm font-semibold">
          This in-clinic appointment is for:
        </span>
      </div>

      <Formik
        initialValues={{
          selectedPatient: "option1",
          fullName: "",
          patientFullName: "",
          email: email,
          patientEmail: "",
          phone: "",
          selectedPayment: "option4",
        }}
        validationSchema={Yup.object({
          fullName: Yup.string().when("selectedPatient", {
            is: "option1",
            then: (schema) =>
              schema
                .required("*Name Required")
                .max(20, "Must be less than 20 letters"),
            otherwise: (schema) => schema.notRequired(),
          }),
          patientFullName: Yup.string().when("selectedPatient", {
            is: "option2",
            then: (schema) =>
              schema
                .required("*Patient Name Required")
                .max(20, "Must be less than 20 letters"),
            otherwise: (schema) => schema.notRequired(),
          }),
          patientEmail: Yup.string().when("selectedPatient", {
            is: "option2",
            then: (schema) =>
              schema
                .email("*Invalid email address")
                .required("*Email Required"),
            otherwise: (schema) => schema.notRequired(),
          }),
        })}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="flex flex-col">
            <div className="flex justify-center">
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
            </div>

            <div className="my-1 border border-white/30 bg-white/50 backdrop-blur-sm p-2 rounded-md">
              <label className="p-2 text-sm">
                <Field
                  type="radio"
                  name="selectedPatient"
                  value="option1"
                  className="mr-2"
                  onChange={() => setFieldValue("selectedPatient", "option1")}
                />
                {fetchName}
              </label>
            </div>
            <div className="border border-white/30 bg-white/50 backdrop-blur-sm p-2 mb-2 rounded-md">
              <label className="p-2 text-sm">
                <Field
                  type="radio"
                  name="selectedPatient"
                  value="option2"
                  className="mr-2"
                  onChange={() => setFieldValue("selectedPatient", "option2")}
                />
                Someone Else
              </label>
            </div>

            <span className="text-sm font-semibold text-gray-700">
              Please provide the following information:
            </span>

            {values.selectedPatient === "option1" && (
              <>
                <label
                  className="text-sm mt-2 text-gray-700"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <Field
                  type="text"
                  placeholder="Enter Your Full Name"
                  id="fullName"
                  name="fullName"
                  autoComplete="off"
                  className="bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-purple-500 text-sm"
                />
              </>
            )}

            {values.selectedPatient === "option2" && (
              <>
                <label
                  className="text-sm mt-2 text-gray-700"
                  htmlFor="patientFullName"
                >
                  Patient's Full Name
                </label>
                <Field
                  type="text"
                  placeholder="Enter Patient's Full Name"
                  id="patientFullName"
                  name="patientFullName"
                  autoComplete="off"
                  className="bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <ErrorMessage
                  name="patientFullName"
                  component="div"
                  className="text-purple-500 text-sm"
                />
              </>
            )}

            <label className="text-sm mt-2 text-gray-700" htmlFor="email">
              Email
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              value={email}
              placeholder="Enter Your Email"
              readOnly
              autoComplete="off"
              className="bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 outline-none cursor-not-allowed"
            />

            {values.selectedPatient === "option2" && (
              <>
                <label
                  className="text-sm mt-2 text-gray-700"
                  htmlFor="patientEmail"
                >
                  Patient's Email
                </label>
                <Field
                  id="patientEmail"
                  name="patientEmail"
                  type="text"
                  placeholder="Enter Patient's Email"
                  autoComplete="off"
                  className="bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800  focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <ErrorMessage
                  name="patientEmail"
                  component="div"
                  className="text-purple-500 text-sm"
                />
              </>
            )}

            <label className="text-sm mt-2 text-gray-700" htmlFor="phone">
              Phone Number
            </label>
            <Field
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter Your Phone Number (Optional)"
              autoComplete="off"
              className="bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300e"
            />

            <div className="mt-2 mb-2 text-sm font-semibold text-gray-700">
              Choose a payment option to Book Appointment:
            </div>
            <div className="border my-1 border-white/30 bg-white/50 backdrop-blur-sm p-2 rounded-md">
              <label className="p-2 text-sm">
                <Field
                  type="radio"
                  name="selectedPayment"
                  value="option3"
                  className="mr-2"
                  onChange={() => setFieldValue("selectedPayment", "option3")}
                />
                ₹{doctorDetails.consultation_fees} Pay Online
              </label>
            </div>
            <div className="border border-white/30 bg-white/50 backdrop-blur-sm p-2 mb-2 rounded-md">
              <label className="p-2 text-sm">
                <Field
                  type="radio"
                  name="selectedPayment"
                  value="option4"
                  className="mr-2"
                  onChange={() => setFieldValue("selectedPayment", "option4")}
                />
                ₹{doctorDetails.consultation_fees} Pay later at the clinic
              </label>
            </div>

            {/* Dark Styled Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full py-2 px-4 bg-gradient-to-br from-blue-600 to-purple-300 hover:bg-gradient-to-br hover:from-blue-400 hover:to-purple-500 text-white rounded-md hover:bg-gray-900 transition-all duration-300 font-semibold"
            >
              Book Clinic Visit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
