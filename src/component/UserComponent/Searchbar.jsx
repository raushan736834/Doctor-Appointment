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
    // console.log(json);
    setDoctorData(json);
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <input
        type="text"
        className="p-2 m-4 justify-center border-2 md:w-80 max-w-7xl tracking-normal rounded-lg border-gray-500"
        placeholder="Search doctors, clinics, hospitals"
        value={searchText}
        onChange={onChange}
      />
      <button
        className=" inline-flex items-center font-medium justify-center rounded-md p-2 bg-gray-500 text-gray-200 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        onClick={onSearch}
      >
        Search
      </button>
    </div>
  );
};

export default Searchbar;
