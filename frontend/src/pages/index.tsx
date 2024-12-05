// frontend/src/pages/index.tsx
import { LoginCard } from "@/components/LoginCard";

const HomePage = () => {
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
