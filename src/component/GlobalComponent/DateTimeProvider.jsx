import { createContext, useState } from "react";
import { useEffect } from "react";

const dateContext = createContext({});

export const DateTimeProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    // Retrieve data from localStorage when the component mounts
    const savedData = localStorage.getItem("myData");
    return savedData ? JSON.parse(savedData) : null;
  });

  useEffect(() => {
    // Save data to localStorage whenever it changes

    localStorage.setItem("myData", JSON.stringify(data));
  }, [data]);

  return (
    <dateContext.Provider value={{ data, setData }}>
      {children}
    </dateContext.Provider>
  );
};

export default dateContext;
// import { createContext, useState } from "react";
// export const dateContext = createContext({});
