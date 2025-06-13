import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import UserMenu from "./UserMenu";

const menu = [
  { title: "Dashboard", url: "/" },
  { title: "Conversas", url: "/conversas" },
  { title: "Pacientes", url: "/pacientes" },
  { title: "Agenda", url: "/agenda" },
  { title: "Importações", url: "/importacoes" },
  { title: "Acompanhamentos Programados", url: "/acompanhamentos" },
  { title: "Configurações", url: "/configuracoes" },
];

export default function AppNavbar() {
  const navigate = useNavigate();

  // Menu mobile (Sheet)
  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <nav className="flex flex-col gap-2 mt-8 px-4">
          {menu.map((item) => (
            <Button 
              variant="ghost" 
              className="justify-start w-full" 
              key={item.title}
              onClick={() => navigate(item.url)}
            >
              {item.title}
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="w-full bg-white shadow-lg border-0 rounded-2xl mt-2 mb-4 px-4 py-2 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-bold text-ninacare-primary text-xl">
        <span>Ninacare</span>
      </Link>
      {/* Navegação central (desktop) */}
      <nav className="hidden lg:flex flex-1 justify-center">
        <div className="flex items-center gap-2">
          {menu.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className="px-4 py-2 text-sm font-medium text-zinc-800 hover:text-ninacare-primary transition-colors cursor-pointer rounded-md hover:bg-gray-50"
            >
              {item.title}
            </button>
          ))}
        </div>
      </nav>
      {/* Ações à direita */}
      <div className="flex items-center gap-2">
        <div className="hidden lg:block">
          <UserMenu />
        </div>
        {/* Menu mobile */}
        <MobileMenu />
      </div>
    </header>
  );
} 