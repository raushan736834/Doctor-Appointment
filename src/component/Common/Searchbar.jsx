import { useState, useEffect } from "react";
import useAxios from "@/hooks/useAxios";
import image from "../../assets/img/defaultClinicImage.jpg"

const Searchbar = ({ searchText, onChange, onSearch }) => {
  const [doctorData, setDoctorData] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { fetchData } = useAxios();

  async function getDoctor() {
    const response = await fetchData({
      url: `/api/doctors/search?keyword=${searchText}`,
    });
    const data = response?.data;
    console.log(data);
    setDoctorData(data);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchText == "") getDoctor();
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  useEffect(() => {
    if (doctorData && Array.isArray(doctorData)) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [doctorData]);

  const handleSuggestionClick = (suggestion) => {
    onChange({ target: { value: suggestion.doctorName } });
    setShowSuggestions(false);
  };

  return (
    <div className="mx-auto max-w-8xl px-4 py-4 sm:px-6 lg:px-8 relative">
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
          onFocus={() =>
            doctorData && doctorData.length > 0 && setShowSuggestions(true)
          }
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        <button
          className="w-full sm:w-auto px-6 py-2 bg-gray-500 text-gray-200 font-medium rounded-md hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={onSearch}
        >
          Search
        </button>
      </div>
      {showSuggestions && doctorData.length > 0 && searchText && (
        <ul className="absolute top-[60px] left-0 right-0 bg-white border border-gray-300 rounded-md max-h-64 overflow-y-auto z-10 m-0 p-0 list-none shadow-lg">
          {doctorData.map((suggestion, idx) => (
            <>
              <li
                key={idx}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className={`flex items-center p-2 cursor-pointer gap-3 hover:bg-gray-200 transition-colors`}
              >
                <img
                  src={suggestion.profilePhoto || image}
                  alt={suggestion.doctorName}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-base font-medium text-gray-900">{suggestion.doctorName}</span>
                  <span className="text-sm text-gray-500 mt-0.5">{suggestion.specialization}</span>
                </div>
              </li>
              {idx !== doctorData.length - 1 && <hr className="border-t border-gray-200 mx-2" />}
            </>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Searchbar;
