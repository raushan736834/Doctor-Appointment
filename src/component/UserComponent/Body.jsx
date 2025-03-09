import { useEffect, useState } from "react";
import SpecialistCard from "./SpecialistCard";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";
import useOnline from "../../hooks/useOnline";

function filterData(searchText, data) {
  const filterData = data.filter((ele) =>
    ele?.text?.toLowerCase()?.includes(searchText.toLowerCase())
  );
  return filterData;
}

const Body = () => {
  const [searchText, setSearchText] = useState("");
  const [allSpecialist, setAllSpecialist] = useState([]);
  const [filteredSpecialist, setFilteredSpecialist] = useState([]);
  const isOnline = useOnline();

  useEffect(() => {
    if (isOnline) {
      getSpecialist();
    }
  }, [isOnline]);

  async function getSpecialist() {
    try {
      const url = `https://raushan736834.github.io/host_api/doctorCheckAPI.json`;
      const data = await fetch(url);
      const json = await data.json();
      setAllSpecialist(json);
      setFilteredSpecialist(json);
    } catch (error) {
      console.log(error);
    }
    // setLoading(false);
  }

  const handleSearch = () => {
    const filteredData = filterData(searchText, allSpecialist);
    setFilteredSpecialist(filteredData);
  };

  if (!allSpecialist) return null;

  return allSpecialist.length === 0 ? (
    <Shimmer />
  ) : (
    <>
      <header className="bg-white shadow flex">
        <Searchbar
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
        />
      </header>
      <main className="flex justify-center">
        <div className="mx-20 max-w-6xl px-4 py-6 my-5 sm:px-6 lg:px-8 bg-gray-200 rounded-lg flex flex-wrap justify-evenly">
          {/* Your content */}
          {filteredSpecialist?.length === 0 ? (
            <h1>No Specialist Found!!</h1>
          ) : (
            filteredSpecialist?.map((clinic) => {
              return (
                <Link to={"/specialist/" + clinic.text}>
                  <SpecialistCard {...clinic} key={clinic.id} />
                </Link>
              );
            })
          )}
        </div>
      </main>
    </>
  );
};

export default Body;
