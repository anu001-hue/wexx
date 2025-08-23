import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export const useUserRole = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<{ role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
      setIsLoading(false);
    };

    fetchUserRole();
  }, [user?.id]);

  return {
    isLoading,
    isInterviewer: userData?.role === "interviewer",
    isCandidate: userData?.role === "candidate",
  };
};
