import { useEffect, useState } from "react";
import SpecialistCard from "./SpecialistCard";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnline from "../../hooks/useOnline";
import useAuth from "../../hooks/useAuth";
import api from "../../hooks/useAxios";

const SPECIALIST_URL = "api/public/getSpecialist";

const Body = () => {
  const [searchText, setSearchText] = useState('');
  const [allSpecialist, setAllSpecialist] = useState([]);
  const isOnline = useOnline();
  const {isLoading,setIsLoading} = useAuth();

  useEffect(() => {
    if (isOnline) {
      getSpecialist();
    }
  }, [isOnline]);

  async function getSpecialist() {
    try {
      setIsLoading(true);
      const response = await api.get(SPECIALIST_URL);
      const json = response.data;
      setAllSpecialist(json);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally{
      setIsLoading(false);
    }
  }

  if (!allSpecialist) return null;

  return isLoading ? (
    <Shimmer />
  ) : (
    <>
      <CategoryTitle />
      <main className="flex justify-center">
        <SpecialistList allSpecialist={allSpecialist} />
      </main>
    </>
  );
};



function CategoryTitle() {
  return (
    <div className="justify-center flex m-3">
      <span className="text-xl sm:text-2xl text-gray-600">
        Specialized Category
      </span>
    </div>
  );
}

function SpecialistList({ allSpecialist }) {
  return (
    <div className="mx-5 px-4 mb-5 sm:px-6 lg:px-8 bg-white rounded-lg flex flex-wrap justify-evenly">
      {allSpecialist?.length === 0 ? (
        <h1>No Specialist Found!!</h1>
      ) : (
        allSpecialist?.map((clinic) => (
          <Link to={"/specialist/" + clinic?.specialist} key={clinic.id}>
            <SpecialistCard {...clinic} />
          </Link>
        ))
      )}
    </div>
  );
}

export default Body;
