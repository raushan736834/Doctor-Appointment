import { useContext } from "react";
import dateContext from "../component/GlobalComponent/DateTimeProvider";

const useDate = () => {
    return useContext(dateContext);
}

export default useDate;