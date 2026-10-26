import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}${url}`, {
          signal: controller.signal,
          credentials: "include",
        });

        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return {
    data,
    loading,
    error,
  };
}
