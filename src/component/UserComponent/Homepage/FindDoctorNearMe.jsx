import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Stethoscope, Search, AlertCircle, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApiService } from "../../../hooks/useAuthWithAxios";

const NEARBY_DOCTORS_URL = "api/public/doctors/nearby";
const CITIES_URL = "api/public/cities";

const GEO_STATES = {
  IDLE: "idle",
  REQUESTING: "requesting",
  DETECTED: "detected",
  DENIED: "denied",
  ERROR: "error",
};

const FindDoctorNearMe = ({ specialists = [] }) => {
  const api = useApiService();
  const navigate = useNavigate();

  const [geoState, setGeoState] = useState(GEO_STATES.IDLE);
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [detectedCity, setDetectedCity] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(""); // for manual fallback
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [pulse, setPulse] = useState(false);

  // Fetch cities for fallback manual picker
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get(CITIES_URL);
        if (response?.success) {
          const fetched = response.data;
          setCities(Array.isArray(fetched) ? fetched : fetched?.cities ?? []);
        }
      } catch {
        // silently ignore — cities are only for the fallback UI
      }
    };
    fetchCities();
  }, []);

  const requestGeolocation = () => {
    setError("");
    if (!navigator.geolocation) {
      setGeoState(GEO_STATES.DENIED);
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoState(GEO_STATES.REQUESTING);
    setPulse(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        setDetectedCity(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        setGeoState(GEO_STATES.DETECTED);
        setPulse(false);
      },
      (err) => {
        setPulse(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoState(GEO_STATES.DENIED);
          setError("Location access denied. Please select your city manually.");
        } else {
          setGeoState(GEO_STATES.ERROR);
          setError("Could not detect your location. Please select your city manually.");
        }
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleSearch = async () => {
    const usingGeo = geoState === GEO_STATES.DETECTED && coords;
    const usingManual = (geoState === GEO_STATES.DENIED || geoState === GEO_STATES.ERROR) && selectedCity;

    if (!usingGeo && !usingManual) {
      setError(
        geoState === GEO_STATES.IDLE
          ? "Please allow location access or select a city."
          : "Please select a city."
      );
      return;
    }
    if (!selectedSpecialist) {
      setError("Please select a specialist type.");
      return;
    }

    setError("");
    setIsSearching(true);

    try {
      let response;

      if (usingGeo) {
        // Send raw lat/lng to backend
        response = await api.get(NEARBY_DOCTORS_URL, {
          lat: coords.lat,
          lng: coords.lng,
          specialist: selectedSpecialist,
        });
      } else {
        // Manual city fallback — use existing city+specialist search
        response = await api.get("api/public/searchByCityAndSpecialist", {
          city: selectedCity,
          specialist: selectedSpecialist,
        });
      }

      const doctors = Array.isArray(response?.data) ? response.data : 
                      Array.isArray(response) ? response : [];

      navigate(`/specialist/${encodeURIComponent(selectedSpecialist)}`, {
        state: { doctors, flag: true },
      });
    } catch (err) {
      console.error("Nearby search error:", err);
      setError(err?.message || "Failed to find nearby doctors. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const isDeniedOrError = geoState === GEO_STATES.DENIED || geoState === GEO_STATES.ERROR;
  const canSearch =
    (geoState === GEO_STATES.DETECTED && coords) ||
    (isDeniedOrError && selectedCity);

  return (
    <section className="relative py-16 px-4 md:px-8 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <Navigation className="w-4 h-4" />
            <span>Location-Based Search</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
            Find Doctors{" "}
            <span className="text-blue-600">Near You</span>
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Allow location access and we'll instantly connect you with the best doctors in your area.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="p-8 md:p-10">
            {/* Geolocation trigger */}
            {geoState === GEO_STATES.IDLE && (
              <div className="flex flex-col items-center text-center gap-6">
                {/* Animated pin */}
                <div className="relative">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-300 cursor-pointer hover:scale-105 transition-transform"
                    onClick={requestGeolocation}>
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <span className="absolute inset-0 rounded-full bg-blue-400 opacity-40 animate-ping" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium text-lg mb-1">We need your location</p>
                  <p className="text-gray-400 text-sm">Click the button below to detect your location automatically</p>
                </div>
                <button
                  onClick={requestGeolocation}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all duration-200"
                >
                  <Navigation className="w-5 h-5" />
                  Use My Location
                </button>
              </div>
            )}

            {/* Requesting state */}
            {geoState === GEO_STATES.REQUESTING && (
              <div className="flex flex-col items-center text-center gap-5 py-4">
                <div className="relative">
                  <div className={`w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-300`}>
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <span className="absolute inset-0 rounded-full bg-blue-400 opacity-50 animate-ping" />
                  <span className="absolute inset-0 rounded-full bg-blue-300 opacity-30 animate-ping" style={{ animationDelay: "0.3s" }} />
                </div>
                <div>
                  <p className="text-blue-700 font-semibold text-lg">Detecting your location…</p>
                  <p className="text-gray-400 text-sm mt-1">Please allow the browser permission prompt</p>
                </div>
              </div>
            )}

            {/* Location Detected — show specialist picker + search */}
            {geoState === GEO_STATES.DETECTED && (
              <div className="flex flex-col gap-6">
                {/* Location badge */}
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Location Detected</p>
                    <p className="text-gray-800 font-semibold truncate">
                      {coords ? `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}` : "Your location"}
                    </p>
                  </div>
                  <button
                    onClick={() => { setGeoState(GEO_STATES.IDLE); setCoords(null); setSelectedSpecialist(""); setError(""); }}
                    className="ml-auto text-xs text-gray-400 hover:text-gray-600 underline flex-shrink-0"
                  >
                    Change
                  </button>
                </div>

                {/* Specialist picker */}
                <SpecialistSelect
                  specialists={specialists}
                  value={selectedSpecialist}
                  onChange={setSelectedSpecialist}
                />

                {/* Search button */}
                <SearchButton
                  onClick={handleSearch}
                  isSearching={isSearching}
                  disabled={!selectedSpecialist || isSearching}
                />
              </div>
            )}

            {/* Denied / Error fallback — manual city + specialist */}
            {isDeniedOrError && (
              <div className="flex flex-col gap-6">
                {/* Error notice */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">{error || "Location access unavailable."}</p>
                </div>

                {/* Manual city selector */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Select Your City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    >
                      <option value="" disabled>Choose a city…</option>
                      {(Array.isArray(cities) ? cities : [])
                        .filter((c) => typeof c === "string" && c.trim())
                        .map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Specialist picker */}
                <SpecialistSelect
                  specialists={specialists}
                  value={selectedSpecialist}
                  onChange={setSelectedSpecialist}
                />

                {/* Retry location link */}
                <div className="flex items-center justify-between -mt-2">
                  <button
                    onClick={requestGeolocation}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Try location again
                  </button>
                </div>

                {/* Search button */}
                <SearchButton
                  onClick={handleSearch}
                  isSearching={isSearching}
                  disabled={!selectedCity || !selectedSpecialist || isSearching}
                />
              </div>
            )}

            {/* Inline error (non-denied states) */}
            {error && !isDeniedOrError && (
              <p className="mt-4 text-sm text-red-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-gray-400 mt-5">
          🔒 Your location is only used to find nearby doctors and is never stored.
        </p>
      </div>
    </section>
  );
};

/* ── Sub-components ── */

const SpecialistSelect = ({ specialists, value, onChange }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-600 mb-1.5">Specialist Type</label>
    <div className="relative">
      <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
      >
        <option value="" disabled>Choose a specialist…</option>
        {(Array.isArray(specialists) ? specialists : []).map((s) => (
          <option key={s.id} value={s.specialist}>{s.specialist}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const SearchButton = ({ onClick, isSearching, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 active:scale-[0.98]"
  >
    {isSearching ? (
      <>
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span>Finding Doctors…</span>
      </>
    ) : (
      <>
        <Search className="w-5 h-5" />
        <span>Find Doctors Near Me</span>
      </>
    )}
  </button>
);

export default FindDoctorNearMe;
