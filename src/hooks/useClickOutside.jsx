import { useEffect } from "react";

const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }
      callback(e);
    };

    document.addEventListener("mousedown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, callback]);
};

export default useClickOutside;
