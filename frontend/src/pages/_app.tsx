import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../globals.css";
import AuthGuard from "@/components/auth/AuthGuard";
import Layout from "@/components/layouts/Layout";
import { Toaster } from "@/components/ui/toaster";

const protectedRoutes = ["/patients", "/another-protected-route"]; // Rutas que requieren autenticación

function MyApp({ Component, pageProps, router }: AppProps) {
  const isProtected = protectedRoutes.some((route) =>
    router.pathname.startsWith(route)
  );

  return (
    <SessionProvider session={pageProps.session}>
      {isProtected ? (
        <AuthGuard>
          <Layout>
            <Component {...pageProps} />{" "}
          </Layout>
        </AuthGuard>
      ) : (
        <Component {...pageProps} />
      )}
      <Toaster />
    </SessionProvider>
  );
}

export default MyApp;
