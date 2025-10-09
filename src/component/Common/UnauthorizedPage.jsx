import React, { useState } from 'react';

export default function UnauthorizedPage() {
  const goHome = () => {
    window.location.href = '/';
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-2xl w-full">
        <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 bg-white/10 rounded-full flex items-center justify-center text-6xl md:text-7xl animate-bounce">
          🔍
        </div>

        {/* Error code */}
        <div className="text-8xl md:text-9xl font-bold mb-4 text-white drop-shadow-lg animate-pulse">
          403
        </div>

        {/* Error message */}
        <h1 className="text-3xl md:text-4xl font-light mb-4">
          You are not authorized to access this page
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed max-w-lg mx-auto">
          Please contact the administrator to get access to this page.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={goHome}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full font-medium transition-all duration-300 hover:bg-white/30 hover:transform hover:scale-105 hover:shadow-lg"
          >
            <span className="text-lg">🏠</span>
            Go Home
          </button>
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full font-medium transition-all duration-300 hover:bg-white/30 hover:transform hover:scale-105 hover:shadow-lg"
          >
            <span className="text-lg">←</span>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}