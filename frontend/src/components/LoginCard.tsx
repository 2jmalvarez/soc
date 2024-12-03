// frontend/src/components/LoginCard.tsx

import { Button, Input } from "./ui";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log({ result });
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/patients"); // Redirigir a la página principal
    }
  };

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
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 mt-4"
          >
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
};
