import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );
  useEffect(() => {
    window.addEventListener('storage', () => {
      const isAuth = !!localStorage.getItem("token");
      setIsAuthenticated(isAuth);
    });
    return () => {
      window.removeEventListener("storage", () => {
        const isAuth = !!localStorage.getItem("token");
        setIsAuthenticated(isAuth);
      });
    };
  }, []);
  return [isAuthenticated, setIsAuthenticated];
}
