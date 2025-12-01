import React, { useEffect } from "react";
import { Instagram, Twitter, MessageCircle, Facebook, ArrowUp } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleFAQClick = (e) => {
    e.preventDefault();
    
    // Check if we're on the homepage
    if (location.pathname === '/') {
      // If on homepage, scroll to FAQ section
      const faqElement = document.getElementById('faq');
      if (faqElement) {
        faqElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // If on other routes, navigate to homepage with hash
      navigate('/#faq');
    }
  };

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { text: "Patient registration", path: "/auth/signup", type: "internal" },
        { text: "Registration of doctors", path: "/auth/signup", type: "internal" },
        // { text: "Terms & Conditions", path: "/terms", type: "internal" },
        // { text: "Privacy Policy", path: "/privacy", type: "internal" },
        { text: "FAQ", path: "/faq", type: "faq" }
      ]
    },
    {
      title: "About",
      links: [
        { text: "Home", path: "/", type: "internal" },
        { text: "About Us", path: "/about", type: "internal" },
        { text: "Contact Us", path: "/contact", type: "internal" },
        // { text: "Hospital & Clinics", path: "/hospitals", type: "internal" }
      ]
    },
    {
      title: "Specialists",
      links: [
        { text: "Cardiologist", path: "/specialist/Cardiologist", type: "internal" },
        { text: "Dermatologist", path: "/specialist/Dermatologist", type: "internal" },
        { text: "ENT Specialist", path: "/specialist/Ear-Nose-Throat (ENT) Specialist", type: "internal" },
        { text: "Orthopedist", path: "/specialist/Orthopedist", type: "internal" },
        { text: "General Physician", path: "/specialist/General Physician", type: "internal" },
        { text: "Gastroenterologist", path: "/specialist/Gastroenterologist", type: "internal" }
      ]
    },
    {
      title: "More Specialists",
      links: [
        { text: "Psychiatrist", path: "/specialist/Psychiatrist", type: "internal" },
        { text: "General Surgeon", path: "/specialist/General Surgeon", type: "internal" },
        { text: "Homoeopath", path: "/specialist/Homoeopath", type: "internal" },
        { text: "Pediatrician", path: "/specialist/pediatrician", type: "internal" },
        { text: "Nephrologist", path: "/specialist/Nephrologist/Renal Specialist", type: "internal" },
        { text: "Ophthalmologist", path: "/specialist/Ophthalmologist", type: "internal" }
      ]
    }
  ];

  const socialIcons = [
    { icon: Instagram, label: "Instagram", url: "https://instagram.com/heydoctor" },
    { icon: Twitter, label: "Twitter", url: "https://twitter.com/heydoctor" },
    { icon: MessageCircle, label: "WhatsApp", url: "https://wa.me/yournumber" },
    { icon: Facebook, label: "Facebook", url: "https://facebook.com/heydoctor" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Back to Top Button */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={scrollToTop}
          className="bg-white bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium transform hover:-translate-y-1"
        >
          Back to Top
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>

      <div className="container mx-auto px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-sm flex items-center justify-center">
                  <div className="text-white font-bold text-xs">H</div>
                </div>
              </div>
              <span className="text-xl font-semibold">HeyDoctor</span>
            </div>

            {/* Description */}
            <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-xs">
              With HeyDoctor, you can easily book your desired doctor's appointment from anywhere and anytime.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialIcons.map(({ icon: Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-slate-700 via-blue-500 to-slate-700 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="md:col-span-1">
              {section.title && (
                <h3 className="text-white font-semibold mb-4 text-lg">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.type === "faq" ? (
                      <button
                        onClick={handleFAQClick}
                        className="text-blue-100 hover:text-white text-sm transition-colors duration-200 block py-1 text-left"
                      >
                        {link.text}
                      </button>
                    ) : link.type === "internal" ? (
                      <Link
                        to={link.path}
                        className="text-blue-100 hover:text-white text-sm transition-colors duration-200 block py-1"
                      >
                        {link.text}
                      </Link>
                    ) : (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-100 hover:text-white text-sm transition-colors duration-200 block py-1"
                      >
                        {link.text}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Copyright/Additional Info */}
        <div className="border-t border-blue-500 mt-12 pt-6 text-center">
          <p className="text-blue-200 text-sm">
            © 2025 HeyDoctor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
