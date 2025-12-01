import React, { useState } from "react";
import { Search, MapPin, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApiService } from "../../../hooks/useAuthWithAxios";

const SEARCH_URL = "api/public/searchByCityAndSpecialist";

const Banner = ({ specialists, cities, isLoading, setIsLoading }) => {
  const [err, setErr] = useState();
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [successFetch, setSuccessFetch] = useState(false);
  const api = useApiService();
  const navigate = useNavigate();

  const handleSearch = async () => {
    console.log(selectedCity);
    console.log(selectedSpecialist);
    if (!selectedCity || !selectedSpecialist) {
      setErr("Please select both city and specialist");
      return;
    }
    console.log(selectedSpecialist);

    setIsLoading(true);
    try {
      const response = await api.get(SEARCH_URL, {
        city: selectedCity,
        specialist: selectedSpecialist,
      });
      console.log("Search results:", response);
      if (response?.success) {
        setDoctors(Array.isArray(response.data) ? response.data : []);
        setSuccessFetch(true);
      } else {
        setErr(
          response?.error || "Failed to search doctors. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error searching doctors:", error);
      setErr("Failed to search doctors. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successFetch) {
    navigate(`/specialist/${encodeURIComponent(selectedSpecialist)}`, {
      state: { doctors: doctors, flag: true },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute top-20 -left-10 w-32 h-32 bg-white/3 rounded-full blur-lg"></div>
            <div className="absolute bottom-10 right-20 w-24 h-24 bg-white/4 rounded-full blur-md"></div>
          </div>

          {/* Mobile + Tablet - Stacked Layout */}
          <div className="relative block lg:hidden p-6">
            {/* Text and Image Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
              {/* Main Heading */}
              <div className="flex-1 space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                  <span className="block">
                    Book{" "}
                    <span className="relative">
                      your
                      <svg
                        className="absolute -top-2 -right-4 w-10 h-6 text-white/30"
                        viewBox="0 0 48 32"
                        fill="none"
                      >
                        <path
                          d="M2 15c7-3 14-3 21 0s14 3 21 0"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </span>
                  <span className="block">appointment</span>
                  <span className="block">
                    online with{" "}
                    <span className="text-yellow-300">HeyDoctor</span>
                  </span>
                </h1>

                {/* Curved arrow decoration */}
                <div className="flex justify-end pr-4 sm:pr-8">
                  <svg
                    className="w-12 h-8 text-white/40"
                    viewBox="0 0 64 48"
                    fill="none"
                  >
                    <path
                      d="M5 25c15-8 30-8 45 0 3 2 6 4 9 7m-9-7l6-3m-6 3l3 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Doctor Image - Smaller */}
              <div className="relative flex justify-center sm:justify-end flex-shrink-0">
                <div className="relative">
                  <div className="w-48 h-60 sm:w-52 sm:h-64 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=600&fit=crop&crop=face"
                      alt="Professional doctor with stethoscope"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Decorative elements around image */}
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-300 rounded-full opacity-80"></div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm"></div>
                </div>
              </div>
            </div>

            {/* Search Form Below */}
            <div className="bg-white rounded-2xl p-6 shadow-xl z-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Find Your Doctor
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* City Input */}
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
    focus:border-transparent text-gray-700 appearance-none bg-white"
                  >
                    <option value="" disabled>
                      City
                    </option>
                    {(Array.isArray(cities) ? cities : [])
                      .filter(
                        (city) => typeof city === "string" && city.trim() !== ""
                      )
                      .map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Category Input */}
                <div className="relative flex-1">
                  <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedSpecialist}
                    onChange={(e) => {
                      console.log(e.target);
                      setSelectedSpecialist(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent text-gray-700 appearance-none bg-white"
                  >
                    <option value="" disabled>
                      Specialist
                    </option>
                    {(Array.isArray(specialists) ? specialists : []).map(
                      (specialist) => (
                        <option
                          key={specialist.id}
                          value={specialist.specialist}
                        >
                          {specialist.specialist}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Search Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={handleSearch}
                    disabled={isLoading || !selectedCity || !selectedSpecialist}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 shadow-lg flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Large Tablets and Desktop - Side by Side Layout */}
          {/* Desktop - Side by Side Layout */}
          <div className="relative hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center md:p-8 lg:p-12">
            {/* Left Content */}
            <div className="space-y-8 z-10">
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  <span className="block">
                    Book{" "}
                    <span className="relative">
                      your
                      <svg
                        className="absolute -top-2 -right-4 w-12 h-8 text-white/30"
                        viewBox="0 0 48 32"
                        fill="none"
                      >
                        <path
                          d="M2 15c7-3 14-3 21 0s14 3 21 0"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </span>
                  <span className="block">appointment</span>
                  <span className="block">
                    online with{" "}
                    <span className="text-yellow-300">HeyDoctor</span>
                  </span>
                </h1>

                {/* Curved arrow decoration */}
                <div className="flex justify-end pr-8 md:pr-16">
                  <svg
                    className="w-16 h-12 text-white/40"
                    viewBox="0 0 64 48"
                    fill="none"
                  >
                    <path
                      d="M5 25c15-8 30-8 45 0 3 2 6 4 9 7m-9-7l6-3m-6 3l3 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Search Form */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Find Your Doctor
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* City Input */}
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
    focus:border-transparent text-gray-700 appearance-none bg-white"
                    >
                      <option value="" disabled>
                        City
                      </option>
                      {(Array.isArray(cities) ? cities : [])
                        .filter(
                          (city) =>
                            typeof city === "string" && city.trim() !== ""
                        )
                        .map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Clinic Input */}
                  {/* <div className="relative flex-1">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Clinic"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                  </div> */}

                  {/* Category Input */}
                  <div className="relative flex-1">
                    <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedSpecialist}
                      onChange={(e) => {
                        setSelectedSpecialist(e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 appearance-none bg-white"
                    >
                      <option value="" disabled>
                        Specialist
                      </option>
                      {(Array.isArray(specialists) ? specialists : []).map(
                        (specialist) => (
                          <option
                            key={specialist.id}
                            value={specialist.specialist}
                          >
                            {specialist.specialist}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Search Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={handleSearch}
                      disabled={
                        isLoading || !selectedCity || !selectedSpecialist
                      }
                      className="w-full sm:w-auto bg-blue-900 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 shadow-lg
                       flex items-center justify-center  disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Doctor Image */}
              <div className="relative">
                <div className="w-64 h-80 lg:w-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=600&fit=crop&crop=face"
                    alt="Professional doctor with stethoscope"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Decorative elements around image */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rounded-full opacity-80"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm"></div>

                {/* Floating decorative line */}
                <svg
                  className="absolute top-12 -right-8 w-16 h-20 text-white/20"
                  viewBox="0 0 64 80"
                  fill="none"
                >
                  <path
                    d="M8 8c8 16 16 32 8 48s-8 16 8 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                <svg
                  className="absolute bottom-16 -left-12 w-20 h-16 text-white/15"
                  viewBox="0 0 80 64"
                  fill="none"
                >
                  <path
                    d="M8 32c16-8 32-8 48 0s16 16 24-8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
