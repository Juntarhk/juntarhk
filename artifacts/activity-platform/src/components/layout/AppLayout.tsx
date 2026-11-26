import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface AppLayoutProps {
  children: ReactNode;
  darkHero?: boolean;
}

export function AppLayout({ children, darkHero = true }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar darkHero={darkHero} />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
