import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const ServiceCard = ({ 
  title = "Service Title",
  description = "Service description goes here",
  imageSrc = null,
  imageAlt = "Service image",
  gradientColors = "from-blue-400 via-blue-500 to-blue-600",
  className = ""
}) => {
  return (
    <div className={`relative w-full bg-gradient-to-br ${gradientColors} rounded-2xl overflow-hidden shadow-xl ${className}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
      
      {/* Main content container */}
      <div className="relative p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
          
          {/* Left side - Text content with curvy containers */}
          <div className="space-y-4 order-2 sm:order-1">
            
            {/* Title bubble with custom curvy shape */}
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 pr-6">
                  {title}
                </h2>
                <ArrowUpRight className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 text-blue-500 bg-white rounded-full p-1 shadow-md" />
              </div>
              
              {/* Curved connector */}
              <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white/95 transform rotate-45 rounded-tl-lg"></div>
            </div>
            
            {/* Description container with flowing curves */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-white text-sm sm:text-base leading-relaxed">
                {description}
              </p>
            </div>
            
          </div>
          
          {/* Right side - Circular image placeholder */}
          <div className="relative order-1 sm:order-2 flex justify-center">
            <div className="p-3 sm:p-4">
              {/* Circular image or placeholder */}
              <img 
                    src={imageSrc} 
                    alt={imageAlt}
                    className="w-full h-56 object-cover "
                  />
              {/* <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center overflow-hidden">
                {imageSrc ? (
                  <img 
                    src={imageSrc} 
                    alt={imageAlt}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/30 rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-200 rounded-full"></div>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/30 rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-pink-200 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div> */}
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Bottom curved section */}
      <div className="relative">
        <div className="absolute inset-x-0 bottom-0 h-8 sm:h-12 bg-gradient-to-t from-black/20 to-transparent rounded-b-2xl"></div>
        
        {/* Curved decorative elements */}
        <div className="absolute bottom-2 left-4 w-6 h-6 sm:w-8 sm:h-8 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-3 right-6 sm:right-8 w-4 h-4 sm:w-6 sm:h-6 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-4 right-12 sm:right-16 w-2 h-2 sm:w-3 sm:h-3 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};
export default ServiceCard;