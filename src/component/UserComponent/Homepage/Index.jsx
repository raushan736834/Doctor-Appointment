import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Banner from "./Banner";
import SpecialistDoctorsFinder from "./SpecialistDoctorFinder";
import FAQPage from "./FnQ";
import ExampleUsage from "./ServiceMainComponent";
import UserfeedBack from "./UserfeedBack";
import HowItWorks from "./HowItWorks";
import DoctorProfile from "../DoctorProfile";
import DoctorOnboarding from "../../DoctorComponent/DoctorOnboarding";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if there's a hash in the URL (e.g., #faq)
    if (location.hash === '#faq') {
      // Small delay to ensure the component is rendered
      setTimeout(() => {
        const faqElement = document.getElementById('faq');
        if (faqElement) {
          faqElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <div>
      <Banner />
      <SpecialistDoctorsFinder />
      <ExampleUsage />
      <HowItWorks />
      <UserfeedBack />
      <FAQPage />
      {/* <DoctorOnboarding /> */}
    </div>
  );
};
export default Index;
