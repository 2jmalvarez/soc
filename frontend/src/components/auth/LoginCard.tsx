// frontend/src/components/LoginCard.tsx

import { LoadingSpinner } from "../common/LoadingSpinner";
import { Button, Input } from "../ui";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const LoginCard = () => {
  const { data: session, status } = useSession(); // Hook de NextAuth

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result) {
      setLoading(false);
    }

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/patients"); // Redirigir a la página principal
    }
  };
  useEffect(() => {
    if (session) {
      router.push("/patients"); // Redirige al login si no está autenticado
    }
  }, [session, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Login to Zentricx
        </h2>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              className="mt-1 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              className="mt-1 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 mt-4 flex items-center justify-center"
            disabled={loading}
          >
            <div className="flex ">
              {loading && <LoadingSpinner />} Ingresar
            </div>
          </Button>
        </form>
      </div>
    </div>
  );
};
