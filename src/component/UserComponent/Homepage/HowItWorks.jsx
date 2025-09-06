import React from "react";
import { UserCheck, Calendar, Building2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: UserCheck,
      title: "Find Your Doctor",
      description: "Find your desired doctor and clinic based on location and specialty."
    },
    {
      id: 2,
      icon: Calendar,
      title: "Make an Appointment",
      description: "Easily book your appointment on the desired date."
    },
    {
      id: 3,
      icon: Building2,
      title: "Get Services",
      description: "we will help find and provide solutions for your health"
    }
  ];

  return (
    <div className="min-h-lvh bg-gradient-to-r from-white via-gray-100 to-white flex items-center justify-center  p-4 md:p-6  py-8">
      <div className="max-w-7xl w-full">
        {/* Main heading */}
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-800 text-center mb-8">
          How it Works?
        </h2>

        {/* Steps container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            
            return (
              <div key={step.id} className="flex flex-col items-center text-center relative">
                {/* Connecting line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 w-full h-0.5 bg-gray-300 z-0 border-dashed border-t-2 border-gray-400" 
                       style={{ transform: 'translateX(50%)', width: 'calc(100% + 3rem)' }}>
                  </div>
                )}
                
                {/* Icon circle */}
                <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
                  <IconComponent className="w-10 h-10 text-gray-600" strokeWidth={1.5} />
                </div>

                {/* Step number */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold z-20">
                  {step.id}
                </div>

                {/* Content */}
                <div className="mt-4">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}