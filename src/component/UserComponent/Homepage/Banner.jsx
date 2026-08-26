import React, { useState } from "react";
import { Search, MapPin, Stethoscope, Navigation, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApiService } from "../../../hooks/useAuthWithAxios";

const SEARCH_URL = "api/public/searchByCityAndSpecialist";
const NEARBY_URL = "api/public/nearby";

const GEO = { IDLE: "idle", REQUESTING: "requesting", DETECTED: "detected", DENIED: "denied", ERROR: "error" };

const Banner = ({ specialists, cities, isLoading, setIsLoading }) => {
  const [err, setErr] = useState("");
  const [searchMode, setSearchMode] = useState("manual"); // "manual" | "nearby"

  // Manual mode state
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Near Me state
  const [geoState, setGeoState] = useState(GEO.IDLE);
  const [coords, setCoords] = useState(null);

  const api = useApiService();
  const navigate = useNavigate();

  /* ── Geolocation ── */
  const requestGeolocation = () => {
    setErr("");
    if (!navigator.geolocation) {
      setGeoState(GEO.DENIED);
      return;
    }
    setGeoState(GEO.REQUESTING);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState(GEO.DETECTED);
      },
      (e) => {
        setGeoState(e.code === e.PERMISSION_DENIED ? GEO.DENIED : GEO.ERROR);
      },
      { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
    );
  };

  const handleModeSwitch = (mode) => {
    setSearchMode(mode);
    setErr("");
    // Auto-request location the first time user switches to Near Me
    if (mode === "nearby" && geoState === GEO.IDLE) {
      requestGeolocation();
    }
  };

  /* ── Search ── */
  const handleSearch = async () => {
    setErr("");

    if (searchMode === "manual") {
      if (!selectedCity || !selectedSpecialist) {
        setErr("Please select both city and specialist.");
        return;
      }
      setIsLoading(true);
      try {
        const response = await api.get(SEARCH_URL, { city: selectedCity, specialist: selectedSpecialist });
        if (response?.success) {
          navigate(`/specialist/${encodeURIComponent(selectedSpecialist)}`, {
            state: { doctors: Array.isArray(response.data) ? response.data : [], flag: true },
          });
        } else {
          setErr(response?.error || "Failed to search doctors. Please try again.");
        }
      } catch {
        setErr("Failed to search doctors. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Near Me mode
    if (!coords) {
      setErr("Please allow location access first.");
      return;
    }
    if (!selectedSpecialist) {
      setErr("Please select a specialist type.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post(NEARBY_URL, {
        latitude: coords.lat,
        longitude: coords.lng,
        specialist: selectedSpecialist,
      });
      const doctors = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      navigate(`/specialist/${encodeURIComponent(selectedSpecialist)}`, {
        state: { doctors, flag: true },
      });
    } catch (error) {
      setErr(error?.message || "Failed to find nearby doctors. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Shared Search Panel (used in both mobile & desktop) ── */
  const SearchPanel = () => (
    <div>
      {/* Toggle */}
      <div className="flex items-center bg-gray-100 rounded-xl p-1 mb-4">
        <button
          onClick={() => handleModeSwitch("manual")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
            searchMode === "manual"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Manual
        </button>
        <button
          onClick={() => handleModeSwitch("nearby")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
            searchMode === "nearby"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          Near Me
        </button>
      </div>

      {/* Error message */}
      {err && (
        <div className="flex items-center gap-2 text-red-500 text-sm mb-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* Form body */}
      {searchMode === "manual" ? (
        /* ── Manual Search ── */
        <div className="flex flex-col sm:flex-row gap-3">
          {/* City */}
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 appearance-none bg-white"
            >
              <option value="" disabled>City</option>
              {(Array.isArray(cities) ? cities : [])
                .filter((c) => typeof c === "string" && c.trim())
                .map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
            </select>
          </div>

          {/* Specialist */}
          <div className="relative flex-1">
            <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <select
              value={selectedSpecialist}
              onChange={(e) => setSelectedSpecialist(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 appearance-none bg-white"
            >
              <option value="" disabled>Specialist</option>
              {(Array.isArray(specialists) ? specialists : []).map((s) => (
                <option key={s.id} value={s.specialist}>{s.specialist}</option>
              ))}
            </select>
          </div>

          {/* Search button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleSearch}
              disabled={isLoading || !selectedCity || !selectedSpecialist}
              className="w-full sm:w-auto bg-blue-900 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg transition-colors duration-200 shadow-lg flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      ) : (
        /* ── Near Me Search ── */
        <div className="flex flex-col gap-3">
          {/* Location status row */}
          {geoState === GEO.IDLE && (
            <button
              onClick={requestGeolocation}
              className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Tap to detect my location
            </button>
          )}

          {geoState === GEO.REQUESTING && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="text-sm text-blue-700 font-medium">Detecting your location…</span>
            </div>
          )}

          {geoState === GEO.DETECTED && coords && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-green-600 font-medium">Location detected</p>
                <p className="text-sm text-gray-700 font-semibold truncate">
                  {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
                </p>
              </div>
              <button
                onClick={requestGeolocation}
                className="text-xs text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                Refresh
              </button>
            </div>
          )}

          {(geoState === GEO.DENIED || geoState === GEO.ERROR) && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-amber-700">
                  {geoState === GEO.DENIED
                    ? "Location access denied."
                    : "Could not detect location."}
                </p>
              </div>
              <button
                onClick={requestGeolocation}
                className="text-xs text-blue-600 hover:underline flex-shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Specialist */}
          <div className="relative">
            <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <select
              value={selectedSpecialist}
              onChange={(e) => setSelectedSpecialist(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 appearance-none bg-white"
            >
              <option value="" disabled>Specialist</option>
              {(Array.isArray(specialists) ? specialists : []).map((s) => (
                <option key={s.id} value={s.specialist}>{s.specialist}</option>
              ))}
            </select>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={isLoading || geoState !== GEO.DETECTED || !selectedSpecialist}
            className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Find Doctors Near Me
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-xl" />
            <div className="absolute top-20 -left-10 w-32 h-32 bg-white/3 rounded-full blur-lg" />
            <div className="absolute bottom-10 right-20 w-24 h-24 bg-white/4 rounded-full blur-md" />
          </div>

          {/* ── Mobile + Tablet layout ── */}
          <div className="relative block lg:hidden p-6">
            {/* Text and Image Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
              {/* Heading */}
              <div className="flex-1 space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                  <span className="block">
                    Book{" "}
                    <span className="relative">
                      your
                      <svg className="absolute -top-2 -right-4 w-10 h-6 text-white/30" viewBox="0 0 48 32" fill="none">
                        <path d="M2 15c7-3 14-3 21 0s14 3 21 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </span>
                  <span className="block">appointment</span>
                  <span className="block">
                    online with <span className="text-yellow-300">HeyDoctor</span>
                  </span>
                </h1>
                <div className="flex justify-end pr-4 sm:pr-8">
                  <svg className="w-12 h-8 text-white/40" viewBox="0 0 64 48" fill="none">
                    <path d="M5 25c15-8 30-8 45 0 3 2 6 4 9 7m-9-7l6-3m-6 3l3 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Doctor Image */}
              <div className="relative flex justify-center sm:justify-end flex-shrink-0">
                <div className="relative">
                  <div className="w-48 h-60 sm:w-52 sm:h-64 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=600&fit=crop&crop=face"
                      alt="Professional doctor with stethoscope"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-300 rounded-full opacity-80" />
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm" />
                </div>
              </div>
            </div>

            {/* Search panel */}
            <div className="bg-white rounded-2xl p-6 shadow-xl z-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Your Doctor</h2>
              <SearchPanel />
            </div>
          </div>

          {/* ── Desktop layout ── */}
          <div className="relative hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center md:p-8 lg:p-12">
            {/* Left */}
            <div className="space-y-8 z-10">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  <span className="block">
                    Book{" "}
                    <span className="relative">
                      your
                      <svg className="absolute -top-2 -right-4 w-12 h-8 text-white/30" viewBox="0 0 48 32" fill="none">
                        <path d="M2 15c7-3 14-3 21 0s14 3 21 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </span>
                  <span className="block">appointment</span>
                  <span className="block">
                    online with <span className="text-yellow-300">HeyDoctor</span>
                  </span>
                </h1>
                <div className="flex justify-end pr-8 md:pr-16">
                  <svg className="w-16 h-12 text-white/40" viewBox="0 0 64 48" fill="none">
                    <path d="M5 25c15-8 30-8 45 0 3 2 6 4 9 7m-9-7l6-3m-6 3l3 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Search panel */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Your Doctor</h2>
                <SearchPanel />
              </div>
            </div>

            {/* Right — Doctor Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-80 lg:w-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=600&fit=crop&crop=face"
                    alt="Professional doctor with stethoscope"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rounded-full opacity-80" />
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm" />
                <svg className="absolute top-12 -right-8 w-16 h-20 text-white/20" viewBox="0 0 64 80" fill="none">
                  <path d="M8 8c8 16 16 32 8 48s-8 16 8 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <svg className="absolute bottom-16 -left-12 w-20 h-16 text-white/15" viewBox="0 0 80 64" fill="none">
                  <path d="M8 32c16-8 32-8 48 0s16 16 24-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
