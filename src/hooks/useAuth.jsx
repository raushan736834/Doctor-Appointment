import { useContext } from "react";
import AuthContext from "../component/GlobalComponent/AuthProvider";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;