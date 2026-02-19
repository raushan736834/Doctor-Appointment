import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useApiService } from "./useAuthWithAxios";


export function useBookedSlots(id, date) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = useApiService();
  useEffect(() => {
    if (!id || !date) return;

    let isMounted = true;

    const fetchSlots = async () => {
      setIsLoading(true);
      setError("");
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const response = await api.get(`/api/public/booked-slots?doctorId=${id}&date=${formattedDate}`);
        if (isMounted) {
          setBookedSlots((response || []).map((slot) => slot.trim()));
        }
      } catch (err) {
        if (isMounted) {
          // Handle thrown errors (including 403 and other backend errors)
          const errorMessage = err.message || `Failed to fetch booked slots`;
          setError(errorMessage);
          setBookedSlots([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [id, date, api]);

  return { bookedSlots, isLoading, error };
}
