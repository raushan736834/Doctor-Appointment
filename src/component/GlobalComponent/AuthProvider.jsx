import { createContext, useState } from "react";
import OverlayLoader from "../Common/Loader";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken:localStorage.getItem('token') || null,
  });
  const [isLoading,setIsLoading]=useState(false);
  return (
    <AuthContext.Provider value={{ auth, setAuth , isLoading,setIsLoading}}>
      {children}
      {isLoading &&
        <OverlayLoader/>
      }
    </AuthContext.Provider>
  );
};

export default AuthContext;
