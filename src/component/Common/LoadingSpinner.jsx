// component/Common/LoadingSpinner.jsx
import React from "react";

/**
 * Loading Spinner Component
 * Used for lazy loading fallback and general loading states
 */
const LoadingSpinner = ({ 
  size = "md", 
  color = "blue", 
  fullScreen = true,
  message = "Loading..." 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const colorClasses = {
    blue: "border-blue-600",
    purple: "border-purple-600",
    green: "border-green-600",
    red: "border-red-600",
    gray: "border-gray-600"
  };

  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-gray-50"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="relative">
          <div className={`
            ${sizeClasses[size]} 
            ${colorClasses[color]}
            border-4 border-t-transparent rounded-full animate-spin
          `}></div>
        </div>
        
        {message && (
          <p className="mt-4 text-sm text-gray-600 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Page Loading Spinner
 * Specifically for page transitions
 */
export const PageLoader = ({size, color, message, fullScreen}) => (
  <LoadingSpinner 
    size={size || "lg"} 
    color={color || "blue" }
    message= {message || "Loading page..."}
    fullScreen={fullScreen || true}
  />
);

/**
 * Inline Loading Spinner
 * For smaller loading states within components
 */
export const InlineLoader = ({ message = "Loading..." }) => (
  <LoadingSpinner 
    size="sm" 
    color="gray" 
    message={message}
    fullScreen={false}
  />
);

/**
 * Button Loading Spinner
 * For loading states in buttons
 */
export const ButtonLoader = ({ size = "sm" }) => (
  <div className={`
    ${size === "sm" ? "h-4 w-4" : "h-5 w-5"}
    border-2 border-white border-t-transparent rounded-full animate-spin
  `}></div>
);

export default LoadingSpinner;