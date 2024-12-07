import { Toaster } from "../ui/toaster";
import Header from "./Header";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="">{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
