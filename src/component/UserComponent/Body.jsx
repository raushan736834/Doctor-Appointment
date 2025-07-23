import { useEffect, useState } from "react";
import SpecialistCard from "./SpecialistCard";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import Searchbar from "../Common/Searchbar";
import useOnline from "../../hooks/useOnline";
import useAxios from "../../hooks/useAxios";
import api from "../../hooks/useAxios";

function filterData(searchText, data) {
  const filterData = data.filter((ele) =>
    ele?.text?.toLowerCase()?.includes(searchText.toLowerCase())
  );
  return filterData;
}

const SPECIALIST_URL = "api/public/getSpecialist";

const Body = () => {
  const [searchText, setSearchText] = useState("");
  const [allSpecialist, setAllSpecialist] = useState([]);
  const isOnline = useOnline();
  const { loading } = useAxios();

  useEffect(() => {
    if (isOnline) {
      getSpecialist();
    }
  }, [isOnline]);

  async function getSpecialist() {
    try {
      const response = await api.get(SPECIALIST_URL);
      const json = response.data;
      setAllSpecialist(json);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = () => {
    const filteredData = filterData(searchText, allSpecialist);
  };

  if (!allSpecialist) return null;

  return loading ? (
    <Shimmer />
  ) : (
    <>
      <HeaderSection
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
      />
      <CategoryTitle />
      <main className="flex justify-center">
        <SpecialistList allSpecialist={allSpecialist} />
      </main>
    </>
  );
};

function HeaderSection({ searchText, setSearchText, handleSearch }) {
  return (
    <header className="bg-white shadow flex">
      <Searchbar
        searchText={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onSearch={handleSearch}
      />
    </header>
  );
}

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
  console.log(allSpecialist)
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
