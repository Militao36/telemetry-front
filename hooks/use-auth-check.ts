"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/api/api";

interface UseAuthCheckProps {
  redirectIfAuthenticated?: string;
  redirectIfNotAuthenticated?: string;
}

export function useAuthCheck({
  redirectIfAuthenticated,
  redirectIfNotAuthenticated
}: UseAuthCheckProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleNotAuthenticated = () => {
    localStorage.clear();
    setIsAuthenticated(false);

    if (redirectIfNotAuthenticated) {
      router.replace(redirectIfNotAuthenticated);
    }
  }

  useEffect(() => {
    async function validateToken() {
      const token = localStorage.getItem("token");

      if (!token) {
        handleNotAuthenticated()

        return;
      }

      try {
        const { data } = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data) {
          setIsAuthenticated(true);

          if (redirectIfAuthenticated) {
            router.replace(redirectIfAuthenticated);
          }
        } else {
          handleNotAuthenticated()
        }
      } catch (error) {
        handleNotAuthenticated()
      }

      setLoading(false);
    }

    validateToken();
  }, [
    router,
    redirectIfAuthenticated,
    redirectIfNotAuthenticated
  ]);

  return { loading, isAuthenticated };
}
