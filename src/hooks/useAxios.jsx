import { useState, useEffect, useCallback,useMemo } from "react";
import axios from "axios";
import useAuth from "./useAuth";
export const baseUrl = "http://localhost:8080";

const useAxios = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  const axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: auth?.accessToken ? `Bearer ${auth.accessToken}` : "",
        withCredentials: true,
      },
    });

  const fetchData = useCallback(
    async ({ url, method = "GET", data: bodyData, headers = {},signal } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance({
          url: url,
          method: method,
          data: bodyData,
          headers: { ...headers },
          signal:signal
        });
        setData(response.data);
        return response;
      } catch (err) {
        console.log(err);
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
        throw err.response?.data;
      } finally {
        setLoading(false);
      }
    },
    [auth?.accessToken]
  );

  return { data, loading, error, fetchData };
};

export default useAxios;
