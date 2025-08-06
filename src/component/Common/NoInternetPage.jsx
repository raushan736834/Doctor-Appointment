import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Settings, Smartphone, Router, AlertCircle, CheckCircle } from 'lucide-react';

const NoInternetPage = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('offline');
  const [retryCount, setRetryCount] = useState(0);

  // Simulate connection checking
  const checkConnection = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Simulate checking process
    setTimeout(() => {
      // Random chance to simulate connection restored (for demo purposes)
      const isConnected = Math.random() > 0.7; // 30% chance of connection
      
      if (isConnected) {
        setConnectionStatus('online');
        setTimeout(() => {
          // In a real app, you would redirect or reload the page
          alert('Connection restored! Redirecting...');
          setConnectionStatus('offline'); // Reset for demo
        }, 2000);
      }
      
      setIsRetrying(false);
    }, 2000);
  };

  const troubleshootingSteps = [
    {
      icon: <Wifi className="w-5 h-5" />,
      title: "Check WiFi Connection",
      description: "Make sure you're connected to a WiFi network or have mobile data enabled"
    },
    {
      icon: <Router className="w-5 h-5" />,
      title: "Restart Router",
      description: "Unplug your router for 10 seconds, then plug it back in"
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Check Device Settings",
      description: "Ensure airplane mode is off and network settings are correct"
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: "Restart Device",
      description: "Try restarting your device to refresh network connections"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Connection Status Icon */}
          <div className="mb-6">
            {connectionStatus === 'online' ? (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <WifiOff className="w-10 h-10 text-red-500" />
              </div>
            )}
          </div>

          {/* Status Message */}
          {connectionStatus === 'online' ? (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-green-600 mb-2">Connection Restored!</h1>
              <p className="text-gray-600">You're back online. Redirecting...</p>
            </div>
          ) : (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">No Internet Connection</h1>
              <p className="text-gray-600">
                Please check your internet connection and try again.
              </p>
            </div>
          )}

          {/* Retry Button */}
          {connectionStatus === 'offline' && (
            <div className="mb-6">
              <button
                onClick={checkConnection}
                disabled={isRetrying}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  isRetrying
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-[1.02]'
                }`}
              >
                {isRetrying ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Checking Connection...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Try Again
                  </div>
                )}
              </button>

              {retryCount > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Attempted {retryCount} time{retryCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {/* Troubleshooting Toggle */}
          {connectionStatus === 'offline' && (
            <button
              onClick={() => setShowTroubleshooting(!showTroubleshooting)}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium mb-4 flex items-center justify-center w-full"
            >
              <Settings className="w-4 h-4 mr-1" />
              {showTroubleshooting ? 'Hide' : 'Show'} Troubleshooting Tips
            </button>
          )}
        </div>

        {/* Troubleshooting Section */}
        {showTroubleshooting && connectionStatus === 'offline' && (
          <div className="mt-4 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Troubleshooting Steps</h2>
            </div>
            
            <div className="space-y-4">
              {troubleshootingSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm">{step.title}</h3>
                    <p className="text-gray-600 text-xs mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 text-sm mb-2">Still having trouble?</h3>
              <p className="text-blue-700 text-xs">
                Contact your internet service provider or check if there are any known outages in your area.
              </p>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">
            This page will automatically refresh when connection is restored
          </p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default NoInternetPage;