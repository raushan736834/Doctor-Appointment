import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import image1 from "../../../assets/img/feedback4.png"
import image2 from "../../../assets/img/feedback2.png"
import image3 from "../../../assets/img/feedback3.png"

export default function UserfeedBack() {
  // Sample images - replace with your actual image imports
  const images = [
    image1,image2,image3
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % images.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-white flex items-center justify-center p-8">
      <div className="max-w-7xl w-full">
        {/* Main container with overlapping rounded sections */}
        <div className="relative">
          {/* Left section - Review card */}
          <div className="relative z-10 bg-gray-200 rounded-3xl p-8 md:p-12 w-full flex gap-8">
            {/* Content section */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-8">
                What Users Say About{" "}
                <span className="text-blue-600">HeyDoctor</span>
              </h2>

              {/* Review card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-gray-600">Sara Tylor</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Using HeyDoctor was a wonderful experience for me. It has a
                  simple and efficient user interface and I was able to easily
                  book an appointment at the office I wanted at the time I
                  wanted. Also, getting a booking confirmation and reminder
                  before my appointment helped me to always be on time at the
                  office.
                </p>

                {/* Navigation arrows */}
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={prevImage}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* User reviews summary */}
              <div className="bg-white rounded-full px-4 py-2 inline-flex items-center gap-3 shadow-sm">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-white"></div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">+500 Users reviews</div>
                  <div className="text-gray-500 text-xs">See all reviews →</div>
                </div>
              </div>
            </div>

            {/* Image section - fixed width with proper aspect ratio */}
            <div className="hidden sm:block w-80 flex-shrink-0">
              <div className="relative   rounded-2xl overflow-hidden">
                <img 
                  src={images[currentImageIndex]}
                  alt={`User ${currentImageIndex + 1}`}
                  className="w-full h-full object-fill transition-opacity duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback when image fails to load */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center
                 text-white font-semibold text-lg hidden">
                  User Image
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}