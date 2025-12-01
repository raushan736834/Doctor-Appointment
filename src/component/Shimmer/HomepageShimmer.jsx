import React from "react";

export const BannerShimmer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Mobile + Tablet Shimmer */}
          <div className="relative block lg:hidden p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
              <div className="flex-1 space-y-4">
                {/* Title Shimmer */}
                <div className="space-y-2">
                  <div className="h-8 bg-white/20 rounded-lg w-3/4 shimmer"></div>
                  <div className="h-8 bg-white/20 rounded-lg w-1/2 shimmer"></div>
                  <div className="h-8 bg-white/20 rounded-lg w-2/3 shimmer"></div>
                </div>
              </div>
              
              {/* Image Shimmer */}
              <div className="relative flex justify-center sm:justify-end flex-shrink-0">
                <div className="w-48 h-60 sm:w-52 sm:h-64 rounded-2xl bg-white/20 shimmer"></div>
              </div>
            </div>

            {/* Search Form Shimmer */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 shimmer"></div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 h-12 bg-gray-100 rounded-lg shimmer"></div>
                <div className="flex-1 h-12 bg-gray-100 rounded-lg shimmer"></div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg shimmer"></div>
              </div>
            </div>
          </div>

          {/* Desktop Shimmer */}
          <div className="relative hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center md:p-8 lg:p-12">
            <div className="space-y-8">
              {/* Title Shimmer */}
              <div className="space-y-4">
                <div className="h-10 bg-white/20 rounded-lg w-3/4 animate-pulse"></div>
                <div className="h-10 bg-white/20 rounded-lg w-1/2 animate-pulse"></div>
                <div className="h-10 bg-white/20 rounded-lg w-2/3 animate-pulse"></div>
              </div>

              {/* Search Form Shimmer */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                  <div className="flex-1 h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Image Shimmer */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="w-64 h-80 lg:w-80 lg:h-96 rounded-2xl bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecialistCardShimmer = () => (
  <div className="flex-shrink-0 w-64 h-32 rounded-xl overflow-hidden">
    <div className="p-6 h-full flex items-center bg-gray-100">
      <div className="flex items-center space-x-4 w-full">
        <div className="w-20 h-20 rounded-full bg-gray-200 shimmer"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
        </div>
      </div>
    </div>
  </div>
);

const DoctorCardShimmer = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
    <div className="flex items-start space-x-4 mb-4">
      <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden">
        <div className="w-full h-full bg-gray-200 shimmer"></div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-gray-200 rounded w-3/4 shimmer"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 shimmer"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 shimmer"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 shimmer"></div>
      </div>
    </div>
    <div className="flex space-x-3">
      <div className="flex-1 h-10 bg-gray-200 rounded-lg shimmer"></div>
      <div className="w-32 h-10 bg-gray-200 rounded-lg shimmer"></div>
    </div>
  </div>
);

export const SpecialistFinderShimmer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Shimmer */}
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
        </div>

        {/* Specialty Carousel Shimmer */}
        <div className="mb-12">
          <div className="relative px-8">
            <div className="flex space-x-6 overflow-x-hidden pb-4">
              <div className="flex space-x-6" style={{ padding: "0 calc(50% - 128px)" }}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <SpecialistCardShimmer key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Grid Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((index) => (
            <DoctorCardShimmer key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  .shimmer {
    animation: shimmer 2s infinite linear;
    background: linear-gradient(to right, #f6f7f8 4%, #edeef1 25%, #f6f7f8 36%);
    background-size: 1000px 100%;
  }
`;

const HomepageShimmer = () => {
  return (
    <>
      <style>{shimmerStyles}</style>
      <BannerShimmer />
      <SpecialistFinderShimmer />
    </>
  );
};

export default HomepageShimmer;