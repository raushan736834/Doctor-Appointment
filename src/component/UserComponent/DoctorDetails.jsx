import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Shimmer from "./Shimmer";
import DoctorCard from "./DoctorCard";
import api from "../../hooks/useAxios";

const DoctorDetails = () => {
  const param = useParams();
  const id = param.id;
  const location = useLocation();
  const doctorFromState = location.state && location.state.doctor;
  const [doctor, setDoctor] = useState(doctorFromState ? [doctorFromState] : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorFromState) {
      getDoctorDetails();
    }
  }, [id]);

  async function getDoctorDetails() {
    setLoading(true);
    try {
      const url = `/api/public/search?keyword=${id}`;
      const response = await api.get(url);
      const json = response?.data;
      console.log(json)
      setDoctor(json);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Shimmer />;
  }
  //  console.log(doctor)

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main className="flex flex-col">
      <div className="flex justify-center my-2">
        <span className="text-gray-600 text-xl sm:text-2xl text-wrap">Doctor Specialized in {id}</span>
      </div>
      <div className="mx-5 max-w-24xl px-4 py-6 mb-5 sm:px-6 lg:px-8 bg-gray-100 rounded-lg  justify-evenly">
        {doctor?.length === 0 ? (
          <h1>No Doctor Found!!</h1>
        ) : (
          doctor?.map((doc) => {
            return <div key={doc.id} className="p-2"><DoctorCard {...doc} /></div>;
          })
        )}
      </div>
    </main>
  );
};

export default DoctorDetails;
