import Header from "./Header";
import { Toaster } from "./ui/toaster";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="p-4">{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
