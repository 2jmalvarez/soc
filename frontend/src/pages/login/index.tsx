// frontend/src/pages/index.tsx

import { LoginCard } from "@/components/LoginCard";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/router";

const HomePage = () => {
  // const { data: session } = useSession();
  // const router = useRouter();

  // if (session) {
  //   router.push("/patients"); // Redirige si el usuario está autenticado
  //   return null; // Evita renderizar el componente mientras se redirige
  // }

  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/zentricx-background.jpg")' }}
    >
      <div className="absolute inset-0 bg-black opacity-50 blur-md"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <LoginCard />
      </div>
    </div>
  );
};

export default HomePage;
