import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useApiService } from "./useAuthWithAxios";


export function useBookedSlots(doctorId, date) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = useApiService();
  useEffect(() => {
    if (!doctorId || !date) return;

    let isMounted = true;

    const fetchSlots = async () => {
      setIsLoading(true);
      setError("");
      console.log("booked slot " + isLoading)
      try {
        const data = {
          date: format(date, "yyyy-MM-dd"),
          doctor: { id: doctorId },
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
  }, [doctorId, date]);

  return { bookedSlots, isLoading, error };
}
