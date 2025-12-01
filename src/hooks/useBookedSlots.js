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
      console.log("booked slot " + isLoading)
      try {
        const data = {
          date: format(date, "yyyy-MM-dd"),
          doctor: { doctorId : id },
        };
        const response = await api.post("/api/public/booked-slots", data);
        if (isMounted) {
          setBookedSlots((response.data || []).map((slot) => slot.trim()));
        }
      } catch (err) {
        if (isMounted) setError("Failed to fetch availability");
      } finally {
        if (isMounted) setIsLoading(false);
        console.log("booked slot " + isLoading)

      }
    };

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [id, date]);

  return { bookedSlots, isLoading, error };
}
