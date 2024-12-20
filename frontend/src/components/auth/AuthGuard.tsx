import { LoadingSpinner } from "../common/LoadingSpinner";
import { Redirect } from "../layouts/Redirect";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession(); // Hook de NextAuth
  const router = useRouter();
  const isAuthenticated = !!session; // Si hay sesión, está autenticado
  const isLoading = status === "loading";
  // console.log({ session, status, isAuthenticated });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/"); // Redirige al login si no está autenticado
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <LoadingSpinner color="text-sky-500" />
        <span style={{ marginLeft: "10px" }}>Cargando página...</span>
      </div>
    ); // Muestra algo mientras se verifica la sesión
  }

  if (!isAuthenticated) {
    return <Redirect />; // Evita mostrar el contenido hasta que se redirija
  }

  return <>{children}</>;
};

export default AuthGuard;
