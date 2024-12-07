import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../globals.css";
import AuthGuard from "@/components/auth/AuthGuard";
import Layout from "@/components/layouts/Layout";

const protectedRoutes = ["/patients", "/another-protected-route"]; // Rutas que requieren autenticación

function MyApp({ Component, pageProps, router }: AppProps) {
  const isProtected = protectedRoutes.some((route) =>
    router.pathname.startsWith(route)
  );

  return (
    <SessionProvider session={pageProps.session}>
      <AuthGuard>
        {isProtected ? (
          <Layout>
            <Component {...pageProps} />{" "}
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </AuthGuard>
    </SessionProvider>
  );
}

export default MyApp;
