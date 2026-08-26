import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Banner from "./Banner";
import SpecialistDoctorsFinder from "./SpecialistDoctorFinder";
import FAQPage from "./FnQ";
import ExampleUsage from "./ServiceMainComponent";
import UserfeedBack from "./UserfeedBack";
import HowItWorks from "./HowItWorks";
import HomepageShimmer from "../../Shimmer/HomepageShimmer";

import { useApiService } from "../../../hooks/useAuthWithAxios";

const SPECIALIST_URL = "api/public/getSpecialist";
const CITIES_URL = "api/public/cities";

const Index = () => {
  const location = useLocation();
  const [cities, setCities] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [err, setErr] = useState();
  const api = useApiService();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Check if there's a hash in the URL (e.g., #faq)
    if (location.hash === "#faq") {
      // Small delay to ensure the component is rendered
      setTimeout(() => {
        const faqElement = document.getElementById("faq");
        if (faqElement) {
          faqElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [location.hash]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchCities(), fetchSpecialist()]);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const fetchSpecialist = async () => {
    try {
      const response = await api.get(SPECIALIST_URL);
      setSpecialists(response.data);
    } catch (error) {
      console.error("Error fetching specialists:", error);
      setErr("Failed to load specialists. Please try again later.");
    }
  };

  const fetchCities = async () => {
    try {
      const response = await api.get(CITIES_URL);
      if (response?.success) {
        const fetched = response.data;
        setCities(Array.isArray(fetched) ? fetched : fetched?.cities ?? []);
      } else {
        setErr("Failed to load cities. Please try again later.");
      }
    } catch (error) {
      console.log("Error fetching cities: ", error);
      setErr("Failed to load cities. Please try again later.");
    }
  };

  if (isInitialLoading) {
    return <HomepageShimmer />;
  }

  return (
    <div>
      <Banner 
        cities={cities} 
        specialists={specialists} 
        isLoading={isSearching}
        setIsLoading={setIsSearching}
      />
      <SpecialistDoctorsFinder
        isLoading={isSearching}
        setIsLoading={setIsSearching}
      />
      <ExampleUsage />
      <HowItWorks />
      <UserfeedBack />
      <FAQPage />
    </div>
  );
};
export default Index;
