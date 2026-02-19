import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useApiService } from "./useAuthWithAxios";

/**
 * Hook to fetch available appointment slots from the backend
 * @param {string} doctorId - The doctor's ID
 * @param {Date} date - The date to fetch slots for
 * @returns {Object} - { slots, isLoading, error }
 */
export function useSlots(doctorId, date) {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = useApiService();
  
  // Memoize the formatted date string for stable dependency comparison
  const dateString = useMemo(() => {
    return date ? format(date, "yyyy-MM-dd") : null;
  }, [date]);

  useEffect(() => {
    if (!doctorId || !date) {
      setSlots([]);
      return;
    }

    let isMounted = true;

    const fetchSlots = async () => {
      setIsLoading(true);
      setError("");

      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const response = await api.get(
          `/api/slots?doctorId=${doctorId}&date=${formattedDate}`
        );
        console.log(response)
        
        if (isMounted) {
          // Map into a normalized slot shape: { slotId, time, status }
          // Note: api.get() returns response.data directly, so response is already the data array
          const slotTimes = (response?.data || []).map((slot) => {
            const time = slot?.slotTime;

            // If it's a time object or LocalTime, format it
            if (time && typeof time === "object") {
              const hours = String(time.hour || time.hours || 0).padStart(2, "0");
              const minutes = String(
                time.minute || time.minutes || 0
              ).padStart(2, "0");
              return {
                slotId: slot?.slotId,
                time: `${hours}:${minutes}`,
                status: slot?.status,
              };
            }

            // If it's already a string, normalize to HH:MM
            if (typeof time === "string") {
              return {
                slotId: slot?.slotId,
                time: time.split(":").slice(0, 2).join(":"),
                status: slot?.status,
              };
            }

            // Fallback
            return {
              slotId: slot?.slotId,
              time: time,
              status: slot?.status,
            };
          });

          setSlots(slotTimes);
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        if (isMounted) {
          // Handle thrown errors (including 403 and other backend errors)
          const errorMessage = err.message || `Failed to fetch slots`;
          setError(errorMessage);
          setSlots([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSlots();

    return () => {
      isMounted = false;
    };
  }, [doctorId, dateString, api]);

  return { slots, isLoading, error };
}
