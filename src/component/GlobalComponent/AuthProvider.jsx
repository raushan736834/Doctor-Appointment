// import { createContext, useState,useEffect } from "react";
// import OverlayLoader from "../Common/Loader";

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     accessToken:localStorage.getItem('token') || null,
//   });
//   const [isLoading,setIsLoading]=useState(false);
//   return (
//     <AuthContext.Provider value={{ auth, setAuth , isLoading,setIsLoading}}>
//       {children}
//       {isLoading &&
//         <OverlayLoader/>
//       }
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;
import { createContext, useState, useEffect } from "react";
import OverlayLoader from "../Common/Loader";

// Create AuthContext with clear structure
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: localStorage.getItem("token") || null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Auto-sync accessToken with localStorage for persistent login
  useEffect(() => {
    if (auth.accessToken) {
      localStorage.setItem("token", auth.accessToken);
    } else {
      localStorage.removeItem("token");
    }
  }, [auth.accessToken]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoading, setIsLoading }}>
      {children}
      {/* {isLoading && <OverlayLoader />} */}
    </AuthContext.Provider>
  );
};

export default AuthContext;
