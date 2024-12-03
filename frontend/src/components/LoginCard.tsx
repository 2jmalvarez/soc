// frontend/src/components/LoginCard.tsx

import { Button, Input } from "./ui";

export const LoginCard = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Login to Zentricx
        </h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input id="email" type="email" className="mt-1 w-full" />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input id="password" type="password" className="mt-1 w-full" />
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
