import { useContext } from "react";
import dateContext from "../context/DateTimeProvider";

const useDate = () => {
    return useContext(dateContext);
}

export default useDate;