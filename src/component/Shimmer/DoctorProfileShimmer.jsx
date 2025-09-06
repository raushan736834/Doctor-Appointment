import React from "react";

const DoctorProfileShimmer = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Info Card Shimmer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image Shimmer */}
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 bg-gray-200 rounded-2xl shimmer"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-200 rounded-full shimmer"></div>
                </div>

                {/* Doctor Details Shimmer */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-8 bg-gray-200 rounded shimmer mb-3 w-64"></div>
                      <div className="h-6 bg-gray-200 rounded shimmer mb-2 w-48"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-5 bg-gray-200 rounded shimmer mb-1 w-24"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="h-4 bg-gray-200 rounded shimmer w-32"></div>
                    <div className="h-4 bg-gray-200 rounded shimmer w-36"></div>
                    <div className="h-4 bg-gray-200 rounded shimmer w-40"></div>
                    <div className="h-4 bg-gray-200 rounded shimmer w-28"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section Shimmer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded shimmer mb-4 w-32"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded shimmer w-full"></div>
                <div className="h-4 bg-gray-200 rounded shimmer w-full"></div>
                <div className="h-4 bg-gray-200 rounded shimmer w-3/4"></div>
              </div>
            </div>

            {/* Education & Qualifications Shimmer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded shimmer mb-4 w-56"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 bg-gray-200 rounded shimmer mt-0.5"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded shimmer mb-2 w-48"></div>
                      <div className="h-4 bg-gray-200 rounded shimmer mb-1 w-32"></div>
                      <div className="h-3 bg-gray-200 rounded shimmer w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section Shimmer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded shimmer mb-4 w-32"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-4 bg-gray-200 rounded shimmer w-24"></div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="w-4 h-4 bg-gray-200 rounded shimmer"></div>
                        ))}
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded shimmer w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded shimmer w-3/4"></div>
                  </div>
                ))}
                <div className="h-4 bg-gray-200 rounded shimmer w-32"></div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar Shimmer */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="h-6 bg-gray-200 rounded shimmer mb-6 w-40"></div>

              {/* Date Selection Shimmer */}
              <div className="mb-6">
                <div className="h-5 bg-gray-200 rounded shimmer mb-3 w-24"></div>
                <div className="h-12 bg-gray-200 rounded-lg shimmer w-full"></div>
              </div>

              {/* Period Selection Shimmer */}
              <div className="mb-6">
                <div className="h-5 bg-gray-200 rounded shimmer mb-3 w-28"></div>
                <div className="h-16 bg-gray-200 rounded-lg shimmer w-full"></div>
              </div>

              {/* Time Slot Selection Shimmer */}
              <div className="mb-6">
                <div className="h-5 bg-gray-200 rounded shimmer mb-3 w-32"></div>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
                    <div key={slot} className="h-8 bg-gray-200 rounded-lg shimmer"></div>
                  ))}
                </div>
              </div>

              {/* Consultation Fee Shimmer */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded shimmer w-32"></div>
                  <div className="h-8 bg-gray-200 rounded shimmer w-16"></div>
                </div>
              </div>

              {/* Contact Options Shimmer */}
              <div className="space-y-3 mb-6">
                <div className="h-12 bg-gray-200 rounded-lg shimmer w-full"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 bg-gray-200 rounded-lg shimmer"></div>
                  <div className="h-10 bg-gray-200 rounded-lg shimmer"></div>
                </div>
              </div>

              {/* Clinic Info Shimmer */}
              <div className="border-t border-gray-200 pt-4">
                <div className="h-5 bg-gray-200 rounded shimmer mb-2 w-36"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded shimmer w-full"></div>
                  <div className="h-4 bg-gray-200 rounded shimmer w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded shimmer w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded shimmer w-28 mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileShimmer;