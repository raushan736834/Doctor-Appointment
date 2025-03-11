import defaultDoctorImage from "../../assets/img/defaultClinicImage.jpg";
import AppointmentForm from "./AppointmentForm";
import { useState } from "react";

const DoctorCard = ({
  id,
  profile_photo,
  doctor_name,
  experience_years,
  locality,
  specialization,
  consultation_fees,
  clinic_name,
  city,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);

  const handleClick = (id, specialization) => {
    if (selectedId === id) {
      setSelectedId(null);
      setSelectedSpecialization(null); // Hide the form if it's already open
    } else {
      setSelectedId(id);
      setSelectedSpecialization(specialization); // Show the form if it's not open
      localStorage.setItem("specialization", specialization);
    }
  };

  return (
    <div className="bg-white m-3 max-w-20xl hover:bg-gray-300 rounded-xl">
      <div>
        <div className="flex justify-between">
          <div className="flex max-w-[85%]">
            <div>
              <img
                src={profile_photo.url || defaultDoctorImage}
                className="rounded-full aspect-square max-w-36 m-10"
              />
            </div>
            <div className="mr-40 ">
              <h2 className="font-bold text-xl mt-10 text-cyan-800">
                {doctor_name}
              </h2>
              <div>
                <div className="my-1.5 ">
                  <span className="text-sm ">{specialization}</span>
                </div>
                <div className="mb-1.5">
                  <span className="text-sm">
                    {experience_years} years experience overall
                  </span>
                </div>
              </div>
              <div className="flex">
                <div>
                  <span className="font-medium text-sm ">{locality}, </span>
                  <span className="text-small-big font-medium  ">
                    {city || ""}
                  </span>
                </div>
                <span className="mx-2 font-bold"> • </span>
                <div>
                  <span className="text-sm ">{clinic_name}</span>
                </div>
              </div>
              <div className="border-b-2 border-black">
                <span className="text-small-big">
                  ₹{consultation_fees} consultation fee at clinic
                </span>
              </div>
            </div>
          </div>
          <div className=" flex-col mr-20  content-center">
            <div className="flex justify-center">
              <div className="">
                <span>Available Today</span>
              </div>
            </div>
            <div className="">
              <button
                className="w-48 py-5 bg-sky-500/100 hover:bg-sky-600 rounded-md text-white font-semibold"
                onClick={() => handleClick(id, specialization)}
              >
                Book Clinic Visit
              </button>
            </div>
          </div>
        </div>
        {selectedId === id && (
          <AppointmentForm id={selectedId} specialization={selectedSpecialization} />
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
