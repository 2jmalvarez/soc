import { AppProps } from "next/app";
import "@/globals.css";

// muchas horas

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
