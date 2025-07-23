import React, { useState } from 'react';

const CoolLoader = ({ isLoading = true, message = "Loading..." }) => {
  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      {/* Hexagonal Pulse Loader */}
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin"></div>
        <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-b-yellow-400 border-l-yellow-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <div className="absolute inset-4 w-12 h-12 bg-gradient-to-r from-cyan-400 to-yellow-400 rounded-full animate-ping"></div>
      </div>
      
      {/* Glowing Message */}
      <div className="relative">
        <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
          {message}
        </p>
        <div className="absolute inset-0 text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent blur-sm animate-pulse opacity-50"></div>
      </div>
      
      {/* Morphing Dots */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce shadow-lg shadow-purple-500/50"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full animate-bounce shadow-lg shadow-pink-500/50" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-yellow-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/50" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full animate-bounce shadow-lg shadow-yellow-400/50" style={{ animationDelay: '0.3s' }}></div>
      </div>
    </div>
  );
};

const NeonLoader = ({ isLoading = true, message = "Loading..." }) => {
  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-gray-900 rounded-lg">
      {/* Neon Ring */}
      <div className="relative">
        <div className="w-24 h-24 border-4 border-transparent rounded-full animate-spin shadow-2xl shadow-cyan-500/25" 
             style={{ 
               borderImage: 'conic-gradient(from 0deg, #00ffff, #ff00ff, #ffff00, #00ffff) 1',
               animationDuration: '2s'
             }}>
        </div>
        <div className="absolute inset-0 w-24 h-24 border-4 border-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50 opacity-60"></div>
        <div className="absolute inset-3 w-18 h-18 bg-cyan-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-6 w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-spin shadow-lg shadow-cyan-400/50" style={{ animationDuration: '1s' }}></div>
      </div>
      
      {/* Neon Text */}
      <div className="relative">
        <p className="text-xl font-bold text-cyan-400 animate-pulse drop-shadow-lg" style={{ 
          textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff' 
        }}>
          {message}
        </p>
      </div>
      
      {/* Neon Bars */}
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" 
               style={{ 
                 height: `${Math.random() * 20 + 10}px`,
                 animationDelay: `${i * 0.1}s`,
                 animationDuration: '1s'
               }}>
          </div>
        ))}
      </div>
    </div>
  );
};

const ParticleLoader = ({ isLoading = true, message = "Loading..." }) => {
  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      {/* Particle System */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Orbiting particles */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-spin shadow-lg shadow-blue-400/50"
               style={{
                 transformOrigin: '0 60px',
                 transform: `rotate(${i * 45}deg)`,
                 animationDuration: '2s',
                 animationDelay: `${i * 0.1}s`
               }}>
          </div>
        ))}
        
        {/* Center core */}
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse shadow-lg shadow-purple-600/50"></div>
      </div>
      
      {/* Animated Text */}
      <div className="relative">
        <p className="text-xl font-bold text-gray-800 animate-pulse">
          {message.split('').map((char, i) => (
            <span key={i} className="inline-block animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </p>
      </div>
      
      {/* Wave Effect */}
      <div className="flex space-x-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-2 h-8 bg-gradient-to-t from-blue-400 to-purple-600 rounded-full animate-pulse"
               style={{
                 animationDelay: `${i * 0.1}s`,
                 animationDuration: '1s',
                 transform: `scaleY(${Math.sin(i * 0.5) * 0.5 + 0.5})`
               }}>
          </div>
        ))}
      </div>
    </div>
  );
};

const LoaderApp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentLoader, setCurrentLoader] = useState('cool');

  const handleToggleLoader = () => {
    setIsLoading(!isLoading);
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  };

  const renderLoader = () => {
    const loaders = {
      cool: <CoolLoader isLoading={isLoading} message="Powering up..." />,
      neon: <NeonLoader isLoading={isLoading} message="Syncing data..." />,
      particle: <ParticleLoader isLoading={isLoading} message="Processing..." />
    };
    return loaders[currentLoader];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Cool Loader Collection
        </h1>
        
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            {['cool', 'neon', 'particle'].map((type) => (
              <button
                key={type}
                onClick={() => setCurrentLoader(type)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentLoader === type
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} Loader
              </button>
            ))}
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleToggleLoader}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-blue-500/25"
            >
              {isLoading ? 'Stop Loader' : 'Start Loader'}
            </button>
            
            <button
              onClick={simulateLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-green-500/25"
            >
              Simulate 4s Loading
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 flex items-center justify-center min-h-[300px]">
          {renderLoader()}
        </div>
        
        <div className="mt-8 bg-gray-800 rounded-xl shadow-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Cool Loader</h4>
              <ul className="space-y-1">
                <li>• Gradient animations</li>
                <li>• Multiple spinning rings</li>
                <li>• Glowing effects</li>
                <li>• Morphing dots</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-400 font-semibold mb-2">Neon Loader</h4>
              <ul className="space-y-1">
                <li>• Neon glow effects</li>
                <li>• Dark theme optimized</li>
                <li>• Pulsing animations</li>
                <li>• Animated bars</li>
              </ul>
            </div>
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">Particle Loader</h4>
              <ul className="space-y-1">
                <li>• Orbiting particles</li>
                <li>• Letter-by-letter animation</li>
                <li>• Wave effects</li>
                <li>• Dynamic positioning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderApp;