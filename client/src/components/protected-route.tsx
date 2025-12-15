import { useEffect, useState } from "react";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: React.ComponentProps<"div">) {
  const [isAuth, setIsAuth] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/me", {
      credentials: "include",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => setIsAuth(res.ok))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <Navigate to="/login" />;
  if (!isAuth) return <Navigate to="/login" />;

  return children;
}
