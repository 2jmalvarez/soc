// components/Header.tsx
import { signOut } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/"; // Redirigir al login o página principal
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#486b74] text-white p-4 z-10 shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">
          <Link href="/">
            <span className="text-white">Sistema de Gestión de Pacientes</span>
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-[#e47c61] text-white px-4 py-2 rounded hover:bg-[#ff5e36]"
        >
          Salir
        </button>
      </div>
    </header>
  );
};

export default Header;
