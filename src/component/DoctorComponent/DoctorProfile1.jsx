import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../api/axios";

const DoctorProfile1 = () => {
  const [name, setName] = useState();
  const [fetchName, setFetchName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("first");

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/user/${email}`);
      setFetchName(response.data);
      console.log(response);
      setLoading(false); // Set loading to false after data is fetched
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // useEffect to call fetchData when the component mounts
  useEffect(() => {
    // fetchUserData();
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          specialization: "",
          gender: "",
          city: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .required("Required")
            .max(40, "Must be less than 40 Character"),
          specialization: Yup.string().required("Specialization is required"),
          gender: Yup.string().required("Gender is required"),
          city: Yup.string().required("City is required"),
        })}
      >
        {({ isValid, isSubmitting }) => (
          <section className="sm:max-w-screen-2xl">
            <div className="h-20 bg-gray-300 flex justify-start">
              <span className="text-2xl font-medium m-5">Profile</span>
            </div>
            <div className="sm:max-w-md">
              <div className="m-5 text-2xl font-medium">
                Hello Dr. {fetchName}! Let's build your dedicated
                profile.
              </div>
              <Form>
                <div className="ml-5 text-sm font-medium">
                  Section-A: Profile details
                </div>
                <div className="my-1 ml-5">
                  <label className="text-xs text-gray-600" htmlFor="name">
                    Name
                  </label>
                  <div className="flex mt-1">
                    <div className="border-[1px] border-gray-400 p-2 border-solid">
                      Dr./Mr./Ms.
                    </div>
                    <Field
                      id="name"
                      name="name"
                      autoComplete="off"
                      onChange={setName}
                      className="border-y-[1px] rounded-r border-gray-400 border-r sm:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="text-sm text-red-700">
                      <ErrorMessage name="name" />
                    </div>
                  </div>
                </div>
                <div className="my-1 ml-5 flex flex-col sm:w-[355px]">
                  <label className="text-xs text-gray-600 my-2">
                    Specialization
                  </label>
                  <Field
                    as="select"
                    name="specialization"
                    className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      select an option
                    </option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </Field>
                  <div className="text-sm text-red-700">
                    <ErrorMessage name="specialization" />
                  </div>
                </div>
                <div className="my-1 ml-5 flex flex-col sm:w-[355px]">
                  <label className="text-xs text-gray-600 my-2">Gender</label>
                  <div className="flex justify-start">
                    <label className="mr-5">
                      <Field type="radio" name="gender" value="male" className="my-2 mr-2"/>
                      Male
                    </label>

                    <label className="mx-5">
                      <Field type="radio" name="gender" value="female" className="m-2"/>
                      Female
                    </label>
                    <label className="mx-5">
                      <Field type="radio" name="gender" value="other" className="m-2"/>
                      Other
                    </label>
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

export default DoctorProfile1;
