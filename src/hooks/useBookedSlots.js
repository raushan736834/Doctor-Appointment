import { useState, useEffect } from "react";
import { format } from "date-fns";
import useAxios from "@/hooks/useAxios";
import useAuth from "./useAuth";

export function useBookedSlots(doctorId, date) {
  const { fetchData } = useAxios();
  const [bookedSlots, setBookedSlots] = useState([]);
  const { setIsLoading, isLoading } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!doctorId || !date) return;
    setIsLoading(true);
    setError("");
    fetchData({
      url: "/appointment/booked-slots",
      method: "post",
      data: {
        date: format(date, "yyyy-MM-dd"),
        doctor: { id: doctorId },
      },
    })
      .then((response) => {
        setBookedSlots((response.data || []).map((slot) => slot.trim()));
        console.log(response)
      })
      .catch(() => setError("Failed to fetch availability"))
      .finally(() => setIsLoading(false));
  }, [doctorId, date, fetchData]);

  return { bookedSlots, isLoading, error };
}
