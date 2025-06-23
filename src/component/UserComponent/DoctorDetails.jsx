import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Shimmer from "./Shimmer";
import DoctorCard from "./DoctorCard";
import useAxios from "../../hooks/useAxios";

const DoctorDetails = (doctorData) => {
  const param = useParams();
  const id = param.id;

  const [doctor, setDoctor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {fetchData} = useAxios();

  useEffect(() => {
    getDoctorDetails();
  }, []);

  async function getDoctorDetails() {
    setLoading(true);
    try {
      const url = `/api/public/search?keyword=${id}`;
      const response = await fetchData({
        url : url,
      })
      const json = response?.data;
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
      {/* <header className="bg-white shadow flex">
        <Searchbar
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </header> */}
      <div className="flex justify-center my-2">
        <span className="text-gray-600 text-xl sm:text-2xl text-wrap">Doctor Specialized in {id}</span>
      </div>
      <div className="mx-5 max-w-24xl px-4 py-6 mb-5 sm:px-6 lg:px-8 bg-gray-100 rounded-lg  justify-evenly">
        {doctor?.length === 0 ? (
          <h1>No Doctor Found!!</h1>
        ) : (
          doctor?.map((doc) => {
            return <DoctorCard {...doc} key={doc.id} />;
          })
        )}
      </div>
    </main>
  );
};

export default DoctorDetails;
