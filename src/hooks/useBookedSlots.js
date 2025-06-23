// import { useState, useEffect } from "react";
// import { format } from "date-fns";
// import useAxios from "@/hooks/useAxios";
// import useAuth from "./useAuth";

// export function useBookedSlots(doctorId, date) {
//   const { fetchData } = useAxios();
//   const [bookedSlots, setBookedSlots] = useState([]);
//   const { setIsLoading, isLoading } = useAuth();
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!doctorId || !date) return;
//     setIsLoading(true);
//     setError("");
//     fetchData({
//       url: "/api/public/booked-slots",
//       method: "post",
//       data: {
//         date: format(date, "yyyy-MM-dd"),
//         doctor: { id: doctorId },
//       },
//     })
//       .then((response) => {
//         setBookedSlots((response.data || []).map((slot) => slot.trim()));
//         console.log(response)
//       })
//       .catch(() => setError("Failed to fetch availability"))
//       .finally(() => setIsLoading(false));
//   }, [doctorId, date, fetchData]);

//   return { bookedSlots, isLoading, error };
// }
import { useState, useEffect } from "react";
import { format } from "date-fns";

import useAuth from "./useAuth";
import useAxios from "./useAxios";


export function useBookedSlots(doctorId, date) {
  const { fetchData } = useAxios();
  const { setIsLoading, isLoading } = useAuth();
  const [bookedSlots, setBookedSlots] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!doctorId || !date) return;

    let isMounted = true;
    const fetchSlots = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetchData({
          url: "/api/public/booked-slots",
          method: "post",
          data: {
            date: format(date, "yyyy-MM-dd"),
            doctor: { id: doctorId },
          },
        });
        if (isMounted) {
          setBookedSlots((response.data || []).map((slot) => slot.trim()));
        }
      } catch (err) {
        if (isMounted) setError("Failed to fetch availability");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [doctorId, date, fetchData, setIsLoading]);

  return { bookedSlots, isLoading, error };
}
