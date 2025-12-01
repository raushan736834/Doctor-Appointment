import { useState, useEffect, useRef } from "react";
import AutoSuggestion from "./AutoSuggestion";
import { useNavigate } from "react-router-dom";
import { useApiService } from "../../hooks/useAuthWithAxios";

const Searchbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const debounceRef = useRef();
  const api = useApiService();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchText.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const fetchSuggestions = async () => {
        try {
          const response = await api.get(`/api/public/search?keyword=${searchText}`);
          console.log(response);
          setSuggestions(response?.data?.data || []);
          setShowDropdown((response?.data || []).length > 0);
        } catch (error) {
          setSuggestions([]);
          setShowDropdown(false);
        }
      };
      fetchSuggestions();
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchText]);

  const handleSuggestionClick = (doctor) => {
    // onChange({ target: { value: doctor.doctorName } });
    setShowDropdown(false);
    navigate(`/specialist/${encodeURIComponent(doctor?.professional?.specialization)}/${doctor.doctorId}`, { state: { doctor }});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 relative">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center relative">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            className="w-full px-4 py-2 border-2 rounded-full border-gray-500"
            placeholder="Search doctors, clinics, hospitals"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setShowDropdown(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setShowDropdown(false);
              }
            }}
          />
          <AutoSuggestion
            suggestions={searchText.trim() === "" ? [] : suggestions}
            onSuggestionClick={handleSuggestionClick}
            showDropdown={showDropdown && searchText.trim() !== ""}
          />
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
