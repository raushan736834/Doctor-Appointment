import { useState, useEffect } from "react";

const Searchbar = ({ searchText, onChange, onSearch }) => {
  const [doctorData, setDoctorData] = useState([]);

  useEffect(() => {
    getDoctor();
  }, []);

  async function getDoctor() {
    const url = `https://raushan736834.github.io/host_api/DoctorData.json`;
    const data = await fetch(url);
    const json = await data.json();
    setDoctorData(json);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
        <input
          type="text"
          className="w-full sm:w-80 px-4 py-2 border-2 rounded-lg border-gray-500"
          placeholder="Search doctors, clinics, hospitals"
          value={searchText}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
        />
        <button
          className="w-full sm:w-auto px-6 py-2 bg-gray-500 text-gray-200 font-medium rounded-md hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={onSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
