import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Shimmer from "./Shimmer";
import DoctorCard from "./DoctorCard";
import Searchbar from "./Searchbar";

const DoctorDetails = () => {
  const param = useParams();
  const id = param.id;
  
  const [searchText,setSearchText] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDoctorDetails();
  }, []);

  async function getDoctorDetails() {
    setLoading(true);
    try {
      const url = `https://raushan736834.github.io/host_api/${id}.json`;
      const data = await fetch(url);
      const json = await data.json();
      console.log(json);
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

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main className="flex flex-col">
      <header className="bg-white shadow flex">
        <Searchbar
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch=""
        />
      </header>
      <div className="mx-20 max-w-24xl px-4 py-6 my-5 sm:px-6 lg:px-8 bg-gray-100 rounded-lg  justify-evenly">
        {doctor?.length === 0 ? (
          <h1>No Specialist Found!!</h1>
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
