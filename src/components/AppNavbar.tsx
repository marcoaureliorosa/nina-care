import React, { useEffect } from "react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import UserMenu from "./UserMenu";

const menu = [
  { title: "Dashboard", url: "/" },
  { title: "Conversas", url: "/conversas" },
  { title: "Pacientes", url: "/pacientes" },
  { title: "Agenda", url: "/agenda" },
  { title: "Importações", url: "/importacoes" },
  { title: "Configurações", url: "/configuracoes" },
];

export default function AppNavbar() {
  // Renderiza itens do menu principal
  const renderMenuItem = (item) => (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <a href={item.url} className="px-4 py-2 text-sm font-medium text-zinc-800 hover:text-ninacare-primary transition-colors">
          {item.title}
        </a>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );

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
            <Button asChild variant="ghost" className="justify-start w-full" key={item.title}>
              <a href={item.url}>{item.title}</a>
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="w-full bg-white shadow-lg border-0 rounded-2xl mt-2 mb-4 px-4 py-2 flex items-center justify-between">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 font-bold text-ninacare-primary text-xl">
        <span>NinaCare</span>
      </a>
      {/* Navegação central (desktop) */}
      <nav className="hidden lg:flex flex-1 justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            {menu.map(renderMenuItem)}
          </NavigationMenuList>
        </NavigationMenu>
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